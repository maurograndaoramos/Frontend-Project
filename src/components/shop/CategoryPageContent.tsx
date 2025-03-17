// src/app/(routes)/(shop)/shop/category/[category]/page.tsx
"use client";

import { useParams } from "next/navigation";
import ProductGrid from "@/components/shop/shop-components/ProductGrid";
import CategoryFilter from "@/components/shop/shop-components/CategoryFilter";
import { Product } from "@/types/product";

// Mock data - In real app, this would come from an API
const products: Product[] = [
  // Products with different categories
];

const categories = [
  { id: "pottery", name: "Pottery", count: 12 },
  { id: "tableware", name: "Tableware", count: 8 },
  { id: "decor", name: "Home Decor", count: 15 },
  // More categories
];

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.category as string;
  
  const categoryName = categories.find(c => c.id === categoryId)?.name || categoryId;
  
  // Filter products by category
  const filteredProducts = products.filter(p => 
    p.category.toLowerCase() === categoryId.toLowerCase()
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar with categories */}
        <aside className="space-y-6">
          <CategoryFilter 
            categories={categories} 
            activeCategory={categoryId} 
          />
          {/* Additional filters would go here */}
        </aside>
        
        {/* Product grid */}
        <div className="lg:col-span-3">
          <ProductGrid 
            products={filteredProducts} 
            title={`${categoryName} Collection`}
            description={`Browse our selection of ${categoryName.toLowerCase()} products`}
          />
        </div>
      </div>
    </div>
  );
}