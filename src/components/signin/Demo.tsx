"use client";

import { useState } from "react";
import { FiCopy, FiCheck, FiLogIn } from "react-icons/fi";

type Props = {
  onFill: (email: string, password: string, autoSubmit?: boolean) => void;
};

export default function DemoCredentials({ onFill }: Props) {
  const show =
    process.env.NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS === "true" &&
    process.env.NODE_ENV !== "production";

  const email = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "";
  const password = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "";

  const [copied, setCopied] = useState<"email" | "password" | null>(null);

  if (!show || !email || !password) return null;

  const copy = async (text: string, which: "email" | "password") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      // noop
    }
  };

  return (
    <div className="mt-6 rounded-lg border bg-white/80 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Demo account</h3>
        <button
          type="button"
          onClick={() => onFill(email, password, true)}
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md bg-primary text-white hover:bg-primary-dark"
          title="Fill and sign in"
        >
          <FiLogIn className="h-4 w-4" />
          Use demo
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2">
        <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-medium">{email}</p>
          </div>
          <button
            type="button"
            onClick={() => copy(email, "email")}
            className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
          >
            {copied === "email" ? <FiCheck /> : <FiCopy />}
            {copied === "email" ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
          <div>
            <p className="text-xs text-gray-500">Password</p>
            <p className="text-sm font-medium">{password}</p>
          </div>
          <button
            type="button"
            onClick={() => copy(password, "password")}
            className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
          >
            {copied === "password" ? <FiCheck /> : <FiCopy />}
            {copied === "password" ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <p className="mt-2 text-[11px] text-gray-500">
        Only visible in development or when{" "}
        <code>NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS</code> is set.
      </p>
    </div>
  );
}
