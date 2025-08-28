"use client";

import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

function useDebounced<T>(value: T, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  const [local, setLocal] = useState(value);
  const debounced = useDebounced(local, 400);

  useEffect(() => {
    if (debounced !== value) onChange(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // sync when url/state changes outside
  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <form
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Search by title, city, features…"
        className="w-full pl-10 pr-3 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
      />
    </form>
  );
}
