"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { token } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) {
      router.replace("/login");
    }
  }, [mounted, token, router]);

  // While mounting or when no token, show loading to avoid flash of protected content
  if (!mounted || !token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
