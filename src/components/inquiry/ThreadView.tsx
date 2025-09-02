"use client";

/**
 * ThreadView (Classic + Premium)
 * - Header: thumbnail, title, mobile back, and a 3-dot action menu
 * - Chat: soft cards, gentle borders, primary accents for mine bubbles
 * - Composer: premium focus ring + primary button
 * - Timeline & Quick actions: hidden by default; revealed from menu
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { protectedApi } from "@/lib/axiosInstance";
import Timeline from "./Timeline";
import QuickActions from "./QuickActions";
import AutoTemplates from "./AutoTemplates";
import type { Inquiry, Message, TimelineEvent, TimelineKind } from "./types";
import Image from "next/image";
import { FiArrowLeft, FiMoreVertical } from "react-icons/fi";

export default function ThreadView() {
  const router = useRouter();
  const params = useSearchParams();
  const activeId = params.get("id") || "";

  const [header, setHeader] = useState<Inquiry | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [composer, setComposer] = useState("");
  const [error, setError] = useState<string | null>(null);

  // UI: action menu + on-demand panels
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const goBackToInbox = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("id");
    router.push(`${url.pathname}?${url.searchParams.toString()}`);
  };

  // close menu on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  // --- data bootstrap ---
  useEffect(() => {
    if (!activeId) {
      setHeader(null);
      setMessages([]);
      setTimeline([]);
      setShowTimeline(false);
      setShowActions(false);
      return;
    }
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const hdrRes = await protectedApi.get(`/inquiries/${activeId}`);
        const x = hdrRes?.data?.data ?? hdrRes?.data;

        const hdr: Inquiry = {
          id: x._id,
          createdAt: x.createdAt,
          property: {
            id: x.property?._id ?? x.property,
            title: x.property?.title ?? "Untitled Property",
            propertyType: x.property?.propertyType,
            images: x.property?.images ?? [],
            thumbnail: x.property?.images?.[0] ?? "/placeholder.svg",
            status: x.status,
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
          initialMessage: x.message,
        };
        if (!ignore) setHeader(hdr);

        // messages (optional endpoint)
        try {
          const msgRes = await protectedApi.get(
            `/inquiries/${activeId}/messages`
          );
          const ms = (msgRes?.data?.data ?? msgRes?.data ?? []) as any[];
          if (!ignore) {
            setMessages(
              ms.map((m) => ({
                id: m._id,
                from: m.from,
                text: m.text,
                at: m.createdAt ?? m.at,
              }))
            );
          }
        } catch {
          if (!ignore && x?.message) {
            setMessages([
              {
                id: "initial",
                from: "buyer",
                text: x.message,
                at: x.createdAt,
              },
            ]);
          }
        }

        // timeline (optional endpoint — preload silently for instant open)
        try {
          const tlRes = await protectedApi.get(
            `/inquiries/${activeId}/timeline`
          );
          const ts = (tlRes?.data?.data ?? tlRes?.data ?? []) as any[];
          if (!ignore) {
            setTimeline(
              ts.map((t) => ({
                id: t._id,
                kind: t.kind,
                title: t.title,
                at: t.createdAt ?? t.at,
                meta: t.meta,
              }))
            );
          }
        } catch {
          if (!ignore) {
            setTimeline([
              {
                id: "t-open",
                kind: "status",
                title: "Inquiry opened",
                at: x.createdAt,
              },
              {
                id: "t-status",
                kind: "status",
                title: `Status: ${x.status}`,
                at: x.updatedAt ?? x.createdAt,
              },
            ]);
          }
        }
      } catch (e: any) {
        setError(
          e?.response?.data?.message || e?.message || "Failed to load inquiry"
        );
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [activeId]);

  const sendMessage = useCallback(async () => {
    if (!composer.trim() || !activeId) return;
    try {
      const res = await protectedApi.post(`/inquiries/${activeId}/messages`, {
        from: "buyer",
        text: composer.trim(),
      });
      const saved = res?.data?.data ?? res?.data;
      const newMsg: Message = {
        id: saved?._id ?? String(Date.now()),
        from: saved?.from ?? "buyer",
        text: saved?.text ?? composer.trim(),
        at: saved?.createdAt ?? new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);
      setComposer("");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `tmp-${Date.now()}`,
          from: "buyer",
          text: composer.trim(),
          at: new Date().toISOString(),
        },
      ]);
      setComposer("");
    }
  }, [composer, activeId]);

  const addTimeline = useCallback(
    async (kind: TimelineKind, title: string, meta?: Record<string, any>) => {
      if (!activeId) return;
      try {
        const res = await protectedApi.post(`/inquiries/${activeId}/timeline`, {
          kind,
          title,
          meta,
        });
        const saved = res?.data?.data ?? res?.data;
        const item: TimelineEvent = {
          id: saved?._id ?? `tl-${Date.now()}`,
          kind,
          title,
          at: saved?.createdAt ?? new Date().toISOString(),
          meta,
        };
        setTimeline((prev) => [...prev, item]);
      } catch {
        /* no-op */
      }
    },
    [activeId]
  );

  if (!activeId) {
    return (
      <section className="p-6">
        <p className="text-sm text-zinc-600">
          Select an inquiry from the left.
        </p>
      </section>
    );
  }

  if (loading && !header) {
    return (
      <section className="p-6">
        <div className="h-6 w-48 bg-zinc-100 animate-pulse rounded" />
        <div className="mt-4 h-24 bg-zinc-100 animate-pulse rounded" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-6">
        <p className="text-sm text-red-600">{error}</p>
      </section>
    );
  }

  if (!header) return null;

  return (
    <section className="min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 supports-[backdrop-filter]:backdrop-blur border-b border-zinc-200">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-4">
          {/* Mobile back */}
          <button
            className="md:hidden inline-flex items-center justify-center size-9 rounded-md border border-zinc-200 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            onClick={goBackToInbox}
            aria-label="Back to inbox"
          >
            <FiArrowLeft />
          </button>

          {/* Thumbnail + title */}
          <Image
            src={header.property.thumbnail}
            alt=""
            width={64}
            height={64}
            className="size-16 rounded-lg object-cover bg-zinc-100 shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-semibold truncate">
              {header.property.title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600">
              {header.property.propertyType
                ? `${header.property.propertyType} • `
                : ""}
              with{" "}
              {header.assignedTo
                ? `${header.assignedTo.firstName} ${header.assignedTo.lastName}`
                : "Unassigned"}
            </p>
          </div>

          {/* 3-dot action menu */}
          <div className="relative" ref={menuRef}>
            <button
              className="inline-flex items-center justify-center size-9 rounded-md border border-zinc-200 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Thread actions"
            >
              <FiMoreVertical />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="
                  absolute right-0 mt-2 w-44 rounded-lg border border-zinc-200 bg-white shadow-lg
                  p-1 z-20
                "
              >
                <button
                  role="menuitem"
                  className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  onClick={() => {
                    setShowTimeline((s) => !s);
                    setMenuOpen(false);
                  }}
                >
                  {showTimeline ? "Hide timeline" : "Show timeline"}
                </button>
                <button
                  role="menuitem"
                  className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  onClick={() => {
                    setShowActions((s) => !s);
                    setMenuOpen(false);
                  }}
                >
                  {showActions ? "Hide quick actions" : "Show quick actions"}
                </button>
                <button
                  role="menuitem"
                  className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  onClick={() => {
                    setShowTemplates((s) => !s);
                    setMenuOpen(false);
                  }}
                >
                  {showTemplates
                    ? "Hide auto templates"
                    : "Show auto templates"}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Chat */}
        <div className="rounded-xl border border-zinc-200 p-4 bg-white">
          <h3 className="font-medium mb-3">Chat</h3>

          <div className="space-y-2">
            {messages.map((m) => {
              const mine = m.from === "buyer";
              return (
                <div
                  key={m.id}
                  className={`max-w-[80%] ${mine ? "" : "ml-auto"}`}
                >
                  <div
                    className={[
                      "rounded-lg px-3 py-2 text-sm border",
                      mine
                        ? "bg-primary/5 border-primary/20"
                        : "bg-zinc-50 border-zinc-200",
                    ].join(" ")}
                  >
                    <p className="mb-1">{m.text}</p>
                    <p className="text-[11px] text-zinc-500">
                      {m.from} • {new Date(m.at).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Composer */}
          <div className="mt-3 flex gap-2">
            <input
              className="
                flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm
                outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
              "
              placeholder="Type a message…"
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              className="
                rounded-lg px-3 py-2 text-sm
                bg-primary text-white hover:opacity-90
                disabled:opacity-50
                focus:outline-none focus:ring-2 focus:ring-primary/20
              "
              onClick={sendMessage}
              disabled={!composer.trim()}
            >
              Send
            </button>
          </div>
        </div>

        {/* Conditionally rendered panels */}
        {showActions && (
          <QuickActions
            onScheduleVisit={() =>
              addTimeline("visit", "Visit scheduled", {
                when: new Date().toISOString(),
              })
            }
            onMakeOffer={() =>
              addTimeline("offer", "Offer sent", { amount: "TBD" })
            }
            onRequestDocs={() => addTimeline("doc", "Requested disclosures")}
          />
        )}

        {showTimeline && <Timeline items={timeline} />}

        {showTemplates && (
          <AutoTemplates
            onInsertTemplate={(t) => setComposer((v) => (v ? `${v} ${t}` : t))}
          />
        )}
      </div>
    </section>
  );
}
