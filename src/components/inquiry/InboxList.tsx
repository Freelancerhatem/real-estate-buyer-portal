"use client";

/**
 * InboxList (Classic Premium)
 * - Soft dividers instead of black borders
 * - Smooth hover states, subtle shadows, and elegant focus rings
 * - Active row uses left accent + tinted background
 * - Clean, timeless typography
 */

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { publicApi } from "@/lib/axiosInstance";
import type { Inquiry, InquiryStatus } from "./types";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";

type ApiInquiry = any;

const STATUS_TO_BADGE: Record<InquiryStatus, string> = {
  pending: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  assigned: "bg-blue-50 text-blue-800 ring-1 ring-blue-200",
  resolved: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200",
};

const FILTERS: Array<{ key: "all" | InquiryStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "assigned", label: "Assigned" },
  { key: "resolved", label: "Resolved" },
];

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

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await publicApi.get("/inquiries", {
          params: {
            search: search || undefined,
            status: statusFilter === "all" ? undefined : statusFilter,
          },
        });

        const raw: ApiInquiry[] = res?.data?.data ?? res?.data ?? [];
        if (ignore) return;

        const normalized: Inquiry[] = raw.map((x: any) => ({
          id: x._id,
          createdAt: x.createdAt,
          property: {
            id: x.property?._id ?? x.property,
            title: x.property?.title ?? "Untitled Property",
            propertyType: x.property?.propertyType ?? undefined,
            images: x.property?.images ?? [],
            thumbnail: x.property?.images?.[0] ?? "/placeholder.svg",
            status: x.status as InquiryStatus,
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
          lastMessageSnippet: x.lastMessageSnippet,
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
    <aside className="w-full bg-white" aria-label="Inbox">
      {/* Header / Filters */}
      <div
        className="
          sticky top-0 z-10
          bg-white/95 supports-[backdrop-filter]:backdrop-blur
          border-b border-zinc-200
        "
      >
        <div className="p-4">
          <h2 className="text-base font-semibold">Inquiries</h2>

          {/* Search input with icon & premium focus ring */}
          <div className="mt-3 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <FiSearch />
            </span>
            <input
              type="search"
              placeholder="Search name or message…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full rounded-lg border border-zinc-200 px-9 py-2 text-sm
                outline-none transition
                focus:border-primary focus:ring-2 focus:ring-primary/20
                hover:border-zinc-300
              "
            />
          </div>

          {/* Filter chips */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const active = f.key === statusFilter;
              return (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={[
                    "px-3 py-1 rounded-full text-xs font-medium transition border",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20",
                    active
                      ? "bg-primary text-white border-transparent shadow-sm"
                      : "bg-zinc-50 text-zinc-700 border border-zinc-200 hover:bg-zinc-100",
                  ].join(" ")}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="p-4 space-y-2">
          <div className="h-10 bg-zinc-100 animate-pulse rounded-lg" />
          <div className="h-10 bg-zinc-100 animate-pulse rounded-lg" />
          <div className="h-10 bg-zinc-100 animate-pulse rounded-lg" />
        </div>
      )}
      {error && (
        <div className="p-4 text-sm text-red-600">
          {error} — check your token or API URL.
        </div>
      )}

      {/* Empty */}
      {!loading && !error && visible.length === 0 && (
        <div className="p-6 text-sm text-zinc-600">No inquiries yet.</div>
      )}

      {/* List */}
      <ul className="divide-y divide-zinc-100">
        {visible.map((inq) => {
          const isActive = inq.id === activeId;
          const statusClass = STATUS_TO_BADGE[inq.property.status];
          const timestamp =
            inq.lastMessageAt ?? inq.createdAt ?? new Date().toISOString();
          const snippet = inq.lastMessageSnippet ?? inq.initialMessage ?? "—";

          return (
            <li key={inq.id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => onRowClick(inq.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onRowClick(inq.id);
                  }
                }}
                className={[
                  "group relative p-4 cursor-pointer transition",
                  "hover:bg-zinc-50",
                  isActive ? "bg-primary/5" : "",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-transparent",
                  "rounded-lg",
                ].join(" ")}
              >
                {/* left accent for active row */}
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r"
                  />
                )}

                <div className="flex items-center gap-3">
                  <Image
                    src={inq.property.thumbnail}
                    alt=""
                    width={56}
                    height={56}
                    className="size-14 rounded-lg object-cover bg-zinc-100 shadow-sm"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-medium text-zinc-900">
                        {inq.property.title}
                      </p>
                      <span
                        className={[
                          "shrink-0 rounded-full px-2 py-0.5 text-[11px] capitalize",
                          statusClass,
                        ].join(" ")}
                      >
                        {inq.property.status}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 truncate">
                      {inq.inquirerName} •{" "}
                      {new Date(timestamp).toLocaleString()}
                    </p>

                    <p className="text-sm truncate text-zinc-600 group-hover:text-zinc-900">
                      {snippet}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
