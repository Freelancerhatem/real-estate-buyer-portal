// services/auth.service.ts
import axiosInstance from "@/lib/axiosInstance";
import { AuthUser, MeResponse, LoginResponse, RefreshResponse } from "@/types/auth";

export const authService = {
    me: async () => {
        const res = await axiosInstance.get<MeResponse>("/auth/v2/me");
        return res.data.user as AuthUser;
    },
    login: async (email: string, password: string) => {
        const res = await axiosInstance.post<LoginResponse>("/auth/v2/login", { email, password });
        return res.data; // { message, accessToken }
    },
    refresh: async () => {
        const res = await axiosInstance.post<RefreshResponse>("/auth/v2/refresh-token");
        return res.data; // { accessToken }
    },
    logout: async () => {
        await axiosInstance.post("/auth/v2/logout");
    },
};
