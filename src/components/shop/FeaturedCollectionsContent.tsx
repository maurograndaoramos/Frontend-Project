// src/app/(routes)/(shop)/shop/collections/[collection]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import ProductGrid from "@/components/shop/shop-components/ProductGrid";
import { Product } from "@/types/product";

// Mock data - In real app, this would come from an API
const collections = {
  "spring-collection": {
    name: "Spring Collection",
    description: "Embrace the season with our vibrant new pottery designs",
    heroImage: "/api/placeholder/1200/400",
    products: [/* products for this collection */]
  },
  "dining-essentials": {
    name: "Dining Essentials",
    description: "Elevate your dining experience with our premium tableware",
    heroImage: "/api/placeholder/1200/400",
    products: [/* products for this collection */]
  },
  // More collections
};

export default function FeaturedCollectionsContent() {
  const params = useParams();
  const collectionId = params.collection as string;
  
  const collection = collections[collectionId];
  
  if (!collection) {
    return <div>Collection not found</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Collection hero */}
      <div className="relative rounded-lg overflow-hidden mb-12">
        <Image
          src={collection.heroImage}
          alt={collection.name}
          width={1200}
          height={400}
          className="w-full object-cover h-64 md:h-80"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-6">
          <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {collection.name}
          </h1>
          <p className="text-white/90 max-w-md mb-6">
            {collection.description}
          </p>
        </div>
      </div>
      
      {/* Collection products */}
      <ProductGrid 
        products={collection.products} 
        title={collection.name}
        description={collection.description}
      />
    </div>
  );
}