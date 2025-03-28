// src/components/marketing/marketing-components/HeroSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Flower2, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const heroImages = [
  {
    src: "/images/hero/hero-1.jpg",
    alt: "Flower arrangement collection",
    title: "Beautiful Flowers for Every Occasion",
    subtitle: "Handcrafted arrangements that bring natural beauty and fragrance to your special moments.",
  },
  {
    src: "/images/hero/hero-2.jpg",
    alt: "Seasonal flower collections",
    title: "Seasonal Collections",
    subtitle: "Discover our curated selection of flowers for every season and celebration.",
  },
  {
    src: "/images/hero/hero-3.jpg",
    alt: "Custom flower arrangements",
    title: "Custom Arrangements",
    subtitle: "Let us create the perfect arrangement for your special moments.",
  },
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="relative min-h-[80vh] flex items-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hero background with carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.2,
              ease: "easeInOut"
            }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[currentImageIndex].src}
              alt={heroImages[currentImageIndex].alt}
              width={1600}
              height={800}
              className="w-full h-full object-cover brightness-[0.85]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hero content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-2 mb-4"
          >
            <Flower2 className="h-6 w-6 text-white animate-pulse" />
            <span className="text-white/90 text-sm uppercase tracking-wider">Welcome to Blooming Delights</span>
          </motion.div>

          <motion.h1 
            key={`title-${currentImageIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            {heroImages[currentImageIndex].title}
          </motion.h1>
          
          <motion.p 
            key={`subtitle-${currentImageIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed"
          >
            {heroImages[currentImageIndex].subtitle}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 relative z-30"
          >
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-white text-black hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl h-10 rounded-md px-8 py-2"
            >
              Shop Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-transparent text-white border border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300 h-10 rounded-md px-8 py-2"
            >
              Our Story
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Carousel indicators */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2"
      >
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? "bg-white w-4" 
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </motion.div>

      {/* Navigation arrows */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 z-20 pointer-events-none"
          >
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors pointer-events-auto"
              aria-label="Previous slide"
            >
              <ArrowRight className="h-6 w-6 rotate-180" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)}
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors pointer-events-auto"
              aria-label="Next slide"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}