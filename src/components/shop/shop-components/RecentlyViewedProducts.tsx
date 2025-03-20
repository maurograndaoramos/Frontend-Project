"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Product } from '@/types/product';
import { getViewingHistory } from '@/lib/services/recommendationService';
import { getProduct } from '@/lib/services/productService';
import ProductCard from '@/components/shop/shop-components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentlyViewedProductsProps {
  maxItems?: number;
  excludeProductId?: string;
  title?: string;
}

export default function RecentlyViewedProducts({
  maxItems = 4,
  excludeProductId,
  title = "Recently Viewed"
}: RecentlyViewedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecentlyViewedProducts() {
      setLoading(true);
      try {
        // Get product IDs from viewing history
        const productIds = getViewingHistory();
        
        // Filter out current product if needed
        const filteredIds = excludeProductId 
          ? productIds.filter(id => id !== excludeProductId)
          : productIds;
        
        // Limit number of products to fetch
        const limitedIds = filteredIds.slice(0, maxItems);
        
        // No recently viewed products
        if (limitedIds.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }
        
        // Fetch product details for each ID
        const productPromises = limitedIds.map(id => getProduct(id));
        const results = await Promise.all(productPromises);
        
        // Filter out any null results (products that weren't found)
        const validProducts = results.filter(product => product !== null) as Product[];
        
        setProducts(validProducts);
      } catch (error) {
        console.error('Failed to load recently viewed products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRecentlyViewedProducts();
  }, [excludeProductId, maxItems]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array(maxItems).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} view="grid" />
        ))}
      </div>
    </div>
  );
}