// Mark as fully dynamic page to avoid static optimization issues
export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ShopPageContent from "@/components/shop/ShopPageContent";

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    }>
      <div className="container mx-auto px-4 py-8">
        <ShopPageContent />
      </div>
    </Suspense>
  );
} 