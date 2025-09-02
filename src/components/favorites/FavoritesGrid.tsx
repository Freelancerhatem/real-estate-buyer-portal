"use client";

import { useEffect, useMemo, useState } from "react";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useRouter } from "next/navigation";
import FavoriteCard, { FavoriteProperty } from "./FavoriteCard";
import { protectedApi } from "@/lib/axiosInstance";

type Query = Partial<{
  search: string;
  propertyType: string;
  purpose: string;
  minPrice: string | number;
  maxPrice: string | number;
  bedrooms: string | number;
  bathrooms: string | number;
}>;

type ApiFavorite = {
  _id: string;
  propertyId: any; // populated property document
  createdAt: string;
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-3">
      <div className="h-44 rounded-lg bg-zinc-100 animate-pulse" />
      <div className="mt-3 h-4 w-3/4 bg-zinc-100 rounded animate-pulse" />
      <div className="mt-2 h-4 w-1/2 bg-zinc-100 rounded animate-pulse" />
      <div className="mt-3 flex gap-2">
        <div className="h-6 w-16 bg-zinc-100 rounded-full animate-pulse" />
        <div className="h-6 w-14 bg-zinc-100 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
      <p className="text-zinc-600">No favorites match your filters.</p>
      <p className="text-zinc-500 text-sm mt-1">
        Try clearing filters or{" "}
        <a href="/listings" className="text-primary underline">
          browse listings
        </a>
        .
      </p>
    </div>
  );
}

export default function FavoritesGrid({ query }: { query: Query }) {
  const { user } = useUnifiedAuth();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FavoriteProperty[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // fetch favorites
  useEffect(() => {
    if (!user?._id && !user?.id) return;
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = (user?._id || user?.id) as string;
        const res = await protectedApi.get(`/favorites/${userId}`, {
          params: query,
        });
        const raw = (res?.data?.data ?? res?.data ?? []) as ApiFavorite[];

        const normalized: FavoriteProperty[] = raw
          .map((f) => {
            const p = f.propertyId;
            if (!p) return null;
            return {
              id: p._id,
              title: p.title ?? "Untitled Property",
              location: p.location,
              price: p.price,
              currency: p.currency ?? "$",
              propertyType: p.propertyType,
              bedrooms: p.totalBedrooms,
              bathrooms: p.totalBathrooms,
              areaSqft: p.areaSqft ?? p.area ?? undefined,
              thumbnail: p.images?.[0] ?? "/placeholder.svg",
            } as FavoriteProperty;
          })
          .filter(Boolean) as FavoriteProperty[];

        if (!ignore) setItems(normalized);
      } catch (e: any) {
        if (!ignore)
          setError(
            e?.response?.data?.message ||
              e?.message ||
              "Failed to load favorites"
          );
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [JSON.stringify(query), user?._id, user?.id]);

  // optimistic remove
  const removeFavorite = async (propertyId: string) => {
    if (!user?._id && !user?.id) return;
    const prev = items;
    setItems((s) => s.filter((x) => x.id !== propertyId));

    try {
      await protectedApi.delete("/favorites", {
        data: { userId: user?._id || user?.id, propertyId },
      });
    } catch {
      // revert on fail
      setItems(prev);
    }
  };

  const openProperty = (id: string) => {
    router.push(`/listings/${id}`);
  };

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-red-600">
          {error}
        </div>
      );
    }
    if (!items.length) {
      return <EmptyState />;
    }
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((it) => (
          <FavoriteCard
            key={it.id}
            item={it}
            onRemove={removeFavorite}
            onOpen={openProperty}
          />
        ))}
      </div>
    );
  }, [loading, error, items]);

  return <>{content}</>;
}
