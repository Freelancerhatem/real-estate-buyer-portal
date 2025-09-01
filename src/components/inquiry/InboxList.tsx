"use client";

/**
 * InboxList
 * - Fetches inquiries from your protected API.
 * - Shows: property thumbnail + title, inquirer name, status chip,
 *   last message (if API provides), and createdAt timestamp.
 * - Clicking a row updates the `?id=` query param and highlights the row.
 *
 * NOTE:
 * - Adjust axios import path if needed.
 * - If your token lives somewhere else (cookies/next-auth), update `getAccessToken()`.
 */

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import type { Inquiry, InquiryStatus } from "./types";
import Image from "next/image";

type ApiInquiry = any; // If you have a DTO, replace `any` with it.

const STATUS_TO_BADGE: Record<InquiryStatus, string> = {
  pending: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  assigned: "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
  resolved: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
};

const FILTERS: Array<{ key: "all" | InquiryStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "assigned", label: "Assigned" },
  { key: "resolved", label: "Resolved" },
];

function getAccessToken() {
  // If you store tokens in cookies or a context, change this function accordingly.
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export default function InboxList() {
  const router = useRouter();
  const params = useSearchParams();
  const activeId = params.get("id") ?? undefined;

  const [statusFilter, setStatusFilter] = useState<"all" | InquiryStatus>(
    "all"
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Inquiry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch inquiries from /inquiries using your controller (supports ?search & ?status)
  useEffect(() => {
    let ignore = false;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getAccessToken();
        const res = await axiosInstance.get("/inquiries", {
          params: {
            search: search || undefined,
            status: statusFilter === "all" ? undefined : statusFilter,
          },
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        // The controller returns data array under data: inquiries
        const raw: ApiInquiry[] = res?.data?.data ?? res?.data ?? [];
        if (ignore) return;

        // Normalize to Inquiry type used by the UI
        const normalized: Inquiry[] = raw.map((x: any) => ({
          id: x._id,
          createdAt: x.createdAt,
          // Your populate('property','title propertyType') returns minimal fields.
          property: {
            id: x.property?._id ?? x.property,
            title: x.property?.title ?? "Untitled Property",
            propertyType: x.property?.propertyType ?? undefined,
            images: x.property?.images ?? [],
            // we don't have price/location in your controller; leave undefined
            thumbnail: x.property?.images?.[0] ?? "/placeholder.svg", // ensure an image exists
            status: x.status as InquiryStatus, // map your status
          },
          inquirerName: x.name,
          inquirerEmail: x.email,
          assignedTo: x.assignedTo
            ? {
                id: x.assignedTo._id,
                firstName: x.assignedTo.firstName,
                lastName: x.assignedTo.lastName,
                email: x.assignedTo.email,
              }
            : undefined,
          lastMessageSnippet: x.lastMessageSnippet, // present only if your API provides it
          lastMessageAt: x.lastMessageAt,
          initialMessage: x.message,
        }));

        setItems(normalized);
      } catch (e: any) {
        setError(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to fetch inquiries"
        );
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, [search, statusFilter]);

  const visible = useMemo(() => items, [items]);

  const onRowClick = (id: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("id", id);
    router.push(`${url.pathname}?${url.searchParams.toString()}`);
  };

  return (
    <aside
      className="
        w-full md:w-[22rem] border-r border-zinc-200
        h-full overflow-y-auto bg-white
      "
      aria-label="Inbox"
    >
      {/* Header / Filters */}
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <h2 className="text-base font-semibold">Inquiries</h2>

        <div className="mt-3 flex gap-2">
          <input
            type="search"
            placeholder="Search name or message…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border px-3 py-1.5 text-sm outline-none focus:ring-2 ring-zinc-300"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {FILTERS.map((f) => {
            const active = f.key === statusFilter;
            return (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={[
                  "px-2.5 py-1 rounded text-xs font-medium transition",
                  active
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                ].join(" ")}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="p-4 text-sm text-zinc-600">Loading inquiries…</div>
      )}
      {error && (
        <div className="p-4 text-sm text-red-600">
          {error} — check your token or API URL.
        </div>
      )}

      {/* List */}
      <ul className="divide-y">
        {visible.map((inq) => {
          const isActive = inq.id === activeId;
          const statusClass = STATUS_TO_BADGE[inq.property.status];
          const timestamp =
            inq.lastMessageAt ?? inq.createdAt ?? new Date().toISOString();
          const snippet = inq.lastMessageSnippet ?? inq.initialMessage ?? "—";

          return (
            <li
              key={inq.id}
              className={[
                "p-4 cursor-pointer transition",
                isActive ? "bg-zinc-50" : "hover:bg-zinc-50",
              ].join(" ")}
              onClick={() => onRowClick(inq.id)}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={inq.property.thumbnail}
                  alt=""
                  width={56}
                  height={56}
                  className="size-14 rounded object-cover bg-zinc-100"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-medium">{inq.property.title}</p>
                    <span
                      className={[
                        "shrink-0 rounded px-2 py-0.5 text-[11px] capitalize",
                        "inline-flex items-center gap-1",
                        statusClass,
                      ].join(" ")}
                    >
                      {inq.property.status}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 truncate">
                    {inq.inquirerName} • {new Date(timestamp).toLocaleString()}
                  </p>

                  <p className="text-sm truncate text-zinc-700">{snippet}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
