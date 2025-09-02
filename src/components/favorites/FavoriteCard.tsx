"use client";

import Image from "next/image";
import { FiHeart, FiMapPin } from "react-icons/fi";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { confirmRemove } from "./helper";

export type FavoriteProperty = {
  id: string;
  title: string;
  // allow either object or string; we'll format safely below
  location?:
    | { country?: string; city?: string; address?: string; postalCode?: string }
    | string;
  price?: number;
  currency?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;
  thumbnail: string;
};

function formatLocation(loc?: FavoriteProperty["location"]) {
  if (!loc) return undefined;
  if (typeof loc === "string") return loc;
  const parts = [loc.address, loc.city, loc.postalCode, loc.country].filter(
    Boolean
  );
  return parts.join(", ");
}

export default function FavoriteCard({
  item,
  userId, // ⟵ provide userId so the card can call the API
  onRemove, // ⟵ optimistic UI callback from parent
  onOpen,
}: {
  item: FavoriteProperty;
  userId: string;
  onRemove?: (id: string) => void;
  onOpen?: (id: string) => void;
}) {
  const locationLabel = formatLocation(item.location);

  const requestRemove = () => {
    confirmRemove(async () => {
      onRemove?.(item.id);
      try {
        await axiosInstance.delete("/v2/favorites", {
          data: { userId, propertyId: item.id },
        });
        toast.success("Removed from favorites");
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ||
            "Failed to remove favorite. Please try again."
        );
      }
    });
  };

  return (
    <div
      className="
        group overflow-hidden rounded-2xl border border-zinc-200 bg-white
        shadow-sm hover:shadow-md transition
        focus-within:ring-2 focus-within:ring-primary/20
      "
    >
      <div className="relative">
        <button
          onClick={() => onOpen?.(item.id)}
          className="block w-full text-left"
          aria-label={`Open ${item.title}`}
        >
          <Image
            src={item.thumbnail}
            alt={item.title}
            width={800}
            height={600}
            className="h-44 w-full object-cover"
          />
        </button>

        {/* remove icon button (top-right) */}
        <button
          onClick={requestRemove}
          className="
            absolute right-3 top-3 inline-flex items-center justify-center
            rounded-full bg-white/90 backdrop-blur p-2 shadow
            text-rose-600 hover:text-white hover:bg-rose-600 transition
            focus:outline-none focus:ring-2 focus:ring-rose-300
          "
          aria-label="Remove from favorites"
          title="Remove favorite"
        >
          <FiHeart className="fill-current" />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium line-clamp-2">{item.title}</h3>
          {item.price != null && (
            <div className="shrink-0 rounded-lg bg-primary/10 px-2 py-1 text-xs text-primary font-medium">
              {item.currency ?? "$"}
              {Intl.NumberFormat().format(item.price)}
            </div>
          )}
        </div>

        {locationLabel && (
          <p className="text-xs text-zinc-600 flex items-center gap-1">
            <FiMapPin /> {locationLabel}
          </p>
        )}

        <div className="flex flex-wrap gap-2 text-[12px] text-zinc-600">
          {item.propertyType && (
            <span className="rounded-full bg-zinc-50 border border-zinc-200 px-2 py-0.5">
              {item.propertyType}
            </span>
          )}
          {item.bedrooms != null && (
            <span className="rounded-full bg-zinc-50 border border-zinc-200 px-2 py-0.5">
              {item.bedrooms} bd
            </span>
          )}
          {item.bathrooms != null && (
            <span className="rounded-full bg-zinc-50 border border-zinc-200 px-2 py-0.5">
              {item.bathrooms} ba
            </span>
          )}
          {item.areaSqft != null && (
            <span className="rounded-full bg-zinc-50 border border-zinc-200 px-2 py-0.5">
              {item.areaSqft} sqft
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
