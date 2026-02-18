import type { Metadata } from "next";
import DashboardGuard from "@/components/DashboardGuard";
import { DashboardProvider } from "@/context/DashboardContext";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardGuard>
      <DashboardProvider>{children}</DashboardProvider>
    </DashboardGuard>
  );
}
