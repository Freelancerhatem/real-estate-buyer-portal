"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

export type Collection = {
    _id: string;
    name: string;
    isDefault?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type PropertyLite = {
    _id: string;
    title?: string;
    thumbnail?: string;
    price?: number;
    location?: {
        country?: string;
        city?: string;
        address?: string;
        postalCode?: string;
    };
    // add any fields your UI needs
};

export type CollectionItem = {
    _id: string;
    propertyId: PropertyLite; // populated
    createdAt?: string;
    updatedAt?: string;
};

type UseCollectionsOptions = {
    /** auto fetch on mount (default: true) */
    initOnMount?: boolean;
    // endpoint overrides if needed
    listUrl?: string;                                   // GET `/collections`
    createUrl?: string;                                 // POST `/collections`
    itemsBase?: (collectionId: string) => string;       // `/collections/:id/items`
};

export function useCollections({
    initOnMount = true,
    listUrl = "/collections",
    createUrl = "/collections",
    itemsBase = (id) => `/collections/${id}/items`,
}: UseCollectionsOptions = {}) {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(!!initOnMount);
    const [error, setError] = useState<unknown>(null);
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axiosInstance.get<{ collections: Collection[] }>(listUrl);
            if (!mounted.current) return [];
            setCollections(data?.collections ?? []);
            return data?.collections ?? [];
        } catch (e) {
            if (mounted.current) setError(e);
            return [];
        } finally {
            if (mounted.current) setLoading(false);
        }
    }, [listUrl]);

    useEffect(() => {
        if (!initOnMount) return;
        void refresh();
    }, [initOnMount, refresh]);

    const createCollection = useCallback(
        async (name: string, isDefault?: boolean) => {
            const payload = { name, ...(isDefault != null ? { isDefault } : {}) };
            const { data } = await axiosInstance.post<{ collection: Collection }>(createUrl, payload);
            const created = data.collection;
            setCollections((prev) => [created, ...prev]);
            return created;
        },
        [createUrl]
    );

    const addToCollection = useCallback(
        async (collectionId: string, propertyId: string) => {
            const url = itemsBase(collectionId);
            await axiosInstance.post(url, { propertyId });
            return true;
        },
        [itemsBase]
    );

    const removeFromCollection = useCallback(
        async (collectionId: string, propertyId: string) => {
            const url = itemsBase(collectionId);
            await axiosInstance.delete(url, { data: { propertyId } });
            return true;
        },
        [itemsBase]
    );

    const listItems = useCallback(
        async (collectionId: string) => {
            const url = itemsBase(collectionId);
            const { data } = await axiosInstance.get<{ items: CollectionItem[] }>(url);
            return data.items || [];
        },
        [itemsBase]
    );

    return {
        // state
        collections,
        loading,
        error,

        // actions
        refresh,
        createCollection,
        addToCollection,
        removeFromCollection,
        listItems,
    };
}
