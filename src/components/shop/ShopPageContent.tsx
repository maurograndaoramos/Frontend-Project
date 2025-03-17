// src/app/(routes)/(shop)/shop/page.tsx
"use client";

import ProductGrid from "@/components/shop/shop-components/ProductGrid";
import { Product } from "@/types/product";

// Mock data - In real app, this would come from an API
const products: Product[] = [
  {
    id: "1",
    name: "Handcrafted Ceramic Vase",
    description: "A beautiful handcrafted vase perfect for any home décor.",
    price: 45.99,
    originalPrice: 59.99,
    image: "/api/placeholder/400/500",
    inStock: true,
    category: "Home Decor",
    isNew: true,
    rating: 4.5,
  },
  // Add more products...
];

export default function ShopPageContent() {
  return (
    <ProductGrid 
      products={products} 
      title="Shop All Products" 
      description="Browse our collection of handcrafted pottery and ceramic goods"
    />
  );
}