// src/lib/axiosInstance.ts
"use client";

import axios, { AxiosError } from "axios";
import { token } from "./authTokens";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // so refresh cookie is sent automatically
});

// Attach access token before each request
axiosInstance.interceptors.request.use((config) => {
    const at = token.get();
    if (at && config.headers) {
        config.headers.Authorization = `Bearer ${at}`;
    }
    return config;
});

// Handle 401 → try refresh once
let isRefreshing = false;
let queue: { resolve: (t: string) => void; reject: (e: any) => void }[] = [];

function processQueue(err: any, newToken: string | null = null) {
    queue.forEach((p) => {
        if (err) p.reject(err);
        else if (newToken) p.resolve(newToken);
    });
    queue = [];
}

axiosInstance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const original = error.config as any;
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    queue.push({
                        resolve: (newToken) => {
                            if (original.headers) {
                                original.headers.Authorization = `Bearer ${newToken}`;
                            }
                            resolve(axiosInstance(original));
                        },
                        reject,
                    });
                });
            }

            isRefreshing = true;
            try {
                // hit refresh endpoint — refresh token is httpOnly cookie
                const res = await axios.post<{ accessToken: string }>(
                    `${API_BASE}/auth/v2/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                const newToken = res.data.accessToken;
                token.set(newToken); // persist + update header
                processQueue(null, newToken);

                if (original.headers) {
                    original.headers.Authorization = `Bearer ${newToken}`;
                }
                return axiosInstance(original);
            } catch (err) {
                processQueue(err, null);
                token.clear();
                if (typeof window !== "undefined") {
                    window.location.href = "/auth/signin";
                }
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
