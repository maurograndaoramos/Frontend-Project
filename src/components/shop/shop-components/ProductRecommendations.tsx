"use client";

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Product } from '@/types/product';
import { getRecommendedProducts } from '@/lib/services/recommendationService';
import ProductCard from '@/components/shop/shop-components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

interface ProductRecommendationsProps {
  currentProductId?: string;
  category?: string;
  title?: string;
}

export default function ProductRecommendations({
  currentProductId,
  category,
  title = "You might also like"
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({
    container: containerRef,
    axis: "x"
  });

  const opacity = useTransform(scrollXProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  useEffect(() => {
    async function loadRecommendations() {
      setLoading(true);
      try {
        const recommendedProducts = await getRecommendedProducts(currentProductId, category);
        setRecommendations(recommendedProducts);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
        toast.error("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, [currentProductId, category]);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newPosition = direction === 'left' 
      ? Math.max(scrollPosition - scrollAmount, 0)
      : Math.min(scrollPosition + scrollAmount, container.scrollWidth - container.clientWidth);

    setScrollPosition(newPosition);
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mt-12"
      >
        <div className="flex items-center gap-2 mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden group">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-12"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className={cn(
                "transition-all duration-200",
                scrollPosition <= 0 && "opacity-50 cursor-not-allowed"
              )}
              disabled={scrollPosition <= 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className={cn(
                "transition-all duration-200",
                scrollPosition >= recommendations.length * 250 - window.innerWidth && "opacity-50 cursor-not-allowed"
              )}
              disabled={scrollPosition >= recommendations.length * 250 - window.innerWidth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      <div 
        ref={containerRef}
        className="relative overflow-hidden"
      >
        <motion.div 
          className="flex gap-6 transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          <AnimatePresence mode="wait">
            {recommendations.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.3,
                  ease: "easeOut"
                }}
                whileHover={{ y: -5 }}
                className="flex-none w-[250px]"
              >
                <ProductCard product={product} view="grid" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{ opacity }}
        >
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
        </motion.div>
      </div>
    </motion.div>
  );
}