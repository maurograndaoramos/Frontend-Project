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
        <div className="mb-6">
          {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
          {description && <p className="text-muted-foreground mt-2">{description}</p>}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none rounded-l-md ${viewMode === "grid" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none rounded-r-md ${viewMode === "list" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} view="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} view="list" />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
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
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
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
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            
            {/* Ellipsis if needed */}
            {currentPage > 4 && (
              <PaginationItem>
                <span className="flex h-9 w-9 items-center justify-center">...</span>
              </PaginationItem>
            )}
            
            {/* Pages around current page */}
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              // Calculate which page numbers to show centered around current page
              let pageNum;
              if (currentPage <= 3) {
                // Show first 5 pages
                pageNum = i + 1;
              } else if (currentPage >= pagination.pages - 2) {
                // Show last 5 pages
                pageNum = pagination.pages - 4 + i;
              } else {
                // Show 2 before and 2 after current page
                pageNum = currentPage - 2 + i;
              }

              // Only show if page is within range
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
                <span className="flex h-9 w-9 items-center justify-center">...</span>
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
                className={currentPage >= pagination.pages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}