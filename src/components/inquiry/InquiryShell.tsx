"use client";

/**
 * InquiryShell
 * - Composes the two-panels layout: Inbox (left) + Thread (right).
 * - Responsive: stacks on small screens, splits on md+.
 */

import InboxList from "./InboxList";
import ThreadView from "./ThreadView";

export default function InquiryShell() {
  return (
    <div
      className="
        h-[calc(100vh-120px)] md:h-[calc(100vh-160px)]
        grid grid-cols-1 md:grid-cols-[22rem_minmax(0,1fr)]
        bg-white
      "
      role="application"
      aria-label="Buyer Inquiry Management"
    >
      <InboxList />
      <ThreadView />
    </div>
  );
}
