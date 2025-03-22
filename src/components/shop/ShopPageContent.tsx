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

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const result = await getProducts({
          category,
          search,
          sort,
          page,
          limit: 12,
        });
        
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
  }, [category, search, sort, page, toast]);

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
          title="Shop All Products" 
          description={`Browse our collection of flowers and plants (${pagination.total} products)`}
          pagination={pagination}
        />
        
        {/* Recently viewed products section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <RecentlyViewedProducts maxItems={4} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}