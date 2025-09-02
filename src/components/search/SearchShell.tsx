"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { publicApi } from "@/lib/axiosInstance";
import SearchBar from "./SearchBar";
import Filters from "./Filters";
import Results from "./Results";
import Pagination from "./Pagination";
import type {
  FiltersState,
  PropertiesEnvelope,
  PaginatedPropertiesData,
} from "./types";
import type { listing } from "@/types/listing";

const DEFAULT_LIMIT = 12;

function parseNumber(value: string | null, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function toState(params: URLSearchParams): FiltersState {
  return {
    q: params.get("q") ?? "",
    city: params.get("city") ?? "",
    type: params.get("type") ?? "",
    beds: params.get("beds") ?? "",
    minPrice: params.get("minPrice") ?? "",
    maxPrice: params.get("maxPrice") ?? "",
    sort: (params.get("sort") as FiltersState["sort"]) ?? "recent",
    page: parseNumber(params.get("page"), 1),
    limit: parseNumber(params.get("limit"), DEFAULT_LIMIT),
  };
}

function mapSort(sort: FiltersState["sort"]): {
  sortBy: string;
  order: "asc" | "desc";
} {
  switch (sort) {
    case "price_asc":
      return { sortBy: "price", order: "asc" };
    case "price_desc":
      return { sortBy: "price", order: "desc" };
    case "recent":
    default:
      return { sortBy: "createdAt", order: "desc" };
  }
}

function buildQuery(s: FiltersState) {
  const qs = new URLSearchParams();
  if (s.q) qs.set("q", s.q);
  if (s.city) qs.set("city", s.city);
  // map UI -> backend names
  if (s.type) qs.set("propertyType", s.type);
  if (s.beds) qs.set("totalBedrooms", s.beds);
  if (s.minPrice) qs.set("minPrice", s.minPrice);
  if (s.maxPrice) qs.set("maxPrice", s.maxPrice);

  const { sortBy, order } = mapSort(s.sort);
  qs.set("sortBy", sortBy);
  qs.set("order", order);

  if (s.page > 1) qs.set("page", String(s.page));
  if (s.limit !== DEFAULT_LIMIT) qs.set("limit", String(s.limit));

  // do NOT set all=true (we want pagination)
  return qs.toString();
}

export default function SearchShell() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [state, setState] = useState<FiltersState>(() =>
    toState(new URLSearchParams(params?.toString()))
  );
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<listing[]>([]);

  const [pages, setPages] = useState(1);

  // sync state when the URL changes (back/forward, etc.)
  useEffect(() => {
    const next = toState(new URLSearchParams(params?.toString()));
    setState(next);
  }, [params]);

  // fetch on state change
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const qs = buildQuery(state);
        const { data } = await publicApi.get<PropertiesEnvelope>(
          `/properties${qs ? `?${qs}` : ""}`
        );

        if (cancelled) return;

        const payload = data.data;
        if (Array.isArray(payload)) {
          // ?all=true case — not used for our paginated UI, but we handle gracefully
          setItems(payload);

          setPages(1);
        } else {
          const paginated = payload as PaginatedPropertiesData;
          setItems(paginated.properties ?? []);

          setPages(paginated.pagination?.pages ?? 1);
        }
      } catch {
        if (!cancelled) {
          setItems([]);

          setPages(1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [
    state.q,
    state.city,
    state.type,
    state.beds,
    state.minPrice,
    state.maxPrice,
    state.sort,
    state.page,
    state.limit,
    state,
  ]);

  const setUrlState = (partial: Partial<FiltersState>) => {
    const next = { ...state, ...partial };
    if (partial.page === undefined) next.page = 1;
    const qs = buildQuery(next);
    router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: true });
  };

  const totalPages = useMemo(() => Math.max(1, pages), [pages]);

  return (
    <div className="max-w-7xl  mx-auto px-4 py-6 md:py-16">
      <h1 className="text-xl md:text-2xl font-semibold">Search properties</h1>

      <div className="mt-4 grid gap-4 md:gap-6">
        <SearchBar
          value={state.q}
          onChange={(q) => setUrlState({ q })}
          onSubmit={() => setUrlState({ q: state.q })}
        />

        <Filters
          values={state}
          onChange={(partial) => setUrlState(partial)}
          onClearAll={() =>
            setUrlState({
              q: "",
              city: "",
              type: "",
              beds: "",
              minPrice: "",
              maxPrice: "",
              sort: "recent",
            })
          }
        />

        <Results items={items} loading={loading} />

        <Pagination
          page={state.page}
          totalPages={totalPages}
          onPageChange={(p) => setUrlState({ page: p })}
        />
      </div>
    </div>
  );
}
