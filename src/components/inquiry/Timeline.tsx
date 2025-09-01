"use client";

import { TimelineEvent } from "./types";

/**
 * Timeline
 * - Accessible vertical list with left rule + bullets.
 * - Renders event meta if present (debug-friendly).
 */

export default function Timeline({ items }: { items: TimelineEvent[] }) {
  if (!items?.length) {
    return (
      <div className="rounded border p-4 bg-white">
        <h3 className="font-medium mb-1">Timeline</h3>
        <p className="text-sm text-zinc-600">No events yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded border p-4 bg-white">
      <h3 className="font-medium mb-3">Timeline</h3>
      <ol className="relative border-l pl-4 space-y-4">
        {items.map((ev) => (
          <li key={ev.id} className="ml-2">
            <span className="absolute -left-1.5 mt-1 block size-3 rounded-full bg-zinc-400" />
            <p className="text-sm font-medium">{ev.title}</p>
            <p className="text-xs text-zinc-500">
              {new Date(ev.at).toLocaleString()} • {ev.kind}
            </p>
            {!!ev.meta && (
              <pre className="text-[11px] text-zinc-500 mt-1 overflow-auto">
                {JSON.stringify(ev.meta, null, 2)}
              </pre>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
