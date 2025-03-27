"use client";

import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/shop/shop-components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useProducts } from "@/lib/api/productApi";
import { getViewingHistory } from "@/lib/services/recommendationService";

export default function ShopClient() {
  const searchParams = useSearchParams();

  // Extract search parameters
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const sort = searchParams.get("sort") || "featured";
  const page = parseInt(searchParams.get("page") || "1");
  const minPrice = searchParams.get("min_price") ? parseFloat(searchParams.get("min_price") as string) : undefined;
  const maxPrice = searchParams.get("max_price") ? parseFloat(searchParams.get("max_price") as string) : undefined;
  const inStock = searchParams.get("in_stock") === "true";
  const isRecentlyViewed = searchParams.get("recently_viewed") === "true";
  const isRecommended = searchParams.get("recommended") === "true";

  // Create query filters based on parameters with optimized data loading
  const getQueryFilters = () => {
    if (isRecentlyViewed) {
      const recentProductIds = getViewingHistory();
      return {
        ids: recentProductIds.length > 0 ? recentProductIds : undefined,
        page,
        limit: 12,
        sort: recentProductIds.length > 0 ? sort : 'featured',
        // For recently viewed products, we don't need related items
        includeRelated: false,
        // Basic data is sufficient for the grid view
        includeFullData: false,
      };
    } 
    
    if (isRecommended) {
      return {
        category,
        page,
        limit: 12,
        sort: 'featured',
        // For recommended products, we don't need related items
        includeRelated: false,
        // Basic data is sufficient for the grid view
        includeFullData: false,
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
      // For regular browsing, we don't need related items in the list view
      includeRelated: false,
      // Basic data is sufficient for the grid view
      includeFullData: false,
    };
  };

  // Use React Query hook with optimized data loading
  const { data, isLoading, isError } = useProducts(getQueryFilters());
  
  const products = data?.data || [];

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
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
        className="container mx-auto px-4 py-8"
      >
        <h1 className="text-3xl font-bold mb-4">No Products Found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find any products matching your search.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-2">
        {isRecentlyViewed 
          ? "Recently Viewed Products"
          : isRecommended 
            ? "Recommended Products" 
            : category 
              ? `Shop ${category}` 
              : "Shop All Products"}
      </h1>
      <p className="text-muted-foreground mb-6">
        Browse our collection of {products.length} products
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard product={product} view="grid" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 