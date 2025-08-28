import type { listing } from "@/types/listing";

export type SortKey = "recent" | "price_asc" | "price_desc";

export type FiltersState = {
    q: string;
    city: string;
    type: string;
    beds: string;
    minPrice: string;
    maxPrice: string;
    sort: SortKey;
    page: number;
    limit: number;
};

export type PaginationMeta = {
    total: number;
    page: number;
    pages: number;
    limit: number;
};

export type PaginatedPropertiesData = {
    properties: listing[];
    pagination: PaginationMeta;
};

export type ApiEnvelope<T> = {
    status: "success" | "error";
    message: string;
    data: T;
};
export type PropertiesEnvelope =
    | ApiEnvelope<PaginatedPropertiesData>
    | ApiEnvelope<listing[]>;
