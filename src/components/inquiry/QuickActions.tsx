"use client";

/**
 * QuickActions
 * - Single-responsibility: emit events; parent decides how to handle.
 * - Hooks are optional; UI still renders if none are provided.
 */

type Props = {
  onScheduleVisit?: () => void;
  onMakeOffer?: () => void;
  onRequestDocs?: () => void;
};

export default function QuickActions({
  onScheduleVisit,
  onMakeOffer,
  onRequestDocs,
}: Props) {
  return (
    <div className="rounded border p-4 bg-white">
      <h3 className="font-medium mb-4">Quick actions</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded border px-3 py-1.5 text-sm hover:bg-zinc-50"
          onClick={onScheduleVisit}
        >
          Schedule visit
        </button>
        <button
          className="rounded border px-3 py-1.5 text-sm hover:bg-zinc-50"
          onClick={onMakeOffer}
        >
          Make offer
        </button>
        <button
          className="rounded border px-3 py-1.5 text-sm hover:bg-zinc-50"
          onClick={onRequestDocs}
        >
          Request docs
        </button>
      </div>

      <p className="text-xs text-zinc-500 mt-2">
        These call your protected API in the parent component.
      </p>
    </div>
  );
}
