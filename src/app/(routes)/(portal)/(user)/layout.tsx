"use client";
import DashboardLayout from "@/components/layout/UserDashboardLayout";

export default function DashboardLayouts({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}