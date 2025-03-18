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
    
    // Format the response
    const formattedCategories = categories.map((item) => ({
      id: item.category.toLowerCase().replace(/\s+/g, '-'),
      name: item.category,
      count: item._count.category,
    }));
    
    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}