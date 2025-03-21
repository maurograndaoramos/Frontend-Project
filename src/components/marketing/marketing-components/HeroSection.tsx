// src/components/marketing/marketing-components/HeroSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <div className="relative min-h-[80vh] flex items-center">
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Hero content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Beautiful Flowers for Every Occasion
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed"
          >
            Handcrafted arrangements that bring natural beauty and fragrance to your special moments.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              asChild
            >
              <Link href="/shop">Shop Collection</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              asChild
            >
              <Link href="/about">Our Story</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}