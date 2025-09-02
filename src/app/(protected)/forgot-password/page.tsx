"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import bg from "@/assets/images/auth-bg.png";
import axiosInstance from "@/lib/axiosInstance";
import type { AxiosError } from "axios";

type ApiSuccess = { message: string };
type ApiError = { message?: string };

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const redirect = decodeURIComponent(searchParams.get("redirect") || "/");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const router = useRouter();

  const mismatch = useMemo(
    () => confirm.length > 0 && confirm !== password,
    [password, confirm]
  );

  const passwordStrongEnough = useMemo(() => {
    // Simple baseline: >= 8 chars; add your own rules as needed
    return password.length >= 8;
  }, [password]);

  const canSubmit = token && passwordStrongEnough && !mismatch;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || !canSubmit) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await axiosInstance.post<ApiSuccess>("/auth/reset-password", {
        token,
        password,
      });

      setSuccessMsg(res.data?.message ?? "Your password has been reset.");

      setTimeout(() => {
        router.push(`/auth/signin?redirect=${encodeURIComponent(redirect)}`);
      }, 900);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<ApiError>;
      const msg =
        axiosErr.response?.data?.message ??
        "Could not reset password. Please try again.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={bg}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Reset Password
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose a strong new password to secure your account.
        </p>

        {successMsg && (
          <p className="mt-4 text-green-600 text-sm text-center">
            {successMsg}
          </p>
        )}
        {errorMsg && (
          <p className="mt-4 text-red-600 text-sm text-center">{errorMsg}</p>
        )}

        {!token && (
          <p className="mt-4 text-red-600 text-sm text-center">
            Missing or invalid token. Please use the link from your email.
          </p>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              New password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-4 flex items-center text-sm text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">Minimum 8 characters.</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm"
              className="block text-sm font-medium text-gray-600"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
                className={`mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                  mismatch ? "border-red-400" : ""
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute inset-y-0 right-4 flex items-center text-sm text-gray-500"
                aria-label={
                  showConfirm
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {mismatch && (
              <p className="mt-1 text-xs text-red-600">
                Passwords do not match.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !canSubmit}
            className={`w-full py-2 text-white rounded-lg shadow-md focus:outline-none ${
              isLoading || !canSubmit
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {isLoading ? "Updating..." : "Reset password"}
          </button>

          <div className="flex items-center justify-between text-sm">
            <Link href="/auth/signin" className="text-primary hover:underline">
              Back to login
            </Link>
            <Link href="/registration" className="text-primary hover:underline">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
