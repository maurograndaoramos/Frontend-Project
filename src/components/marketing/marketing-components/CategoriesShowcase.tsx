// src/components/marketing/marketing-components/CategoriesShowcase.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getCategories } from "@/lib/services/productService";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  count: number;
}

export default function CategoriesShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      setLoading(true);
      try {
        const categoryData = await getCategories();
        // Take only first 3 categories or fewer if less exist
        setCategories(categoryData.slice(0, 3));
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-64 mb-12 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="w-full aspect-[3/2]" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no categories found
  if (categories.length === 0) {
    return null;
  }

  // Map of category names to appropriate floral images
  const categoryImages: Record<string, string> = {
    "floral": "/api/placeholder/600/400?text=Beautiful+Arrangements",
    "roses": "/api/placeholder/600/400?text=Elegant+Roses",
    "mixed arrangements": "/api/placeholder/600/400?text=Mixed+Arrangements",
    "seasonal": "/api/placeholder/600/400?text=Seasonal+Flowers",
    "bouquets": "/api/placeholder/600/400?text=Fresh+Bouquets",
  };

  // Function to get the best image for a category
  const getCategoryImage = (category: Category) => {
    const lowerCaseName = category.name.toLowerCase();
    
    // Look for specific matches first
    for (const [key, imageUrl] of Object.entries(categoryImages)) {
      if (lowerCaseName.includes(key)) {
        return imageUrl;
      }
    }
    
    // Fallback to default with category name
    return `/api/placeholder/600/400?text=${encodeURIComponent(category.name)}`;
  };


  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-4"
        >
          Shop by Category
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-center mb-12"
        >
          Discover our curated collection of floral arrangements
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 * index }}
            >
              <Link href={`/shop?category=${encodeURIComponent(category.id)}`}>
                <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <AspectRatio ratio={3/2} className="bg-muted">
                    <Image
                      src={getCategoryImage(category)}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </AspectRatio>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-white/80 mb-4">
                      {category.count} {category.count === 1 ? 'product' : 'products'}
                    </p>
                    <div className="flex items-center text-white/90 text-sm font-medium">
                      Shop Now <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}