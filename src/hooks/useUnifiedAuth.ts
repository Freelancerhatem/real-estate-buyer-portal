"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import axiosInstance from "@/lib/axiosInstance";
import type { StaticImageData } from "next/image";
import type { listing } from "@/types/listing";

type Provider = "google" | "facebook";

export type AuthUser = {
    _id?: string;
    id?: string;
    username?: string;
    email?: string | null;
    firstName?: string;
    lastName?: string;
    name?: string | null;
    profilePicture?: string | StaticImageData | null;
    image?: string | StaticImageData | null;
    role?: string;
    subrole?: string[];
    properties?: listing[];
    status?: string;
    lastLogin?: string | null;
    deleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

type MeResponse = { user: AuthUser };
type LoginResponse = { message: string; accessToken: string };
type RefreshResponse = { accessToken: string };

function setAuthHeader(token?: string | null) {
    if (token) {
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common.Authorization;
    }
}

export function useUnifiedAuth() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // NextAuth session 
    const { data: session, status: sessionStatus } = useSession();

    // Local app user state
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const redirect = useMemo(() => {
        const r = searchParams.get("redirect");
        return r && r.startsWith("/") ? decodeURIComponent(r) : "/";
    }, [searchParams]);

    // ---- Helpers -------------------------------------------------------------

    const fetchMe = useCallback(async () => {
        const res = await axiosInstance.get<MeResponse>("/auth/v2/me");
        setUser(res.data.user);
    }, []);

    const tryRefresh = useCallback(async () => {
        // Ask backend to rotate RT -> get new AT
        const { data } = await axiosInstance.post<RefreshResponse>("/auth/v2/refresh-token");
        setAuthHeader(data.accessToken);
    }, []);

    // ---- Bootstrapping: decide where our token comes from --------------------

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                // 1) If NextAuth is authenticated and has a backendToken, prefer that
                if (sessionStatus === "authenticated") {
                    const token = (session?.user as any)?.backendToken as string | undefined;
                    if (token) {
                        setAuthHeader(token);
                        await fetchMe();
                        if (!cancelled) setLoading(false);
                        return;
                    }
                    // If no backendToken in the session, fall through to refresh flow
                }

                // 2) Otherwise, try backend refresh-cookie flow to obtain a new access token
                await tryRefresh();
                await fetchMe();
            } catch {
                // Not logged in
                setAuthHeader(null);
                setUser(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [sessionStatus, session, fetchMe, tryRefresh]);

    // ---- Public API ----------------------------------------------------------

    // Email/password login (your custom JWT)
    const login = useCallback(
        async (email: string, password: string) => {
            setLoading(true);
            try {
                const { data } = await axiosInstance.post<LoginResponse>("/auth/v2/login", {
                    email,
                    password,
                });

                // set access token for this runtime
                setAuthHeader(data.accessToken);

                // fetch user profile
                await fetchMe();

                // navigate
                const destination =
                    typeof redirect === "string" && redirect.startsWith("/") ? redirect : "/";
                router.push(destination);
                router.refresh();

                return true;
            } catch (err) {
                setAuthHeader(null);
                setUser(null);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [fetchMe, redirect, router]
    );

    // Social login via NextAuth (Google/Facebook)
    const socialLogin = useCallback(
        async (provider: Provider, cbUrl?: string) => {
            const callbackUrl = cbUrl ?? (pathname || "/");
            // This starts the OAuth flow; once NextAuth completes, our bootstrapping
            // effect above will see the session and use session.user.backendToken.
            await signIn(provider, { callbackUrl });
        },
        [pathname]
    );

    // Unified logout: backend + NextAuth
    const logout = useCallback(async () => {
        try {
            // Invalidate backend refresh token + clear cookie
            await axiosInstance.post("/auth/v2/logout");
        } catch {
            // ignore
        } finally {
            // Clear app auth header and state
            setAuthHeader(null);
            setUser(null);
            // Also sign out of NextAuth if user was authenticated there
            await signOut({ redirect: false });
            router.push("/");
            router.refresh();
        }
    }, [router]);

    return {
        user,
        setUser,      // if you need to set from other places
        loading,
        // actions
        login,        // email/password
        socialLogin,  // next-auth providers
        logout,
    };
}
