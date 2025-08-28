"use client";

import { useState } from "react";
import Header from "./Header";
import OverviewCard from "./OverviewCard";
import AccountForm from "./AccountForm";
import SecurityCard from "./SecurityCard";
import { User } from "@/types/user";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

function cn(...xs: (string | false | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

export default function ProfileShell({
  user,
  onUserChange,
}: {
  user: User;
  onUserChange: (u: User) => void;
}) {
  const [tab, setTab] = useState<"overview" | "account" | "security">(
    "overview"
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-primary"
        >
          {/* Rect icon */}
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white/70 shadow-sm">
            <FiArrowLeft className="h-4 w-4" aria-hidden />
          </span>
          <span>Home</span>
        </Link>
      </div>
      <Header user={user} onUserChange={onUserChange} />

      <div className="mt-6 border-b">
        <nav className="-mb-px flex gap-6">
          {(["overview", "account", "security"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "pb-3 text-sm font-medium transition-colors",
                tab === key
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              {key[0].toUpperCase() + key.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6 grid gap-6">
        {tab === "overview" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <OverviewCard user={user} />
          </div>
        )}
        {tab === "account" && (
          <AccountForm user={user} onUserChange={onUserChange} />
        )}
        {tab === "security" && <SecurityCard />}
      </div>
    </div>
  );
}
