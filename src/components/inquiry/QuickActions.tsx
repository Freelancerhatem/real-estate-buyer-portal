"use client";

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
    <div className="rounded-xl border border-zinc-200 p-4 bg-white">
      <h3 className="font-medium mb-4">Quick actions</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-lg px-3 py-1.5 text-sm bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          onClick={onScheduleVisit}
        >
          Schedule visit
        </button>
        <button
          className="rounded-lg px-3 py-1.5 text-sm bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          onClick={onMakeOffer}
        >
          Make offer
        </button>
        <button
          className="rounded-lg px-3 py-1.5 text-sm bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          onClick={onRequestDocs}
        >
          Request docs
        </button>
      </div>

      <p className="text-xs text-zinc-500 mt-2">
        These call your protected API in the parent.
      </p>
    </div>
  );
}
