// src/app/(routes)/(shop)/shop/collections/[collection]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import ProductGrid from "@/components/shop/shop-components/ProductGrid";
import { Product } from "@/types/product";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Mock data - In real app, this would come from an API
const collections = {
  "spring-collection": {
    name: "Spring Collection",
    description: "Embrace the season with our vibrant new pottery designs",
    heroImage: "/api/placeholder/1200/400",
    products: [/* products for this collection */],
    features: [
      "Seasonal designs",
      "Handcrafted pieces",
      "Limited edition items"
    ]
  },
  "dining-essentials": {
    name: "Dining Essentials",
    description: "Elevate your dining experience with our premium tableware",
    heroImage: "/api/placeholder/1200/400",
    products: [/* products for this collection */],
    features: [
      "Premium materials",
      "Dishwasher safe",
      "Lifetime warranty"
    ]
  },
  // More collections
};

export default function FeaturedCollectionsContent() {
  const params = useParams();
  const collectionId = params.collection as string;
  
  const collection = collections[collectionId];
  
  if (!collection) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 py-8 text-center"
      >
        <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Collection Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The collection you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/shop">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
        </Link>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Collection hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-lg overflow-hidden mb-12 group"
      >
        <Image
          src={collection.heroImage}
          alt={collection.name}
          width={1200}
          height={400}
          className="w-full object-cover h-64 md:h-80 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 flex flex-col justify-center p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight mb-2">
              {collection.name}
            </h1>
            <p className="text-white/90 max-w-md mb-6">
              {collection.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {collection.features.map((feature, index) => (
                <motion.span
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm text-white/90 px-3 py-1 rounded-full text-sm"
                >
                  {feature}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Collection products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ProductGrid 
          products={collection.products} 
          title={collection.name}
          description={collection.description}
        />
      </motion.div>

      {/* Related collections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16"
      >
        <h2 className="text-2xl font-semibold mb-6">Explore More Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(collections)
            .filter(([id]) => id !== collectionId)
            .map(([id, collection]) => (
              <Link key={id} href={`/shop/collections/${id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group relative rounded-lg overflow-hidden"
                >
                  <Image
                    src={collection.heroImage}
                    alt={collection.name}
                    width={400}
                    height={200}
                    className="w-full object-cover h-48 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {collection.name}
                    </h3>
                    <p className="text-white/80 text-sm mb-2">
                      {collection.description}
                    </p>
                    <div className="flex items-center text-white/90 text-sm">
                      <span>View Collection</span>
                      <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
}