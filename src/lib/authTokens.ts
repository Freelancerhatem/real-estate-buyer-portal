// lib/authTokens.ts
import Cookies from "js-cookie";
import { protectedApi } from "./axiosInstance";

const ACCESS_COOKIE = "accessToken";
const ACCESS_TTL_MIN = 15;

export const token = {
    get() {
        return Cookies.get(ACCESS_COOKIE) ?? null;
    },

    set(at: string) {
        Cookies.set(ACCESS_COOKIE, at, {
            secure: true,
            sameSite: "strict",
            expires: ACCESS_TTL_MIN / (60 * 24), // 15 min in days
        });
        protectedApi.defaults.headers.common.Authorization = `Bearer ${at}`;
    },

    clear() {
        Cookies.remove(ACCESS_COOKIE);
        delete protectedApi.defaults.headers.common.Authorization;
    },

    primeFromCookie() {
        const at = this.get();
        if (at) this.set(at);
    },
};
