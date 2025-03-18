import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
      // Simplified query to debug - just get all products
      const products = await prisma.product.findMany({
        take: 10, // Limit to 10 products for testing
      });
  
      return NextResponse.json({
        products,
        pagination: {
          total: products.length,
          page: 1,
          limit: 10,
          pages: 1,
        },
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { error: "Failed to fetch products", details: error.message },
        { status: 500 }
      );
    }
  }