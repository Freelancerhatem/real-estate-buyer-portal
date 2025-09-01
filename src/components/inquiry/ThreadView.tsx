"use client";

/**
 * ThreadView
 * - Fetches a specific inquiry (header).
 * - Fetches messages + timeline (if endpoints exist).
 * - Provides a simple message composer that POSTs to /:id/messages.
 * - QuickActions can post timeline events to /:id/timeline.
 *
 * If your API doesn’t have messages/timeline yet, the UI will display the
 * initial inquiry message and a basic 2-line timeline.
 */

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import Timeline from "./Timeline";
import QuickActions from "./QuickActions";
import AutoTemplates from "./AutoTemplates";
import type { Inquiry, Message, TimelineEvent, TimelineKind } from "./types";
import Image from "next/image";

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export default function ThreadView() {
  const params = useSearchParams();
  const activeId = params.get("id") || "";

  const [header, setHeader] = useState<Inquiry | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [composer, setComposer] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fetch inquiry header
  useEffect(() => {
    if (!activeId) {
      setHeader(null);
      setMessages([]);
      setTimeline([]);
      return;
    }

    let ignore = false;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = getAccessToken();

        // 1) Header
        const hdrRes = await axiosInstance.get(`/inquiries/${activeId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
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

        // 2) Messages (optional endpoint)
        try {
          const msgRes = await axiosInstance.get(
            `/inquiries/${activeId}/messages`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            }
          );
          const ms = (msgRes?.data?.data ?? msgRes?.data ?? []) as any[];
          if (!ignore) {
            const normalized: Message[] = ms.map((m) => ({
              id: m._id,
              from: m.from,
              text: m.text,
              at: m.createdAt ?? m.at,
            }));
            setMessages(normalized);
          }
        } catch {
          // fallback: show initial message as a first bubble
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

        // 3) Timeline (optional endpoint)
        try {
          const tlRes = await axiosInstance.get(
            `/inquiries/${activeId}/timeline`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            }
          );
          const ts = (tlRes?.data?.data ?? tlRes?.data ?? []) as any[];
          if (!ignore) {
            const normalized: TimelineEvent[] = ts.map((t) => ({
              id: t._id,
              kind: t.kind,
              title: t.title,
              at: t.createdAt ?? t.at,
              meta: t.meta,
            }));
            setTimeline(normalized);
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
    };

    run();
    return () => {
      ignore = true;
    };
  }, [activeId]);

  const sendMessage = useCallback(async () => {
    if (!composer.trim() || !activeId) return;
    const token = getAccessToken();
    try {
      const res = await axiosInstance.post(
        `/inquiries/${activeId}/messages`,
        { from: "buyer", text: composer.trim() },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
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
      const token = getAccessToken();
      try {
        const res = await axiosInstance.post(
          `/inquiries/${activeId}/timeline`,
          { kind, title, meta },
          { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
        );
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
        // Fail silently (UI-only convenience)
      }
    },
    [activeId]
  );

  const onInsertTemplate = (text: string) => {
    setComposer((v) => (v ? `${v} ${text}` : text));
  };

  if (!activeId) {
    return (
      <section className="flex-1 h-full overflow-y-auto p-6">
        <p className="text-sm text-zinc-600">
          Select an inquiry from the left.
        </p>
      </section>
    );
  }

  if (loading && !header) {
    return (
      <section className="flex-1 h-full overflow-y-auto p-6">
        <p className="text-sm text-zinc-600">Loading inquiry…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex-1 h-full overflow-y-auto p-6">
        <p className="text-sm text-red-600">{error}</p>
      </section>
    );
  }

  if (!header) return null;

  return (
    <section className="flex-1 h-full overflow-y-auto">
      {/* Header */}
      <header className="border-b p-4 bg-white sticky top-0 z-10">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <Image
            src={header.property.thumbnail}
            alt=""
            width={64}
            height={64}
            className="size-16 rounded object-cover bg-zinc-100"
          />
          <div className="min-w-0">
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
        </div>
      </header>

      {/* Body */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Chat */}
        <div className="rounded border p-4 bg-white">
          <h3 className="font-medium mb-3">Chat</h3>

          <div className="space-y-2">
            {messages.map((m) => {
              const mine = m.from === "buyer"; // style my messages on left for now
              return (
                <div
                  key={m.id}
                  className={`max-w-[80%] ${mine ? "" : "ml-auto"}`}
                >
                  <div
                    className={[
                      "rounded px-3 py-2 text-sm border",
                      mine ? "bg-white" : "bg-zinc-50",
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
              className="flex-1 rounded border px-3 py-2 text-sm outline-none focus:ring-2 ring-zinc-300"
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
              className="rounded border px-3 py-2 text-sm hover:bg-zinc-50"
              onClick={sendMessage}
              disabled={!composer.trim()}
            >
              Send
            </button>
          </div>
        </div>

        {/* Timeline */}
        <Timeline items={timeline} />

        {/* Quick actions */}
        <QuickActions
          onScheduleVisit={() =>
            addTimeline("visit", "Visit scheduled", {
              when: new Date().toISOString(),
            })
          }
          onMakeOffer={() =>
            addTimeline("offer", "Offer sent", {
              amount: "TBD",
            })
          }
          onRequestDocs={() => addTimeline("doc", "Requested disclosures")}
        />

        {/* Auto templates */}
        <AutoTemplates onInsertTemplate={onInsertTemplate} />
      </div>
    </section>
  );
}
