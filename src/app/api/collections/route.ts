import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");

    // Build query
    let query: any = {};
    
    // Filter by active status if provided
    if (active === "true") {
      query.isActive = true;
    }

    // Execute query - Use lowercase for the model name
    const collections = await prisma.collection.findMany({
      where: query,
      include: {
        products: {
          take: 4 // Include only a few products for preview
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch collections",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Use lowercase for the model name
    const collection = await prisma.collection.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        heroImage: data.heroImage,
        features: data.features || [],
        isActive: data.isActive ?? true,
        products: {
          connect: data.productIds?.map((id: string) => ({ id })) || []
        }
      }
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json(
      { 
        error: "Failed to create collection",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
} 