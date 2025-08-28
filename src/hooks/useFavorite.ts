import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/hooks/useAuth";
import type { AxiosError } from "axios";

type FavoriteDoc = {
    _id: string;
    userId: string;
    propertyId: { _id: string };
    createdAt?: string;
    updatedAt?: string;
};

type FavoritesListResp = {
    status: "success" | "fail";
    data: FavoriteDoc[];
};

type ToggleResp = {
    status: "success" | "fail";
    message?: string;
};

export const useFavorite = (propertyId?: string) => {
    const { user, loading } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);

    // Fetch current favorite status
    useEffect(() => {
        if (!user || loading || !propertyId) return;

        const ac = new AbortController();

        (async () => {
            try {
                const resp = await axiosInstance.get<FavoritesListResp>(
                    `/favorites/${user._id}`,
                    { signal: ac.signal }
                );
                const isFav = resp.data.data.some(
                    (fav) => fav.propertyId?._id === propertyId
                );
                setIsFavorite(isFav);
            } catch (err: unknown) {
                if ((err as AxiosError).code === "ERR_CANCELED") return;
                console.error("Error fetching favorite status:", err);
            }
        })();

        return () => ac.abort();
    }, [user, loading, propertyId]);

    // Optimistic toggle with rollback
    const toggleFavorite = useCallback(async () => {
        if (loading) return;
        if (!user) {
            console.error("User not logged in.");
            return;
        }
        if (!propertyId) {
            console.error("Missing propertyId.");
            return;
        }

        const next = !isFavorite;
        setIsFavorite(next); // optimistic

        try {
            if (next) {
                // Add favorite
                const resp = await axiosInstance.post<ToggleResp>(`/favorites`, {
                    userId: user._id,
                    propertyId,
                });
                if (resp.data.status !== "success") throw new Error("Add favorite failed");
            } else {
                // Remove favorite
                const resp = await axiosInstance.delete<ToggleResp>(`/favorites`, {
                    data: { userId: user._id, propertyId },
                });
                if (resp.data.status !== "success") throw new Error("Remove favorite failed");
            }
        } catch (err) {
            // rollback
            setIsFavorite((prev) => !prev);
            console.error("Error toggling favorite status:", err);
        }
    }, [isFavorite, loading, propertyId, user]);

    return { isFavorite, toggleFavorite };
};
