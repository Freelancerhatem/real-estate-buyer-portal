"use client";

import Link from "next/link";
import Image from "next/image";
import type { listing } from "@/types/listing";

function currency(n?: number | string) {
  const num = typeof n === "string" ? Number(n) : n;
  if (!Number.isFinite(num)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num as number);
}

export default function ResultCard({ item }: { item: listing }) {
  const id = item._id;
  const href = `/listings/${id}`;

  const cover = item.thumbnail || "/placeholder-property.jpg";

  const title = item.title ?? "Property";
  const city = item.location.city ?? "";
  const price = item.price;
  const beds = item.totalBedrooms;
  const baths = item.totalBathrooms;
  const area = item.totalArea;

  return (
    <Link
      href={href}
      className="group rounded-lg border bg-white overflow-hidden hover:shadow-md transition"
    >
      <div className="relative h-44 w-full">
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium truncate">{title}</h3>
        <p className="text-sm text-gray-600 truncate">{city}</p>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="font-semibold">{currency(price)}</span>
          <span className="text-gray-600">
            {beds ? `${beds} bd` : ""} {baths ? `• ${baths} ba` : ""}{" "}
            {area ? `• ${area} sqft` : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
