"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, FilterIcon, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

// Mock categories data
const categories = [
  { id: "pots", name: "Pots & Planters", count: 24 },
  { id: "tableware", name: "Tableware", count: 16 },
  { id: "vases", name: "Vases", count: 12 },
  { id: "decor", name: "Home Decor", count: 8 },
];

// Price ranges
const priceRanges = [
  { id: "under-25", label: "Under $25", min: 0, max: 25 },
  { id: "25-50", label: "$25 to $50", min: 25, max: 50 },
  { id: "50-100", label: "$50 to $100", min: 50, max: 100 },
  { id: "over-100", label: "Over $100", min: 100, max: null },
];

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const togglePriceRange = (rangeId: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(rangeId)
        ? prev.filter((id) => id !== rangeId)
        : [...prev, rangeId]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setInStockOnly(false);
  };

  // Only show active filters badge if any filters are applied
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedPriceRanges.length > 0 ||
    inStockOnly;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center text-sm mb-6 text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="font-medium text-foreground">Shop</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Mobile filter trigger */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedCategories.length + selectedPriceRanges.length + (inStockOnly ? 1 : 0)}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-8 text-muted-foreground"
                  >
                    Clear all
                  </Button>
                </div>

                <Accordion type="multiple" defaultValue={["categories", "price"]} className="flex-1 overflow-auto">
                  <AccordionItem value="categories">
                    <AccordionTrigger>Categories</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => toggleCategory(category.id)}
                            />
                            <label
                              htmlFor={`mobile-${category.id}`}
                              className="text-sm flex items-center justify-between w-full cursor-pointer"
                            >
                              <span>{category.name}</span>
                              <span className="text-muted-foreground text-xs">({category.count})</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="price">
                    <AccordionTrigger>Price</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {priceRanges.map((range) => (
                          <div key={range.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-${range.id}`}
                              checked={selectedPriceRanges.includes(range.id)}
                              onCheckedChange={() => togglePriceRange(range.id)}
                            />
                            <label
                              htmlFor={`mobile-${range.id}`}
                              className="text-sm cursor-pointer"
                            >
                              {range.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="availability">
                    <AccordionTrigger>Availability</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="mobile-in-stock"
                          checked={inStockOnly}
                          onCheckedChange={() => setInStockOnly(!inStockOnly)}
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

                <div className="mt-auto pt-6">
                  <Button className="w-full">Apply Filters</Button>
                </div>
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
        <aside className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filters</h2>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 text-muted-foreground"
              >
                Clear all
              </Button>
            )}
          </div>

          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <label
                    htmlFor={category.id}
                    className="text-sm flex items-center justify-between w-full cursor-pointer"
                  >
                    <span>{category.name}</span>
                    <span className="text-muted-foreground text-xs">({category.count})</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3">Price</h3>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <div key={range.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={range.id}
                    checked={selectedPriceRanges.includes(range.id)}
                    onCheckedChange={() => togglePriceRange(range.id)}
                  />
                  <label
                    htmlFor={range.id}
                    className="text-sm cursor-pointer"
                  >
                    {range.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3">Availability</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={inStockOnly}
                onCheckedChange={() => setInStockOnly(!inStockOnly)}
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
        <main className="lg:col-span-3">
          {children}
        </main>
      </div>
    </div>
  );
}