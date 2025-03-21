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
      <div className="mb-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <h2 className="font-medium text-primary">Valentine's Day Promotion</h2>
        <p className="text-sm text-muted-foreground">Order by February 7th for guaranteed delivery before Valentine's Day!</p>
      </div>
      
      {/* Dashboard content */}
      {children}
    </div>
  );
}