// hooks/useUnifiedAuth.ts
"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { authService } from "@/services/auth.service";
import { AuthUser } from "@/types/auth";
import { token } from "@/lib/authTokens";


type Provider = "google" | "facebook";

export function useUnifiedAuth() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data: session, status: sessionStatus } = useSession();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const redirect = useMemo(() => {
        const r = searchParams.get("redirect");
        return r && r.startsWith("/") ? decodeURIComponent(r) : "/";
    }, [searchParams]);

    // bootstrap
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                if (sessionStatus === "authenticated") {
                    const at = (session?.user as any)?.backendToken as string | undefined;
                    if (at) {
                        token.set(at);
                        const u = await authService.me();
                        if (!cancelled) setUser(u);
                        return;
                    }
                }
                token.primeFromCookie();
                try {
                    const u = await authService.me();
                    if (!cancelled) { setUser(u); return; }
                } catch {
                    const { accessToken } = await authService.refresh();
                    token.set(accessToken);
                    const u = await authService.me();
                    if (!cancelled) setUser(u);
                }
            } catch {
                token.clear();
                if (!cancelled) setUser(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [sessionStatus, session]);

    const login = useCallback(async (email: string, password: string) => {
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
    }, [redirect, router]);

    const socialLogin = useCallback(async (provider: Provider, cbUrl?: string) => {
        await signIn(provider, { callbackUrl: cbUrl ?? (pathname || "/") });
    }, [pathname]);

    const logout = useCallback(async () => {
        try { await authService.logout(); } catch { }
        token.clear();
        setUser(null);
        await signOut({ redirect: false });
        router.push("/");
        router.refresh();
    }, [router]);

    return { user, setUser, loading, login, socialLogin, logout };
}
