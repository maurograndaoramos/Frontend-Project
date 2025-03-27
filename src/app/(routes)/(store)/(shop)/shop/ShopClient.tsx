"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProducts } from "@/lib/services/productService";
import ProductCard from "@/components/shop/shop-components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/product";

export default function ShopClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
          minPrice,
          maxPrice,
          inStock,
        });
        
        setProducts(result.data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, [category, search, sort, page, minPrice, maxPrice, inStock, isRecentlyViewed, isRecommended]);

  if (loading) {
    return (
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
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">No Products Found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find any products matching your search.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
          <div key={product.id}>
            <ProductCard product={product} view="grid" />
          </div>
        ))}
      </div>
    </div>
  );
} 