"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

export type FavoriteCheckResponse = { isFavorite?: boolean } | null;

type UseFavoriteOptions = {
    propertyId: string;
    /** auto-check on mount (default: true) */
    initOnMount?: boolean;
    /** override endpoints if needed */
    getUrl?: (id: string) => string;      // default: `/favorites/:id`
    addUrl?: string;                      // default: `/favorites`
    removeUrl?: string;                   // default: `/favorites`
};

type ToggleCallbacks = {
    onSuccess?: (fav: boolean) => void;
    onError?: (fav: boolean, error?: unknown) => void;
};

export function useFavorite({
    propertyId,
    initOnMount = true,
    getUrl = (id) => `/v2/favorites/${id}`,
    addUrl = "/v2/favorites",
    removeUrl = "/v2/favorites",
}: UseFavoriteOptions) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(!!initOnMount);
    const [error, setError] = useState<unknown>(null);
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    // initialize from backend
    useEffect(() => {
        if (!initOnMount || !propertyId) return;
        const controller = new AbortController();

        (async () => {
            try {
                setInitLoading(true);
                setError(null);
                const res = await axiosInstance.get<FavoriteCheckResponse>(
                    getUrl(propertyId),
                    { signal: controller.signal }
                );
                if (!mounted.current) return;
                setIsFavorite(Boolean(res.data?.isFavorite));
            } catch (e) {
                if (!mounted.current) return;
                // ignore aborts; store other errors
                if ((e as any)?.name !== "CanceledError") setError(e);
            } finally {
                if (mounted.current) setInitLoading(false);
            }
        })();

        return () => controller.abort();
    }, [getUrl, initOnMount, propertyId]);

    const add = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await axiosInstance.post(addUrl, { propertyId });
            if (mounted.current) setIsFavorite(true);
            return true;
        } catch (e) {
            if (mounted.current) setError(e);
            return false;
        } finally {
            if (mounted.current) setLoading(false);
        }
    }, [addUrl, propertyId]);

    const remove = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await axiosInstance.delete(removeUrl, { data: { propertyId } });
            if (mounted.current) setIsFavorite(false);
            return true;
        } catch (e) {
            if (mounted.current) setError(e);
            return false;
        } finally {
            if (mounted.current) setLoading(false);
        }
    }, [removeUrl, propertyId]);

    // optimistic toggle with rollback
    const toggle = useCallback(
        async (cb?: ToggleCallbacks) => {
            const prev = isFavorite;
            setIsFavorite(!prev);
            const ok = prev ? await remove() : await add();
            if (!ok) {
                // rollback
                setIsFavorite(prev);
                cb?.onError?.(prev, error);
                return false;
            }
            cb?.onSuccess?.(!prev);
            return true;
        },
        [add, remove, isFavorite, error]
    );

    return {
        isFavorite,
        loading: loading || initLoading,
        initLoading,
        error,
        setIsFavorite,
        add,
        remove,
        toggle,
    };
}
