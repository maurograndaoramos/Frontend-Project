// src/components/shop/shop-components/SearchBar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchSuggestions } from "@/lib/api/searchApi";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  
  // Use React Query for search suggestions (will help with caching between page navigations)
  const { 
    data: suggestionsData, 
    isLoading 
  } = useSearchSuggestions(searchQuery, 5);
  
  // Update search query when URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    
    // Reset to page 1 when searching
    params.set("page", "1");
    
    // Redirect to shop page with search params
    router.push(`/shop?${params.toString()}`);
  };
  
  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pr-10"
      />
      <Button 
        type="submit"
        variant="ghost" 
        size="icon" 
        className="absolute right-0 top-0 h-full"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}