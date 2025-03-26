import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Note: The productType model is accessed via lowercase in the prisma client
    // even though it's defined with a capital letter in the schema
    const productTypes = await prisma.productType.findMany({
      include: {
        products: {
          take: 4 // Include only a few products for preview
        }
      }
    });

    return NextResponse.json(productTypes);
  } catch (error) {
    console.error("Error fetching product types:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch product types",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Note: The productType model is accessed via lowercase in the prisma client
    const productType = await prisma.productType.create({
      data: {
        name: data.name,
        description: data.description || "",
      }
    });

    return NextResponse.json(productType, { status: 201 });
  } catch (error) {
    console.error("Error creating product type:", error);
    return NextResponse.json(
      { 
        error: "Failed to create product type",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
} 