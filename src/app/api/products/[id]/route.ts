// src/app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { prismaRead } from "@/lib/prisma";
import { retryOnConnectionError, handleApiError, productDetailCache } from "@/lib/db-utils";
import { Product } from "@/types/product";
import { Prisma } from "@prisma/client";

interface ProductResponse extends Product {
  similarProducts?: Partial<Product>[];
}

// GET /api/products/[identifier] - Get a product by ID or slug
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: identifier } = await context.params;
    const { searchParams } = new URL(req.url);
    
    // Parse query parameters
    const includeRelated = searchParams.get("includeRelated") === "true";
    const similarCount = parseInt(searchParams.get("similarCount") || "4");
    
    console.log(`API: Fetching product with identifier: ${identifier}`, { includeRelated, similarCount });
    
    if (!identifier) {
      return NextResponse.json(
        { error: "Product identifier is required" },
        { status: 400 }
      );
    }

    // Check cache first with parameters in the key
    const cacheKey = `product-${identifier}-${includeRelated}-${similarCount}`;
    const cachedProduct = productDetailCache.get(cacheKey);
    if (cachedProduct) {
      console.log(`Using cached product for identifier: ${identifier}`);
      return NextResponse.json(cachedProduct);
    }
    
    // Try to fetch the product with detailed schema
    try {
      // Try to find by either slug or ID
      const product = await retryOnConnectionError(() => 
        prismaRead.product.findFirst({
          where: {
            OR: [
              { slug: identifier },
              { id: identifier }
            ]
          },
          include: {
            productType: true,
            collections: true,
          }
        })
      ) as (Product & { productType: any; collections: any[] }) | null;
      
      if (!product) {
        console.log(`API: Product with identifier ${identifier} not found in database`);
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      
      // Create the response data with proper type assertion
      const responseData: ProductResponse = {
        ...product,
        productType: product.productType,
        collections: product.collections
      };
      
      // If related products are requested, fetch them in a single query
      if (includeRelated) {
        // Get similar products by category in a single query
        const similarProducts = await retryOnConnectionError(() => 
          prismaRead.product.findMany({
            where: {
              category: product.category,
              id: { not: product.id }, // Exclude current product
            },
            take: similarCount,
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              category: true,
              inStock: true,
              slug: true, // Include slug in the response
            },
          })
        ) as Partial<Product>[];
        
        // Add similar products to response
        responseData.similarProducts = similarProducts;
      }
      
      // Store in cache
      productDetailCache.set(cacheKey, responseData);
      
      return NextResponse.json(responseData);
    } 
    catch (prismaError) {
      console.error("Prisma query error in product detail:", prismaError);
      
      // Fall back to a simpler query without include if there's a schema mismatch
      console.log("Attempting fallback query without include...");
      
      // Try to find by either slug or ID
      const product = await retryOnConnectionError(() => 
        prismaRead.product.findFirst({
          where: {
            OR: [
              { slug: identifier },
              { id: identifier }
            ]
          }
        })
      ) as Product | null;
      
      if (!product) {
        console.log(`API: Product with identifier ${identifier} not found in database`);
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      
      // Store in cache
      productDetailCache.set(cacheKey, product);
      
      return NextResponse.json(product);
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    
    // Use standardized error handler
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

// Helper function to log product IDs for debugging
async function logProductsForDebugging() {
  try {
    const products = await retryOnConnectionError(() => 
      prismaRead.product.findMany({
        select: { id: true, name: true },
        take: 5,
      })
    );
    
    console.log("Available products in database:", products);
  } catch (error) {
    console.error("Error fetching products for debugging:", error);
  }
}