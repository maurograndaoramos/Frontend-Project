// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { prismaRead } from "@/lib/prisma";
import { retryOnConnectionError, handleApiError, productCache } from "@/lib/db-utils";

// Define fields to select for list views to reduce payload size
const defaultProductSelect = {
  id: true,
  name: true,
  price: true,
  // Replace direct discount field with hasDiscount and discountPercent
  hasDiscount: true,
  discountPercent: true,
  originalPrice: true,
  description: true,
  images: true,
  category: true,
  inStock: true,
  isFeatured: true,
  isNew: true,
  createdAt: true,
  updatedAt: true,
  // Omit these heavy fields unless specifically requested
  productTypeId: false,
  collections: false,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Parse query parameters
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "featured";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const minPrice = searchParams.has("minPrice") 
    ? parseFloat(searchParams.get("minPrice")!) 
    : searchParams.has("min_price") 
      ? parseFloat(searchParams.get("min_price")!) 
      : undefined;
  const maxPrice = searchParams.has("maxPrice") 
    ? parseFloat(searchParams.get("maxPrice")!) 
    : searchParams.has("max_price") 
      ? parseFloat(searchParams.get("max_price")!) 
      : undefined;
  const inStock = searchParams.get("inStock") === "true" || searchParams.get("in_stock") === "true";
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
    console.log("Fetching products with params:", { 
      category, search, sort, page, limit, minPrice, maxPrice, inStock, ids,
      includeRelated, includeFullData
    });
    
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
    
    // Prepare the select object based on includeFullData and includeRelated
    let selectObject: any = undefined;
    if (!includeFullData) {
      selectObject = {
        ...defaultProductSelect
      };
      
      // Only include relations if specifically requested
      if (includeRelated) {
        selectObject.productType = {
          select: {
            id: true,
            name: true,
          }
        };
        
        selectObject.collections = {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        };
      }
    }
    
    console.log("Using select object:", JSON.stringify(selectObject, null, 2));
    
    // Execute query with count using retry utility for handling connection issues
    // Use READ client to reduce connection pressure
    try {
      const [products, total] = await Promise.all([
        retryOnConnectionError(() => 
          prismaRead.product.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            select: selectObject,
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
        data: products,
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
    } catch (prismaError) {
      console.error("Prisma query error:", prismaError);
      
      // Fall back to a simpler query without select if there's a schema mismatch
      console.log("Attempting fallback query without select...");
      const [products, total] = await Promise.all([
        retryOnConnectionError(() => 
          prismaRead.product.findMany({
            where,
            orderBy,
            skip,
            take: limit,
          })
        ),
        retryOnConnectionError(() => 
          prismaRead.product.count({ where })
        ),
      ]);
      
      console.log(`Fallback query found ${products.length} products out of ${total} total`);
      
      // Calculate pagination
      const pages = Math.ceil(total / limit);
      
      // Create response data
      const responseData = {
        data: products,
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
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    
    // Use our standardized error handler
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}