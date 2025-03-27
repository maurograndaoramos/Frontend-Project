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
  const { data, isLoading, isError } = useProducts(getQueryFilters());
  
  // Extract data from query result
  const products = data?.data || [];
  const pagination = data?.pagination || {
    total: 0,
    page: 1,
    limit: 12,
    pages: 0,
  };

  // Show error toast if query fails
  if (isError) {
    toast({
      variant: "destructive",
      title: "Error loading products",
      description: "Please try again later",
    });
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="space-y-4"
            >
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center py-12"
      >
        <h2 className="text-2xl font-bold mb-4">No Products Found</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't find any products matching your search.
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="hover:bg-accent/50 transition-colors duration-200"
        >
          Go Back
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <ProductGrid 
          products={products} 
          title={
            isRecentlyViewed 
              ? "Recently Viewed Products"
              : isRecommended 
                ? "Recommended Products"
                : "Shop All Products"
          } 
          description={`Browse our collection of ${
            isRecentlyViewed 
              ? "recently viewed" 
              : isRecommended 
                ? "recommended" 
                : ""
          } products (${pagination.total} products)`}
          pagination={pagination}
          currentSort={sort}
          currentPage={page}
        />
        
        {/* Only show recently viewed section if not already viewing recently viewed products */}
        {!isRecentlyViewed && <RecentlyViewedProducts />}
      </motion.div>
    </AnimatePresence>
  );
} 