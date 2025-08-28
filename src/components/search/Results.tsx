"use client";

import type { listing } from "@/types/listing";
import ResultCard from "./ResultCard";

export default function Results({
  items,
  loading,
}: {
  items: listing[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-white p-3">
            <div className="h-40 bg-gray-100 rounded animate-pulse" />
            <div className="mt-3 h-4 bg-gray-100 rounded animate-pulse" />
            <div className="mt-2 h-4 bg-gray-100 w-2/3 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center text-gray-600">
        No properties found. Try changing your filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((it) => (
        <ResultCard key={it._id} item={it} />
      ))}
    </div>
  );
}
