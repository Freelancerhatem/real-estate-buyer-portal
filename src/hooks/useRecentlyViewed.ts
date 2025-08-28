"use client";

import { useEffect, useState, useCallback } from "react";
import { listing } from "@/types/listing";

const useRecentlyViewed = () => {
    const [recentProperties, setRecentProperties] = useState<listing[]>([]);

    // Load recently viewed from localStorage
    const loadRecentlyViewedProperties = useCallback(() => {
        if (typeof window === "undefined") return;

        const saved = localStorage.getItem("recentlyViewed");
        const parsed: listing[] = saved ? JSON.parse(saved) : [];
        setRecentProperties(parsed);
    }, []);

    const saveRecentlyViewedProperty = useCallback((property: listing) => {
        if (typeof window === "undefined") return;

        let viewedProperties: listing[] = [];

        const saved = localStorage.getItem("recentlyViewed");
        if (saved) {
            viewedProperties = JSON.parse(saved);
        }

        // Remove duplicate
        viewedProperties = viewedProperties.filter((p) => p._id !== property._id);

        // Add new to front
        viewedProperties.unshift(property);

        // Limit to 5
        viewedProperties = viewedProperties.slice(0, 5);

        // Save back
        localStorage.setItem("recentlyViewed", JSON.stringify(viewedProperties));
        setRecentProperties(viewedProperties);
    }, []);

    const getRecentlyViewedProperties = useCallback((): listing[] => {
        return recentProperties;
    }, [recentProperties]);

    const clearAllRecentlyViewed = useCallback(() => {
        if (typeof window === "undefined") return;
        localStorage.removeItem("recentlyViewed");
        setRecentProperties([]);
    }, []);

    const removeRecentlyViewedProperty = useCallback((propertyId: string) => {
        if (typeof window === "undefined") return;

        const saved = localStorage.getItem("recentlyViewed");
        if (saved) {
            let viewedProperties: listing[] = JSON.parse(saved);
            viewedProperties = viewedProperties.filter((p) => p._id !== propertyId);
            localStorage.setItem("recentlyViewed", JSON.stringify(viewedProperties));
            setRecentProperties(viewedProperties);
        }
    }, []);

    // Load on mount
    useEffect(() => {
        loadRecentlyViewedProperties();
    }, [loadRecentlyViewedProperties]);

    return {
        saveRecentlyViewedProperty,
        getRecentlyViewedProperties,
        clearAllRecentlyViewed,
        removeRecentlyViewedProperty,
    };
};

export default useRecentlyViewed;
