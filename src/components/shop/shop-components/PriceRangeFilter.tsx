// src/components/shop/shop-components/PriceRangeFilter.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@radix-ui/react-dropdown-menu";

const priceRanges = [
  { label: "Under €25", min: 0, max: 25 },
  { label: "€25 to €50", min: 25, max: 50 },
  { label: "€50 to €100", min: 50, max: 100 },
  { label: "Over €100", min: 100, max: null },
];

// Debounce function to limit how often a function is called
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function PriceRangeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [minPrice, setMinPrice] = useState(
    parseInt(searchParams.get("minPrice") || "0")
  );
  const [maxPrice, setMaxPrice] = useState(
    parseInt(searchParams.get("maxPrice") || "500")
  );
  
  // Store initialization flag to prevent auto-applying on initial render
  const isInitialized = useRef(false);
  
  // When URL params change, update the state
  useEffect(() => {
    const minFromUrl = searchParams.get("minPrice");
    const maxFromUrl = searchParams.get("maxPrice");
    
    if (minFromUrl) {
      setMinPrice(parseInt(minFromUrl));
    } else if (searchParams.toString()) {
      // Only reset if there are other search params
      setMinPrice(0);
    }
    
    if (maxFromUrl) {
      setMaxPrice(parseInt(maxFromUrl));
    } else if (searchParams.toString()) {
      // Only reset if there are other search params
      setMaxPrice(500);
    }
    
    // Set initialized after first render
    isInitialized.current = true;
  }, [searchParams]);
  
  // Debounced version of applyPriceFilter
  const debouncedApplyPriceFilter = useRef(
    debounce(() => {
      applyPriceFilter();
    }, 500)
  ).current;
  
  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (minPrice > 0) {
      params.set("minPrice", minPrice.toString());
    } else {
      params.delete("minPrice");
    }
    
    if (maxPrice < 500 && maxPrice > minPrice) {
      params.set("maxPrice", maxPrice.toString());
    } else {
      params.delete("maxPrice");
    }
    
    // Reset to page 1 when filtering
    params.set("page", "1");
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const handlePresetRange = (min: number, max: number | null) => {
    setMinPrice(min);
    setMaxPrice(max || 500);
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (min > 0) {
      params.set("minPrice", min.toString());
    } else {
      params.delete("minPrice");
    }
    
    if (max !== null) {
      params.set("maxPrice", max.toString());
    } else {
      params.delete("maxPrice");
    }
    
    // Reset to page 1 when filtering
    params.set("page", "1");
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const clearPriceFilter = () => {
    setMinPrice(0);
    setMaxPrice(500);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    
    // Reset to page 1 when filtering
    params.set("page", "1");
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const handleSliderChange = (value: number[]) => {
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
    
    // Auto-apply the filter after a short delay
    if (isInitialized.current) {
      debouncedApplyPriceFilter();
    }
  };
  
  const handleInputChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    
    if (type === 'min') {
      setMinPrice(numValue);
    } else {
      setMaxPrice(numValue);
    }
    
    // Auto-apply the filter after a short delay
    if (isInitialized.current) {
      debouncedApplyPriceFilter();
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Price Range</h3>
      
      <div className="space-y-2">
        {priceRanges.map(range => (
          <button
            key={range.label}
            className={`text-sm w-full text-left py-1 px-2 rounded hover:bg-muted ${
              minPrice === range.min && (maxPrice === range.max || (range.max === null && maxPrice === 500))
                ? "bg-muted font-medium"
                : ""
            }`}
            onClick={() => handlePresetRange(range.min, range.max)}
          >
            {range.label}
          </button>
        ))}
      </div>
      
      <Separator className="my-3" />
      
      <div>
        <Slider
          value={[minPrice, maxPrice]}
          min={0}
          max={500}
          step={5}
          onValueChange={handleSliderChange}
          className="my-6"
        />
        
        <div className="flex items-center space-x-2">
          <div className="grid gap-2 flex-1">
            <Label htmlFor="minPrice">Min</Label>
            <Input
              id="minPrice"
              type="number"
              value={minPrice}
              onChange={(e) => handleInputChange('min', e.target.value)}
              className="h-8"
            />
          </div>
          <div className="pt-6">—</div>
          <div className="grid gap-2 flex-1">
            <Label htmlFor="maxPrice">Max</Label>
            <Input
              id="maxPrice"
              type="number"
              value={maxPrice}
              onChange={(e) => handleInputChange('max', e.target.value)}
              className="h-8"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearPriceFilter}
          >
            Reset
          </Button>
          <Button 
            size="sm" 
            onClick={applyPriceFilter}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}