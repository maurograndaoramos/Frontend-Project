// src/components/shop/CategoryFilter.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory?: string;
}

export default function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const handleCategoryClick = (categoryId: string) => {
    // If we're already on a category page, we'll need different navigation logic
    if (pathname.includes('/category/')) {
      router.push(`/shop/category/${categoryId}`);
    } else {
      // Otherwise, we'll update the URL search params
      const params = new URLSearchParams(searchParams);
      params.set('category', categoryId);
      router.push(`${pathname}?${params.toString()}`);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center space-x-2">
            <Checkbox
              id={`category-${category.id}`}
              checked={category.id === activeCategory}
              onCheckedChange={() => handleCategoryClick(category.id)}
            />
            <label
              htmlFor={`category-${category.id}`}
              className="text-sm flex items-center justify-between w-full cursor-pointer"
            >
              <span>{category.name}</span>
              <span className="text-muted-foreground text-xs">({category.count})</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}