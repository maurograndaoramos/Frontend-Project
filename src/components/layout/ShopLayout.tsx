"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  ChevronRight, 
  FilterIcon, 
  SlidersHorizontal, 
  ChevronLeft,
  ChevronLeftSquare,
  ChevronRightSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import CategoryFilter from "@/components/shop/shop-components/CategoryFilter";
import PriceRangeFilter from "@/components/shop/shop-components/PriceRangeFilter";
import SearchBar from "@/components/shop/shop-components/SearchBar";
import { getCategories } from "@/lib/services/productService";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  
  // Get active filters for the badge
  const categoryFilter = searchParams.get("category");
  const searchFilter = searchParams.get("search");
  const minPriceFilter = searchParams.get("minPrice");
  const maxPriceFilter = searchParams.get("maxPrice");
  const inStockOnly = searchParams.get("inStock") === "true";
  
  // Count active filters for badge
  const activeFiltersCount = [
    categoryFilter, 
    searchFilter, 
    minPriceFilter || maxPriceFilter,
    inStockOnly
  ].filter(Boolean).length;
  
  // Load categories
  useEffect(() => {
    async function loadCategories() {
      setLoading(true);
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadCategories();
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="container mx-auto px-6 py-6">
      {/* Breadcrumb navigation */}
      <div className="flex items-center space-x-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center">
            <Home className="h-4 w-4 mr-1" />
            <span>Home</span>
          </Link>
        </Button>
        <span className="text-muted-foreground">/</span>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/shop" className="flex items-center">
            <span>Shop</span>
          </Link>
        </Button>
        {categoryFilter && (
          <>
            <span className="text-muted-foreground">/</span>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/shop?category=${categoryFilter}`} className="flex items-center">
                <span className="capitalize">{categoryFilter.replace(/-/g, ' ')}</span>
              </Link>
            </Button>
          </>
        )}
      </div>

      {/* Desktop sidebar toggle button - visible only on large screens */}
      <div className="hidden lg:flex mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleSidebar}
          className="flex items-center"
        >
          {sidebarExpanded ? (
            <PanelLeftClose className="h-4 w-4 mr-2" />
          ) : (
            <PanelLeftOpen className="h-4 w-4 mr-2" />
          )}
          {sidebarExpanded ? "Hide Filters" : "Show Filters"}
          {activeFiltersCount > 0 && !sidebarExpanded && (
            <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      <div className={cn(
        "grid grid-cols-1 gap-8",
        sidebarExpanded ? "lg:grid-cols-4" : "lg:grid-cols-1"
      )}>
        {/* Mobile filter trigger */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const params = new URLSearchParams();
                        params.set("page", "1");
                        window.location.href = `${pathname}?${params.toString()}`;
                      }}
                      className="h-8 text-muted-foreground"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                <div className="mb-6">
                  <SearchBar />
                </div>

                <Accordion type="multiple" defaultValue={["categories", "price"]} className="flex-1 overflow-auto">
                  <AccordionItem value="categories">
                    <AccordionTrigger>Categories</AccordionTrigger>
                    <AccordionContent>
                      {loading ? (
                        <div className="space-y-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <Skeleton className="h-4 w-4 rounded" />
                              <Skeleton className="h-4 w-full rounded" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <CategoryFilter categories={categories} />
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="price">
                    <AccordionTrigger>Price</AccordionTrigger>
                    <AccordionContent>
                      <PriceRangeFilter />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="availability">
                    <AccordionTrigger>Availability</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="mobile-in-stock"
                          checked={inStockOnly}
                          onCheckedChange={(checked) => {
                            const params = new URLSearchParams(searchParams.toString());
                            if (checked) {
                              params.set("inStock", "true");
                            } else {
                              params.delete("inStock");
                            }
                            params.set("page", "1");
                            window.location.href = `${pathname}?${params.toString()}`;
                          }}
                        />
                        <label
                          htmlFor="mobile-in-stock"
                          className="text-sm cursor-pointer"
                        >
                          In stock only
                        </label>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort dropdown for mobile */}
          <Button variant="outline" size="sm" className="flex items-center">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Sort
          </Button>
        </div>

        {/* Desktop sidebar filters */}
        <aside className={cn(
          "hidden space-y-6 transition-all duration-300",
          sidebarExpanded ? "lg:block" : "lg:hidden"
        )}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filters</h2>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("page", "1");
                  window.location.href = `${pathname}?${params.toString()}`;
                }}
                className="h-8 text-muted-foreground"
              >
                Clear all
              </Button>
            )}
          </div>

          <div className="mb-6">
            <SearchBar />
          </div>

          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <CategoryFilter categories={categories} />
            )}
          </div>

          <Separator />

          <PriceRangeFilter />

          <Separator />

          <div>
            <h3 className="font-medium mb-3">Availability</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={inStockOnly}
                onCheckedChange={(checked) => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (checked) {
                    params.set("inStock", "true");
                  } else {
                    params.delete("inStock");
                  }
                  params.set("page", "1");
                  window.location.href = `${pathname}?${params.toString()}`;
                }}
              />
              <label
                htmlFor="in-stock"
                className="text-sm cursor-pointer"
              >
                In stock only
              </label>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className={cn(
          sidebarExpanded ? "lg:col-span-3" : "lg:col-span-1"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}