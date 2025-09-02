"use client";

import { useState } from "react";
import { protectedApi } from "@/lib/axiosInstance";
import { User } from "@/types/user";

function cn(...xs: (string | false | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

export default function AccountForm({
  user,
  onUserChange,
}: {
  user: User;
  onUserChange: (u: User) => void;
}) {
  const [form, setForm] = useState({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    username: user.username ?? "",
    phone: user.phone ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const { data } = await protectedApi.patch<{ user: User }>(
        "/users/me",
        form
      );
      onUserChange(data.user);
      setMsg({ type: "ok", text: "Profile updated." });
    } catch (err: unknown) {
      setMsg({ type: "err", text: "Update failed. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border bg-white/70 backdrop-blur p-5 md:p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Edit account</h2>
      {msg && (
        <p
          className={cn(
            "mb-3 text-sm",
            msg.type === "ok" ? "text-green-600" : "text-red-600"
          )}
        >
          {msg.text}
        </p>
      )}
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm text-gray-600">First name</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Last name</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={onChange}
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={onChange}
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className={cn(
              "px-5 py-2 rounded text-white transition",
              saving
                ? "bg-gray-400"
                : "bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40"
            )}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
