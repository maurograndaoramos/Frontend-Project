// src/components/shop/shop-components/CategoryFilter.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Subcategory {
  id: string;
  name: string;
  count: number;
  parentId: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
  subcategories?: Subcategory[];
  hasSubcategories?: boolean;
}

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const activeCategory = searchParams.get("category");
  
  // Track which categories have their subcategories expanded
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // Keep track of checked state to avoid UI glitches with checkbox
  const [checkedCategories, setCheckedCategories] = useState<Record<string, boolean>>({});
  
  // Update checked categories whenever activeCategory changes
  useEffect(() => {
    const newCheckedState: Record<string, boolean> = {};
    
    // Reset all to unchecked first
    categories.forEach(category => {
      newCheckedState[category.id] = false;
      category.subcategories?.forEach(subcategory => {
        newCheckedState[subcategory.id] = false;
      });
    });
    
    // Then set active category as checked
    if (activeCategory) {
      newCheckedState[activeCategory] = true;
      
      // If a subcategory is selected, also check its parent category visually
      const parentCategory = categories.find(category => 
        category.subcategories?.some(sub => sub.id === activeCategory)
      );
      
      if (parentCategory) {
        newCheckedState[parentCategory.id] = true;
      }
    }
    
    setCheckedCategories(newCheckedState);
  }, [activeCategory, categories]);
  
  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    // Update the URL parameters
    const params = new URLSearchParams(searchParams.toString());
    
    if (checked) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    
    // Reset to page 1 when changing category
    params.set("page", "1");
    
    // Use window.location.href for navigation
    window.location.href = `${pathname}?${params.toString()}`;
  };
  
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <div key={category?.id || `category-${category?.name}`} className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category?.id || category?.name}`}
                checked={checkedCategories[category?.id || ''] || false}
                onCheckedChange={(checked) => category?.id && handleCategoryChange(category.id, checked === true)}
              />
              <label
                htmlFor={`category-${category?.id || category?.name}`}
                className="text-sm flex items-center cursor-pointer"
              >
                <span className="capitalize">{category?.name || 'Unknown Category'}</span>
                <span className="text-muted-foreground text-xs ml-2">({category?.count || 0})</span>
              </label>
            </div>
            
            {category.hasSubcategories && (
              <button 
                type="button"
                onClick={() => toggleExpanded(category.id)}
                className="p-1 rounded-sm hover:bg-accent/50 transition-colors"
                aria-label={expandedCategories[category.id] ? "Collapse subcategories" : "Expand subcategories"}
              >
                <ChevronRight className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  expandedCategories[category.id] && "rotate-90"
                )} />
              </button>
            )}
          </div>
          
          {/* Subcategories section */}
          {category?.hasSubcategories && expandedCategories[category?.id || ''] && (
            <div className="pl-6 space-y-1 mt-1 ml-1 border-l border-border/50">
              {category?.subcategories?.map((subcategory) => (
                <div key={subcategory?.id || `subcategory-${subcategory?.name}`} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subcategory-${subcategory?.id || subcategory?.name}`}
                    checked={checkedCategories[subcategory?.id || ''] || false}
                    onCheckedChange={(checked) => subcategory?.id && handleCategoryChange(subcategory.id, checked === true)}
                  />
                  <label
                    htmlFor={`subcategory-${subcategory?.id || subcategory?.name}`}
                    className="text-sm flex items-center justify-between w-full cursor-pointer"
                  >
                    <span className="capitalize">{subcategory?.name || 'Unknown Subcategory'}</span>
                    <span className="text-muted-foreground text-xs">({subcategory?.count || 0})</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}