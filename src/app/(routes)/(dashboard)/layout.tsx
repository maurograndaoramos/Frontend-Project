"use client";

import { UserCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Dashboard header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Jane Doe</p>
      </div>
      
      {/* Dashboard content */}
      {children}
    </div>
  );
}