"use client";

import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUnifiedAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(
        `/auth/signin?redirect=${encodeURIComponent(pathname || "/profile")}`
      );
    }
  }, [loading, user, router, pathname]);

  if (loading || !user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-primary animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
