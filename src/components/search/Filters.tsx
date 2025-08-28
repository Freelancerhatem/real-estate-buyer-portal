"use client";

import type { FiltersState, SortKey } from "./types";

const sorts: { value: SortKey; label: string }[] = [
  { value: "recent", label: "Most recent" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

const types = ["", "apartment", "house", "land", "villa", "studio"];
const bedsOptions = ["", "1", "2", "3", "4", "5+"];

export default function Filters({
  values,
  onChange,
  onClearAll,
}: {
  values: FiltersState;
  onChange: (partial: Partial<FiltersState>) => void;
  onClearAll: () => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-12">
      <input
        value={values.city}
        onChange={(e) => onChange({ city: e.target.value })}
        placeholder="City"
        className="md:col-span-3 px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
      />

      <select
        value={values.type}
        onChange={(e) => onChange({ type: e.target.value })}
        className="md:col-span-2 px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
      >
        {types.map((t) => (
          <option key={t || "any"} value={t}>
            {t ? t[0].toUpperCase() + t.slice(1) : "Any type"}
          </option>
        ))}
      </select>

      <select
        value={values.beds}
        onChange={(e) => onChange({ beds: e.target.value })}
        className="md:col-span-2 px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
      >
        {bedsOptions.map((b) => (
          <option key={b || "any"} value={b}>
            {b ? `${b} beds` : "Any beds"}
          </option>
        ))}
      </select>

      <input
        inputMode="numeric"
        pattern="[0-9]*"
        value={values.minPrice}
        onChange={(e) => onChange({ minPrice: e.target.value })}
        placeholder="Min price"
        className="md:col-span-2 px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
      />
      <input
        inputMode="numeric"
        pattern="[0-9]*"
        value={values.maxPrice}
        onChange={(e) => onChange({ maxPrice: e.target.value })}
        placeholder="Max price"
        className="md:col-span-2 px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
      />

      <select
        value={values.sort}
        onChange={(e) => onChange({ sort: e.target.value as SortKey })}
        className="md:col-span-3 px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
      >
        {sorts.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <div className="md:col-span-12">
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm text-gray-600 hover:text-primary underline"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
