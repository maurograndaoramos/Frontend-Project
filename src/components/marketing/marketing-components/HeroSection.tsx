// src/components/marketing/marketing-components/HeroSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="relative">
      {/* Hero background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/api/placeholder/1600/800?text=Beautiful+Flower+Arrangements"
          alt="Flower arrangement collection"
          width={1600}
          height={800}
          className="w-full h-full object-cover brightness-[0.85]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Hero content */}
      <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40 relative z-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Beautiful Flowers for Every Occasion
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Handcrafted arrangements that bring natural beauty and fragrance to your special moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/shop">Shop Collection</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Link href="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}