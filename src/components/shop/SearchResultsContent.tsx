// src/app/(routes)/(shop)/search/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/shop/shop-components/ProductGrid";
import { Product } from "@/types/product";

// Mock data - In real app, this would come from an API
const products: Product[] = [
  // All products
];

export default function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  // Simple search implementation - in a real app, this would be handled by the backend
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductGrid 
        products={filteredProducts} 
        title={`Search Results for "${query}"`}
        description={`Found ${filteredProducts.length} products matching your search`}
      />
    </div>
  );
}