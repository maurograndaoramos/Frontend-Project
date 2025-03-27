"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductGrid from "@/components/shop/shop-components/ProductGrid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/product";
import { useToast } from "@/lib/hooks/useToast";
import RecentlyViewedProducts from "@/components/shop/shop-components/RecentlyViewedProducts";
import { motion, AnimatePresence } from "framer-motion";
import { getViewingHistory } from "@/lib/services/recommendationService";
import { useProducts } from "@/lib/api/productApi";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ShopClientPageProps {
  category?: string;
  search?: string;
  sort: string;
  page: number;
  minPrice?: number;
  maxPrice?: number;
  inStock: boolean;
  isRecentlyViewed: boolean;
  isRecommended: boolean;
}

export default function ShopClientPage({
  category,
  search,
  sort,
  page,
  minPrice,
  maxPrice,
  inStock,
  isRecentlyViewed,
  isRecommended,
}: ShopClientPageProps) {
  const { toast } = useToast();
  const router = useRouter();

  // Create query filters based on props
  const getQueryFilters = () => {
    if (isRecentlyViewed) {
      const recentProductIds = getViewingHistory();
      return {
        ids: recentProductIds.length > 0 ? recentProductIds : undefined,
        page,
        limit: 12,
        sort: recentProductIds.length > 0 ? sort : 'featured',
      };
    } 
    
    if (isRecommended) {
      return {
        category,
        page,
        limit: 12,
        sort: 'featured',
      };
    } 
    
    return {
      category,
      search,
      sort,
      page,
      limit: 12,
      minPrice,
      maxPrice,
      inStock,
    };
  };

  // Use React Query hook
  const { data, isLoading, isError, error, refetch } = useProducts(getQueryFilters());
  
  // Extract data from query result
  const products = data?.data || [];
  const pagination = data?.pagination || {
    total: 0,
    page: 1,
    limit: 12,
    pages: 0,
  };

  // Determine if we have a database connection error
  const isConnectionError = error?.message?.includes('concurrent connections limit exceeded') || 
                           error?.details?.includes('concurrent connections limit exceeded');

  // Create page title and description
  const getPageTitle = () => {
    if (isRecentlyViewed) return "Recently Viewed";
    if (isRecommended) return "Recommended for You";
    if (search) return `Search Results: "${search}"`;
    if (category) return category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return "All Products";
  };

  const getPageDescription = () => {
    if (isRecentlyViewed) return "Products you've viewed recently";
    if (isRecommended) return "Products we think you'll love";
    if (search) return `Showing results for "${search}"`;
    if (category) return `Browse our selection of ${category.replace(/-/g, ' ')}`;
    return "Browse our entire catalog of products";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-4 w-40" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-20" />
          </div>
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
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <h3 className="font-medium">Error loading products</h3>
          </div>
          <div className="mt-2 text-sm">
            {isConnectionError 
              ? "The database is currently experiencing high traffic. Please try again in a moment."
              : "There was a problem loading the products. Please try again later."}
          </div>
        </div>
        
        <div className="flex justify-center my-8">
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
        
        {/* Show cached or recently viewed products as a fallback */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">You might be interested in</h2>
          <RecentlyViewedProducts />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${category}-${search}-${page}-${sort}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ProductGrid
            products={products}
            title={getPageTitle()}
            description={getPageDescription()}
            pagination={pagination}
            currentSort={sort}
            currentPage={page}
          />

          {products.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button
                onClick={() => {
                  router.push('/shop');
                }}
                variant="outline"
              >
                View all products
              </Button>
            </div>
          )}

          {!isRecentlyViewed && products.length > 0 && (
            <div className="mt-16">
              <RecentlyViewedProducts />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 