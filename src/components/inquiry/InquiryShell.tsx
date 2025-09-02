"use client";

import { useSearchParams } from "next/navigation";
import InboxList from "./InboxList";
import ThreadView from "./ThreadView";
export default function InquiryShell() {
  const params = useSearchParams();
  const activeId = params.get("id");

  return (
    <div
      role="application"
      aria-label="Buyer Inquiry Management"
      className="
        h-[calc(100vh-120px)] md:h-[calc(100vh-160px)]
        grid grid-cols-1 md:grid-cols-[22rem_minmax(0,1fr)]
        md:p-2
      "
    >
      {/* Outer premium container only on md+ */}
      <div
        className="
          contents
          md:rounded-2xl md:shadow-lg
          md:ring-1 md:ring-zinc-900/5 md:border md:border-zinc-200/70
          md:bg-white/80 md:backdrop-blur supports-[backdrop-filter]:md:bg-white/60
          dark:md:bg-zinc-900/70 dark:md:ring-zinc-800/60 dark:md:border-zinc-800/60
        "
      >
        {/* LEFT (Inbox) — hidden on mobile when a thread is open */}
        <div
          className={[
            /* surface + divider to the right (only md+) */
            "bg-white dark:bg-zinc-900",
            "md:rounded-l-2xl md:border-none",
            "md:sticky md:top-0 md:h-[calc(100vh-160px)] md:overflow-y-auto",
            "md:[--divider:theme(colors.zinc.200)] dark:md:[--divider:theme(colors.zinc.800)]",
            "md:[box-shadow:inset_-1px_0_0_var(--divider)]",
            activeId ? "hidden md:block" : "block",
          ].join(" ")}
        >
          <InboxList />
        </div>

        {/* RIGHT (Thread) — full screen on mobile when a thread is open */}
        <div
          className={[
            "bg-white dark:bg-zinc-900",
            "md:rounded-r-2xl",
            "md:h-[calc(100vh-160px)] md:overflow-y-auto",
            activeId ? "block" : "hidden md:block",
          ].join(" ")}
        >
          <ThreadView />
        </div>
      </div>

      {/* subtle gradient under the container for depth (md+) */}
      <div
        aria-hidden
        className="
          hidden md:block pointer-events-none absolute inset-x-0
          h-24 -bottom-2 
          
        "
      />
    </div>
  );
}
