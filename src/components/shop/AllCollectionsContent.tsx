"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Collection } from "@/types/product";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AllCollectionsContent() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      setLoading(true);
      try {
        const response = await fetch("/api/collections?active=true");
        if (!response.ok) {
          throw new Error("Failed to fetch collections");
        }
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        toast.error("Failed to load collections");
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-1/4 bg-muted rounded"></div>
          <div className="h-5 w-1/2 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-muted rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">No Collections Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          We're currently updating our collections. Please check back soon for
          our latest floral arrangements and plant collections.
        </p>
        <Link href="/shop">
          <Button>Browse All Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Our Collections</h1>
        <p className="text-muted-foreground max-w-2xl">
          Browse our curated collections of beautiful floral arrangements and
          plants for every occasion and space.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <Link href={`/collections/${collection.slug}`}>
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src={collection.heroImage || "/api/placeholder/800/500"}
                  alt={collection.name}
                  width={800}
                  height={500}
                  className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                  <div className="absolute bottom-0 left-0 p-6">
                    <h2 className="text-white text-xl font-semibold mb-2">
                      {collection.name}
                    </h2>
                    <p className="text-white/80 text-sm mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {collection.features.slice(0, 2).map((feature) => (
                        <span
                          key={feature}
                          className="text-xs bg-white/20 text-white px-2 py-1 rounded-full backdrop-blur-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-white text-sm font-medium">
                      <span>View Collection</span>
                      <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 