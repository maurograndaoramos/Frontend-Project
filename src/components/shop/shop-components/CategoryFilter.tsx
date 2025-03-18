// src/components/shop/shop-components/CategoryFilter.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const activeCategory = searchParams.get("category");
  
  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (categoryId === activeCategory) {
      // If clicking the active category, remove the filter
      params.delete("category");
    } else {
      // Otherwise set the category
      params.set("category", categoryId);
    }
    
    // Reset to page 1 when changing category
    params.set("page", "1");
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <div key={category.id} className="flex items-center space-x-2">
          <Checkbox
            id={`category-${category.id}`}
            checked={category.id === activeCategory}
            onCheckedChange={() => handleCategoryChange(category.id)}
          />
          <label
            htmlFor={`category-${category.id}`}
            className="text-sm flex items-center justify-between w-full cursor-pointer"
          >
            <span className="capitalize">{category.name}</span>
            <span className="text-muted-foreground text-xs">({category.count})</span>
          </label>
        </div>
      ))}
    </div>
  );
}