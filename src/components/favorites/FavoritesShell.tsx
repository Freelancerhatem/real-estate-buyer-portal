"use client";

import { useMemo, useState } from "react";
import FavoritesToolbar, { FavoritesFilters } from "./FavoritesToolbar";
import FavoritesGrid from "./FavoritesGrid";

export default function FavoritesShell() {
  const [filters, setFilters] = useState<FavoritesFilters>({
    search: "",
    propertyType: "",
    purpose: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
  });

  const qs = useMemo(() => {
    // build query params for backend
    const entries = Object.entries(filters).filter(
      ([, v]) => v !== "" && v != null
    );
    return Object.fromEntries(entries) as Partial<FavoritesFilters>;
  }, [filters]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-lg font-semibold">Saved Properties</h1>
        </div>
        <FavoritesToolbar value={filters} onChange={setFilters} />
      </div>

      <FavoritesGrid query={qs} />
    </div>
  );
}
