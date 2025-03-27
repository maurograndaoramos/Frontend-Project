// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { prismaRead } from "@/lib/prisma";
import { retryOnConnectionError, handleApiError, productCache } from "@/lib/db-utils";

// Define fields to select for list views to reduce payload size
const defaultProductSelect = {
  id: true,
  name: true,
  price: true,
  discount: true,
  description: true,
  images: true,
  category: true,
  inStock: true,
  isFeatured: true,
  // Omit these heavy fields unless specifically requested
  details: false,
  specifications: false,
  colorOptions: false,
  sizeOptions: false,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Parse query parameters
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "featured";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
  const inStock = searchParams.get("inStock") === "true";
  const ids = searchParams.get("ids")?.split(',');
  const includeRelated = searchParams.get("includeRelated") === "true";
  const includeFullData = searchParams.get("includeFullData") === "true";
  
  // Create a cache key from the query parameters
  const cacheKey = searchParams.toString();
  
  // Check if response is in cache
  const cachedData = productCache.get(cacheKey);
  if (cachedData) {
    console.log(`Using cached products for query: ${cacheKey}`);
    return NextResponse.json(cachedData);
  }
  
  try {
    console.log("Fetching products with params:", { category, search, sort, page, limit, minPrice, maxPrice, inStock, ids });
    
    // Build where clause for filtering
    const where: any = {};
    
    // Filter by product IDs if provided
    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }
    
    if (category) {
      // Convert hyphenated category to space-separated and capitalize
      const readableCategory = category.replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      console.log("Processing category filter:", {
        originalCategory: category,
        readableCategory
      });
      
      where.category = {
        equals: readableCategory,
        mode: 'insensitive'
      };
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    
    if (inStock) {
      where.inStock = true;
    }
    
    // Build orderBy based on sort parameter
    let orderBy: any = {};
    switch (sort) {
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "featured":
      default:
        orderBy = { isFeatured: "desc" };
        break;
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    console.log("Query where clause:", JSON.stringify(where, null, 2));
    
    // Execute query with count using retry utility for handling connection issues
    // Use READ client to reduce connection pressure
    const [products, total] = await Promise.all([
      retryOnConnectionError(() => 
        prismaRead.product.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          select: includeFullData ? undefined : {
            ...defaultProductSelect,
            // Only include these relations if specifically requested
            ...(includeRelated ? {
              productType: {
                select: {
                  id: true,
                  name: true,
                }
              },
              collections: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                }
              }
            } : {})
          },
        })
      ),
      retryOnConnectionError(() => 
        prismaRead.product.count({ where })
      ),
    ]);
    
    console.log(`Found ${products.length} products out of ${total} total`);
    
    // Calculate pagination
    const pages = Math.ceil(total / limit);
    
    // Create response data
    const responseData = {
      products,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
    };
    
    // Store in cache
    productCache.set(cacheKey, responseData);
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching products:", error);
    
    // Use our standardized error handler
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}