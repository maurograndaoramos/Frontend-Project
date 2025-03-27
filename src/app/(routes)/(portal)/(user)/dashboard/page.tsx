"use client";

import { Suspense } from 'react';
import DashboardPage from "@/components/dashboard/DashboardPage";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 px-4 space-y-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    }>
      <DashboardPage />
    </Suspense>
  );
}