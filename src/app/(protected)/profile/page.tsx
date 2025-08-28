"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import ProfileShell from "@/components/profile/ProfileShell";

export default function Page() {
  const { user, setUser, loading } = useUnifiedAuth();
  const router = useRouter();

  // (If you already guard in (protected)/layout, this is a fallback)
  useEffect(() => {
    if (!loading && !user) router.replace("/auth/signin?redirect=/profile");
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

  return <ProfileShell user={user} onUserChange={setUser} />;
}
