/**
 * Route: /inquiries
 *
 * Server component wrapper – renders the interactive shell.
 * Keep this thin so you can later move data fetching to server actions if needed.
 */

import InquiryShell from "@/components/inquiry/InquiryShell";

export default function Page() {
  return <InquiryShell />;
}
