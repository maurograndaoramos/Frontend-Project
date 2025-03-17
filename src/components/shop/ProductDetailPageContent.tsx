// src/app/(routes)/(shop)/shop/product/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import ProductDetail from "@/components/shop/shop-components/ProductDetail";
import { Product } from "@/types/product";

// Mock data - In real app, this would come from an API
const products: Record<string, Product> = {
  "1": {
    id: "1",
    name: "Handcrafted Ceramic Vase",
    description: "A beautiful handcrafted vase perfect for any home décor. Each piece is unique with subtle variations in glaze and texture, showcasing the artisan's touch. Perfect for fresh or dried flower arrangements.",
    price: 45.99,
    originalPrice: 59.99,
    image: "/api/placeholder/400/500",
    inStock: true,
    category: "Home Decor",
    isNew: true,
    rating: 4.5,
  },
  // More products...
};

export default function ProductDetailPageContent() {
  const params = useParams();
  const productId = params.id as string;
  
  // In a real app, you'd fetch the product data based on the ID
  const product = products[productId];
  
  if (!product) {
    return <div>Product not found</div>;
  }
  
  return <ProductDetail product={product} />;
}