// src/app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products/[id] - Get a product by ID
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id: productId } = await context.params;
    
    console.log(`API: Fetching product with ID: ${productId}`);
    
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        productType: true,
        collections: true
      }
    });
    
    if (!product) {
      console.log(`API: Product with ID ${productId} not found in database`);
      
      // Debug: log the first few products to compare IDs
      await logProductsForDebugging();
      
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// Helper function to log product IDs for debugging
async function logProductsForDebugging() {
  try {
    const products = await prisma.product.findMany({
      select: { id: true, name: true },
      take: 5,
    });
    
    console.log("Available products in database:", products);
  } catch (error) {
    console.error("Error fetching products for debugging:", error);
  }
}