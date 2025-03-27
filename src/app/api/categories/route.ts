// src/app/api/categories/route.ts
import { NextResponse } from "next/server";
import { prismaRead } from "@/lib/prisma";
import { retryOnConnectionError, handleApiError, categoryCache } from "@/lib/db-utils";

export async function GET(request: Request) {
  // Create a cache key based on URL
  const cacheKey = "categories";
  
  // Check if response is in cache
  const cachedData = categoryCache.get(cacheKey);
  if (cachedData) {
    console.log(`Using cached categories`);
    return NextResponse.json(cachedData);
  }
  
  try {
    // Fetch all categories in a single efficient query
    // Use READ client for better connection management
    const categories = await retryOnConnectionError(() => 
      prismaRead.product.groupBy({
        by: ['category'],
        _count: {
          category: true
        },
        orderBy: {
          _count: {
            category: 'desc'
          }
        }
      })
    );
    
    // Transform the results into a more user-friendly format
    const formattedCategories = categories.map(item => ({
      name: item.category,
      slug: item.category.toLowerCase().replace(/ /g, '-'),
      count: item._count.category
    }));
    
    // Store in cache (categoryCache has longer TTL since categories rarely change)
    categoryCache.set(cacheKey, formattedCategories);
    
    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    
    // Use standardized error handler
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}