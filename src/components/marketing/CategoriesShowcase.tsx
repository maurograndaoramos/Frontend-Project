// src/components/marketing/CategoriesShowcase.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const categories = [
  {
    id: "tableware",
    name: "Tableware",
    image: "/api/placeholder/600/400",
    description: "Elevate your dining experience",
  },
  {
    id: "vases",
    name: "Vases & Decor",
    image: "/api/placeholder/600/400",
    description: "Beautiful accents for your home",
  },
  {
    id: "planters",
    name: "Planters",
    image: "/api/placeholder/600/400",
    description: "Perfect homes for your greenery",
  },
];

export default function CategoriesShowcase() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="group">
              <Link href={`/shop/category/${category.id}`}>
                <div className="overflow-hidden rounded-lg">
                  <AspectRatio ratio={3/2} className="bg-muted">
                    <Image
                      src={category.image}
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
                  <p className="text-muted-foreground">{category.description}</p>
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