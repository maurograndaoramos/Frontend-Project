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

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="group">
              <Link href={`/shop?category=${encodeURIComponent(category.id)}`}>
                <div className="overflow-hidden rounded-lg">
                  <AspectRatio ratio={3/2} className="bg-muted">
                    <Image
                      src={`/api/placeholder/600/400?text=${encodeURIComponent(category.name)}`}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                  </AspectRatio>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {category.count} {category.count === 1 ? 'product' : 'products'}
                  </p>
                  <div className="mt-2 flex items-center text-primary text-sm font-medium">
                    Shop Now <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}