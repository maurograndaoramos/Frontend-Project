"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/shop/shop-components/ProductGrid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/product";
import { getProducts } from "@/lib/services/productService";
import { useToast } from "@/lib/hooks/useToast";
import RecentlyViewedProducts from "@/components/shop/shop-components/RecentlyViewedProducts";
import { motion, AnimatePresence } from "framer-motion";
import { getViewingHistory } from "@/lib/services/recommendationService";

export default function ShopPageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 0,
  });

  // Extract filter values from URL params
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const sort = searchParams.get('sort') || 'featured';
  const page = parseInt(searchParams.get('page') || '1');
  const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice') || '0') : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice') || '500') : undefined;
  const inStock = searchParams.get('inStock') === 'true';
  
  // New parameters
  const isRecentlyViewed = searchParams.get('recent') === 'true';
  const isRecommended = searchParams.get('recommended') === 'true';

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        console.log('Loading products with filters:', { category, search, sort, page, minPrice, maxPrice, inStock, isRecentlyViewed, isRecommended });
        
        let result;
        
        if (isRecentlyViewed) {
          // Get recently viewed products IDs from local storage
          const recentProductIds = getViewingHistory();
          if (recentProductIds.length > 0) {
            // Fetch products by IDs
            result = await getProducts({
              ids: recentProductIds,
              page,
              limit: 12,
              sort
            });
          } else {
            // If no recent products, show featured products instead
            result = await getProducts({
              sort: 'featured',
              page,
              limit: 12
            });
          }
        } else if (isRecommended) {
          // Get recommended products
          // Since we don't have a specific product context here, 
          // we'll get recommendations based on category if available
          result = await getProducts({
            category,
            page,
            limit: 12,
            sort: 'featured' // Recommended products usually sorted by featured
          });
        } else {
          // Normal search/filter
          result = await getProducts({
            category,
            search,
            sort,
            page,
            limit: 12,
            minPrice,
            maxPrice,
            inStock,
          });
        }
        
        setProducts(result.data);
        setPagination(result.pagination);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading products",
          description: "Please try again later",
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, [category, search, sort, page, minPrice, maxPrice, inStock, isRecentlyViewed, isRecommended, toast]);

  if (loading) {
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
        />
        
        {/* Only show recently viewed section if not already viewing recently viewed products */}
        {!isRecentlyViewed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <RecentlyViewedProducts maxItems={4} />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}