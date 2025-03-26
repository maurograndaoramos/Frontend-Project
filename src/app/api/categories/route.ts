// src/app/api/categories/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all unique categories with their product counts
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
    });
    
    // Get all subcategories grouped by category with their counts
    const subcategories = await prisma.product.groupBy({
      by: ['category', 'subcategory'],
      _count: {
        subcategory: true,
      },
      having: {
        subcategory: {
          not: null,
        },
      },
    });
    
    // Format the categories with their subcategories
    const formattedCategories = categories.map((item) => {
      const categoryId = item.category.toLowerCase().replace(/\s+/g, '-');
      
      // Find subcategories for this category
      const categorySubcategories = subcategories
        .filter(sub => sub.category === item.category && sub.subcategory)
        .map(sub => ({
          id: `${categoryId}-${sub.subcategory?.toLowerCase().replace(/\s+/g, '-')}`,
          name: sub.subcategory || '',
          count: sub._count.subcategory,
          parentId: categoryId
        }));
      
      return {
        id: categoryId,
        name: item.category,
        count: item._count.category,
        subcategories: categorySubcategories,
        hasSubcategories: categorySubcategories.length > 0
      };
    });
    
    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}