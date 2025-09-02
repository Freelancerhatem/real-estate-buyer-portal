"use client";

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { token } from "./authTokens";

const API_BASE = process.env.NEXT_PUBLIC_API_URL as string;

export const publicApi = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const protectedApi = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

protectedApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const at = token.get();
    if (at && config.headers) config.headers.Authorization = `Bearer ${at}`;
    return config;
});

let isRefreshing = false;
let queue: { resolve: (t: string) => void; reject: (e: unknown) => void }[] = [];
const flush = (err: unknown, newToken: string | null) => {
    queue.forEach(({ resolve, reject }) => (err ? reject(err) : newToken ? resolve(newToken) : reject(err)));
    queue = [];
};

const shouldRefresh = (error: AxiosError) => {
    const s = error.response?.status;
    if (s === 401) return true;
    // Narrow this if your API differentiates RBAC vs expired token:
    // return s === 403 && (error.response?.data as any)?.code === "TOKEN_EXPIRED";
    return s === 403;
};

protectedApi.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
        if (!original) return Promise.reject(error);

        const isRefreshCall = original.url?.includes("/auth/v2/refresh-token");
        if (original._retry || isRefreshCall || !shouldRefresh(error)) return Promise.reject(error);

        original._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                queue.push({
                    resolve: (newToken) => {
                        if (original.headers) original.headers.Authorization = `Bearer ${newToken}`;
                        resolve(protectedApi(original));
                    },
                    reject,
                });
            });
        }

        isRefreshing = true;
        try {
            const { data } = await publicApi.post<{ accessToken: string }>("/auth/v2/refresh-token", {}, { withCredentials: true });
            const newToken = data.accessToken;
            token.set(newToken);
            flush(null, newToken);
            if (original.headers) original.headers.Authorization = `Bearer ${newToken}`;
            return protectedApi(original);
        } catch (err) {
            flush(err, null);
            try { token.clear(); } catch { }
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
);
