import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { listing } from "@/types/listing";
import axiosInstance, { publicApi } from "@/lib/axiosInstance";

interface UsePropertiesParams {
    all?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: "asc" | "desc";
    priceMin?: number;
    priceMax?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    status?: string;
    searchQuery?: string;
    amenities?: string[];
}

interface Pagination {
    total: number;
    page: number;
    pages: number;
    limit: number;
}

const useProperties = (params: UsePropertiesParams = {}) => {
    const [properties, setProperties] = useState<listing[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ Prevents infinite re-fetching by comparing stable param string
    const stringifiedParams = useMemo(() => JSON.stringify(params), [params]);

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const parsedParams: UsePropertiesParams = JSON.parse(stringifiedParams);
            const queryParams = new URLSearchParams();

            for (const [key, value] of Object.entries(parsedParams)) {
                if (
                    value !== undefined &&
                    value !== null &&
                    !(Array.isArray(value) && value.length === 0)
                ) {
                    if (Array.isArray(value)) {
                        value.forEach((v) => queryParams.append(key, v));
                    } else {
                        queryParams.append(key, String(value));
                    }
                }
            }

            const response = await publicApi.get(`/properties?${queryParams.toString()}`);
            const data = response.data.data;

            if (parsedParams.all) {
                setProperties(data);
                setPagination(null);
            } else {
                setProperties(data.properties || []);
                setPagination(data.pagination || null);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    }, [stringifiedParams]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    return {
        properties,
        pagination,
        loading,
        error,
        refetch: fetchProperties,
    };
};

export default useProperties;
