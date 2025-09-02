"use client";

import { FiSearch } from "react-icons/fi";

export type FavoritesFilters = {
  search: string;
  propertyType: string;
  purpose: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
};

const PROPERTY_TYPES = ["Apartment", "House", "Condo", "Townhouse", "Land"];
const PURPOSE = ["Buy", "Rent"];

export default function FavoritesToolbar({
  value,
  onChange,
}: {
  value: FavoritesFilters;
  onChange: (v: FavoritesFilters) => void;
}) {
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-4 lg:grid-cols-6">
      {/* Search */}
      <div className="md:col-span-2 lg:col-span-2 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
          <FiSearch />
        </span>
        <input
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          placeholder="Search title, location, description…"
          className="
            w-full rounded-lg border border-zinc-200 pl-9 pr-3 py-2 text-sm
            outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
            hover:border-zinc-300
          "
        />
      </div>

      {/* Type */}
      <select
        value={value.propertyType}
        onChange={(e) => onChange({ ...value, propertyType: e.target.value })}
        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-zinc-300 bg-white"
      >
        <option value="">All types</option>
        {PROPERTY_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* Purpose */}
      <select
        value={value.purpose}
        onChange={(e) => onChange({ ...value, purpose: e.target.value })}
        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-zinc-300 bg-white"
      >
        <option value="">Any purpose</option>
        {PURPOSE.map((p) => (
          <option key={p} value={p.toLowerCase()}>
            {p}
          </option>
        ))}
      </select>

      {/* Beds */}
      <input
        type="number"
        min={0}
        value={value.bedrooms}
        onChange={(e) => onChange({ ...value, bedrooms: e.target.value })}
        placeholder="Beds"
        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-zinc-300"
      />

      {/* Baths */}
      <input
        type="number"
        min={0}
        value={value.bathrooms}
        onChange={(e) => onChange({ ...value, bathrooms: e.target.value })}
        placeholder="Baths"
        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-zinc-300"
      />

      {/* Price range (inline on large) */}
      <div className="flex gap-2">
        <input
          type="number"
          min={0}
          placeholder="Min"
          value={value.minPrice}
          onChange={(e) => onChange({ ...value, minPrice: e.target.value })}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-zinc-300"
        />
        <input
          type="number"
          min={0}
          placeholder="Max"
          value={value.maxPrice}
          onChange={(e) => onChange({ ...value, maxPrice: e.target.value })}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-zinc-300"
        />
      </div>
    </div>
  );
}
