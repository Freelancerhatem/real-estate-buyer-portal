"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import DashboardShell from "@/components/dashboard/DashboardShell";

/**
 * Dashboard layout:
 * - guards auth
 * - renders the chrome (sidebar + top bar)
 * - injects child route content on the right
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUnifiedAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin?redirect=/dashboard");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="h-32 w-full bg-gray-100 rounded animate-pulse mb-6" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 rounded animate-pulse" />
          <div className="h-64 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return <DashboardShell>{children}</DashboardShell>;
}
