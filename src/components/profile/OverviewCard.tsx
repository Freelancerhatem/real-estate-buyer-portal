"use client";

import { User } from "@/types/user";

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium break-words">{value || "—"}</p>
    </div>
  );
}

export default function OverviewCard({ user }: { user: User }) {
  return (
    <section className="rounded-2xl border bg-white/70 backdrop-blur p-5 md:p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        <Row label="First name" value={user.firstName} />
        <Row label="Last name" value={user.lastName} />
        <Row label="Username" value={user.username} />
        <Row label="Email" value={user.email} />
        <Row label="Status" value={user.status} />
        <Row label="Role" value={user.role} />
        <Row label="Created" value={user.createdAt} />
        <Row label="Updated" value={user.updatedAt} />
        <Row label="Last login" value={user.lastLogin} />
      </div>
    </section>
  );
}
