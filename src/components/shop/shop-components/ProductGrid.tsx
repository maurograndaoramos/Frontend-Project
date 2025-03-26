// src/components/shop/shop-components/ProductGrid.tsx
"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Product } from "@/types/product"; 
import { motion, AnimatePresence } from "framer-motion";

interface ProductGridProps {
  products: Product[];
  title?: string;
  description?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function ProductGrid({ 
  products, 
  title, 
  description,
  pagination
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentSort = searchParams.get('sort') || 'featured';
  const currentPage = parseInt(searchParams.get('page') || '1');

  // Function to update URL with new parameters
  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to page 1 when changing sort
    if (key === 'sort') {
      params.set('page', '1');
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      {/* Title and description */}
      {(title || description) && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
          {description && <p className="text-muted-foreground mt-2">{description}</p>}
        </motion.div>
      )}

      {/* Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4"
      >
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{products.length}</span> products
          {pagination && pagination.total > 0 && (
            <> of <span className="font-medium text-foreground">{pagination.total}</span></>
          )}
        </p>

        <div className="flex items-center gap-4">
          <Select 
            value={currentSort} 
            onValueChange={(value) => updateParams('sort', value)}
          >
            <SelectTrigger className="w-[180px] transition-colors duration-200 hover:border-primary/50">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none rounded-l-md transition-all duration-200 hover:bg-accent/50 ${
                viewMode === "grid" ? "bg-accent" : ""
              }`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none rounded-r-md transition-all duration-200 hover:bg-accent/50 ${
                viewMode === "list" ? "bg-accent" : ""
              }`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Products */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} view="grid" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} view="list" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      updateParams('page', (currentPage - 1).toString());
                    }
                  }}
                  className={`transition-colors duration-200 ${
                    currentPage <= 1 
                      ? "pointer-events-none opacity-50" 
                      : "hover:bg-accent/50"
                  }`}
                />
              </PaginationItem>
              
              {/* First page */}
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationLink 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      updateParams('page', '1');
                    }}
                    className="transition-colors duration-200 hover:bg-accent/50"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              )}
              
              {/* Ellipsis if needed */}
              {currentPage > 4 && (
                <PaginationItem>
                  <span className="flex h-9 w-9 items-center justify-center text-muted-foreground">...</span>
                </PaginationItem>
              )}
              
              {/* Pages around current page */}
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                let pageNum;
                if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                if (pageNum > 0 && pageNum <= pagination.pages) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          updateParams('page', pageNum.toString());
                        }}
                        isActive={currentPage === pageNum}
                        className="transition-colors duration-200 hover:bg-accent/50"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}
              
              {/* Ellipsis if needed */}
              {currentPage < pagination.pages - 3 && (
                <PaginationItem>
                  <span className="flex h-9 w-9 items-center justify-center text-muted-foreground">...</span>
                </PaginationItem>
              )}
              
              {/* Last page */}
              {currentPage < pagination.pages - 2 && (
                <PaginationItem>
                  <PaginationLink 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      updateParams('page', pagination.pages.toString());
                    }}
                    className="transition-colors duration-200 hover:bg-accent/50"
                  >
                    {pagination.pages}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < pagination.pages) {
                      updateParams('page', (currentPage + 1).toString());
                    }
                  }}
                  className={`transition-colors duration-200 ${
                    currentPage >= pagination.pages 
                      ? "pointer-events-none opacity-50" 
                      : "hover:bg-accent/50"
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}
    </div>
  );
}