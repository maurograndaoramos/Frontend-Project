// src/app/(routes)/(shop)/shop/category/[category]/page.tsx
"use client";

import { useParams } from "next/navigation";
import ProductGrid from "@/components/shop/shop-components/ProductGrid";
import CategoryFilter from "@/components/shop/shop-components/CategoryFilter";
import { Product } from "@/types/product";
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Mock data - In real app, this would come from an API
const products: Product[] = [
  // Products with different categories
];

const categories = [
  { id: "pottery", name: "Pottery", count: 12 },
  { id: "tableware", name: "Tableware", count: 8 },
  { id: "decor", name: "Home Decor", count: 15 },
  // More categories
];

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.category as string;
  const [showFilters, setShowFilters] = useState(false);
  
  const categoryName = categories.find(c => c.id === categoryId)?.name || categoryId;
  
  // Filter products by category
  const filteredProducts = products.filter(p => 
    p.category.toLowerCase() === categoryId.toLowerCase()
  );
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </div>
          <ChevronRight className={cn(
            "h-4 w-4 transition-transform duration-200",
            showFilters && "rotate-90"
          )} />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar with categories */}
        <AnimatePresence mode="wait">
          {(showFilters || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "space-y-6",
                "lg:block",
                showFilters ? "block" : "hidden"
              )}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <CategoryFilter categories={categories} />
              </motion.div>
              
              {/* Additional filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="font-medium text-sm text-muted-foreground">Price Range</h3>
                {/* Price range filter would go here */}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h3 className="font-medium text-sm text-muted-foreground">Availability</h3>
                {/* Availability filter would go here */}
              </motion.div>
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Product grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-3"
        >
          <ProductGrid 
            products={filteredProducts} 
            title={`${categoryName} Collection`}
            description={`Browse our selection of ${categoryName.toLowerCase()} products`}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}