// Mark as fully dynamic page to avoid static optimization issues
export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { lazy } from "react";

// Lazily import the client component
const SearchClient = lazy(() => import('./SearchClient'));

export default function SearchPage() {
  // In development, use the dynamic client component
  // In production, this content should have already been replaced with a static version
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
      {process.env.NODE_ENV === 'development' ? (
        <SearchClient />
      ) : (
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-muted-foreground mb-6">Showing results for your search</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder cards for production build */}
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <div className="aspect-square bg-muted"></div>
                <div className="p-4">
                  <div className="h-5 bg-muted rounded-md w-2/3 mb-2"></div>
                  <div className="h-4 bg-muted rounded-md w-1/3 mb-4"></div>
                  <div className="h-8 bg-muted rounded-md w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Suspense>
  );
} 