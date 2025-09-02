"use client";

import { useState } from "react";
import { protectedApi } from "@/lib/axiosInstance";

function cn(...xs: (string | false | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

export default function SecurityCard() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
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
    if (form.newPassword !== form.confirmNewPassword) {
      setMsg({ type: "err", text: "Passwords do not match." });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      await protectedApi.post("/auth/v2/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setMsg({ type: "ok", text: "Password updated." });
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch {
      setMsg({
        type: "err",
        text: "Password update failed. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border bg-white/70 backdrop-blur p-5 md:p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Security</h2>
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
      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600">
            Current password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={onChange}
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">New password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={onChange}
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-primary focus:border-primary"
            minLength={6}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">
            Confirm new password
          </label>
          <input
            type="password"
            name="confirmNewPassword"
            value={form.confirmNewPassword}
            onChange={onChange}
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-primary focus:border-primary"
            minLength={6}
            required
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
            {saving ? "Updating..." : "Update password"}
          </button>
        </div>
      </form>
    </section>
  );
}
