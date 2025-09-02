"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { authService } from "@/services/auth";
import { AuthUser } from "@/types/auth";
import { token } from "@/lib/authTokens";

type Provider = "google" | "facebook";

type SessionUserWithBackend = {
    backendToken?: string;
};

export function useUnifiedAuth() {
    const router = useRouter();
    const pathname = usePathname() ?? "/";
    const searchParams = useSearchParams();
    const { data: session, status: sessionStatus } = useSession();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const redirect = useMemo<string>(() => {
        const r = searchParams?.get("redirect");
        return r && r.startsWith("/") ? decodeURIComponent(r) : "/";
    }, [searchParams]);

    // bootstrap current user (NextAuth session → backend token → /me)
    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                // 1) If NextAuth session has a backend token, prefer it
                if (sessionStatus === "authenticated") {
                    const at =
                        (session?.user as SessionUserWithBackend | undefined)?.backendToken;
                    if (at) {
                        token.set(at);
                        const u = await authService.me();
                        if (!cancelled) setUser(u);
                        return;
                    }
                }

                // 2) Otherwise, try cookie (existing access token)
                token.primeFromCookie();
                try {
                    const u = await authService.me();
                    if (!cancelled) {
                        setUser(u);
                        return;
                    }
                } catch {
                    // 3) Fallback: refresh → me
                    const { accessToken } = await authService.refresh();
                    token.set(accessToken);
                    const u = await authService.me();
                    if (!cancelled) setUser(u);
                }
            } catch {
                // hard fail → clear auth state
                token.clear();
                if (!cancelled) setUser(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        // Only run after session status settles (avoids duplicate work while "loading")
        if (sessionStatus !== "loading") {
            run();
        }

        return () => {
            cancelled = true;
        };
    }, [sessionStatus, session]);

    const login = useCallback(
        async (email: string, password: string): Promise<boolean> => {
            setLoading(true);
            try {
                const { accessToken } = await authService.login(email, password);
                token.set(accessToken);
                const u = await authService.me();
                setUser(u);
                router.push(redirect);
                router.refresh();
                return true;
            } catch (e) {
                token.clear();
                setUser(null);
                throw e;
            } finally {
                setLoading(false);
            }
        },
        [redirect, router]
    );

    const socialLogin = useCallback(
        async (provider: Provider, cbUrl?: string): Promise<void> => {
            await signIn(provider, { callbackUrl: cbUrl ?? pathname });
        },
        [pathname]
    );

    const logout = useCallback(async (): Promise<void> => {
        try {
            await authService.logout();
        } catch {
            // ignore network/API errors on logout; continue client cleanup
        } finally {
            token.clear();
            setUser(null);
            await signOut({ redirect: false });
            router.push("/");
            router.refresh();
        }
    }, [router]);

    return { user, setUser, loading, login, socialLogin, logout };
}
