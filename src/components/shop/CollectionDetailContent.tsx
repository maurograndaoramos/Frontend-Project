// src/app/(routes)/(shop)/shop/collections/[collection]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import ProductGrid from "@/components/shop/shop-components/ProductGrid";
import { Product, Collection } from "@/types/product";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { toast } from "sonner";

export default function CollectionDetailContent() {
  const params = useParams();
  const collectionSlug = params.collection as string;
  const [collection, setCollection] = useState<Collection | null>(null);
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollection() {
      setLoading(true);
      setError(null);
      try {
        // Fetch the specific collection
        const response = await fetch(`/api/collections/${collectionSlug}`);
        if (!response.ok) {
          throw new Error('Collection not found');
        }
        const data = await response.json();
        setCollection(data);
        
        // Fetch all collections for the "Explore More Collections" section
        const allCollectionsResponse = await fetch('/api/collections');
        if (!allCollectionsResponse.ok) {
          throw new Error('Failed to fetch collections');
        }
        const allCollectionsData = await allCollectionsResponse.json();
        setAllCollections(allCollectionsData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        toast.error('Failed to load collection');
        setCollection(null);
      } finally {
        setLoading(false);
      }
    }

    if (collectionSlug) {
      fetchCollection();
    }
  }, [collectionSlug]);
  
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]"
      >
        <div className="animate-pulse">
          <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-4"></div>
          <div className="h-6 w-48 bg-muted mx-auto mb-4"></div>
          <div className="h-4 w-64 bg-muted mx-auto"></div>
        </div>
      </motion.div>
    );
  }
  
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
        <Link href="/collections">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collections
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
          src={collection.heroImage || "/api/placeholder/1200/400"}
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
          products={collection.products || []} 
          title={collection.name}
          description={collection.description || ""}
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
          {allCollections
            .filter(item => item.id !== collection.id && item.isActive)
            .slice(0, 3) // Limit to 3 other collections
            .map(item => (
              <Link key={item.id} href={`/collections/${item.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group relative rounded-lg overflow-hidden"
                >
                  <Image
                    src={item.heroImage || "/api/placeholder/400/200"}
                    alt={item.name}
                    width={400}
                    height={200}
                    className="w-full object-cover h-48 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {item.name}
                    </h3>
                    <p className="text-white/80 text-sm mb-2">
                      {item.description}
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