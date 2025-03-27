"use client";

import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/shop/shop-components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/lib/api/productApi";
import { motion } from "framer-motion";

export default function SearchClient() {
  const searchParams = useSearchParams();

  // Extract search parameters
  const query = searchParams.get("q") || undefined;
  const category = searchParams.get("category") || undefined;
  const sort = searchParams.get("sort") || "relevance";
  const page = parseInt(searchParams.get("page") || "1");
  const minPrice = searchParams.get("min_price") ? parseFloat(searchParams.get("min_price") as string) : undefined;
  const maxPrice = searchParams.get("max_price") ? parseFloat(searchParams.get("max_price") as string) : undefined;
  const inStock = searchParams.get("in_stock") === "true";

  // Use React Query hook to fetch products
  const { data, isLoading, isError } = useProducts({
    category,
    search: query,
    sort,
    page,
    limit: 12,
    minPrice,
    maxPrice,
    inStock,
  });
  
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
            <div key={i} className="space-y-4">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground mb-6">
          There was an error loading the search results. Please try again.
        </p>
      </div>
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
        <h1 className="text-3xl font-bold mb-4">No Results Found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find any products matching "{query}".
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
        {query ? `Search Results for "${query}"` : "Search Results"}
      </h1>
      <p className="text-muted-foreground mb-6">
        Found {products.length} products matching your search
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