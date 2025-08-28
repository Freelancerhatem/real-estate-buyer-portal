"use client";

import { useMemo, useRef, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Avatar from "./Avatar";
import { User } from "@/types/user";

function cn(...xs: (string | false | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

export default function Header({
  user,
  onUserChange,
}: {
  user: User;
  onUserChange: (u: User) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  const avatarSrc = useMemo(
    () => user.image ?? user.profilePicture ?? null,
    [user]
  );
  const displayName = user.firstName || user.username || user.email || "User";

  const onPick = () => fileRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setMsg({ type: "err", text: "Please choose an image file." });
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      setMsg({ type: "err", text: "Max file size is 2MB." });
      return;
    }

    setUploading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("avatar", f);
      const { data } = await axiosInstance.post<{ user: User }>(
        "/auth/me/avatar",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      onUserChange(data.user);
      setMsg({ type: "ok", text: "Profile photo updated." });
    } catch {
      setMsg({ type: "err", text: "Upload failed. Please try again." });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border bg-white/70 backdrop-blur shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />

      <div className="relative p-4 sm:p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 sm:gap-5 md:gap-7">
        <Avatar
          src={avatarSrc}
          alt="Profile picture"
          size={96}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
        />

        {/* Text + chips */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold truncate">
            {displayName}
          </h1>
          <p className="text-sm text-gray-600 truncate">{user.email ?? ""}</p>

          <div className="mt-2 -ml-1 flex gap-2 flex-wrap md:flex-nowrap md:flex-row overflow-x-auto pl-1 pr-1">
            {user.role && (
              <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-1 text-[11px] font-medium whitespace-nowrap">
                {user.role}
              </span>
            )}
            {user.subrole?.map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full md:w-auto md:shrink-0">
          <button
            onClick={onPick}
            disabled={uploading}
            className={cn(
              "w-full md:w-auto px-4 py-2 text-sm rounded-md text-white transition",
              uploading
                ? "bg-gray-400"
                : "bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40"
            )}
            aria-label="Change profile photo"
          >
            {uploading ? "Uploading..." : "Change photo"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFile}
          />
        </div>
      </div>

      {msg && (
        <div
          className={cn(
            "px-4 sm:px-6 pb-4 text-sm",
            msg.type === "ok" ? "text-green-600" : "text-red-600"
          )}
          role="status"
          aria-live="polite"
        >
          {msg.text}
        </div>
      )}
    </section>
  );
}
