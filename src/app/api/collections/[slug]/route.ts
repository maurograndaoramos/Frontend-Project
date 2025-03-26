import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Note: The collection model is accessed via lowercase in the prisma client
    // even though it's defined with a capital letter in the schema
    const resolvedParams = await params;
    const collection = await prisma.collection.findUnique({
      where: { slug: resolvedParams.slug }, // Changed to use slug
      include: {
        products: true // Include all related products
      }
    });

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Error fetching collection:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch collection",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await request.json();
    
    // Handle product associations
    const updateData: any = {
      name: data.name,
      description: data.description,
      heroImage: data.heroImage,
      features: data.features,
      isActive: data.isActive
    };
    
    // Only include defined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    
    // Add product connections if provided
    if (data.productIds) {
      // First disconnect all current products
      // Find the collection by slug or ID
      const existingCollection = await prisma.collection.findFirst({
        where: {
          OR: [
            { id: params.slug },
            { slug: params.slug }
          ]
        },
        select: { id: true }
      });
      
      if (!existingCollection) {
        return NextResponse.json(
          { error: "Collection not found" },
          { status: 404 }
        );
      }
      
      // Disconnect all products
      await prisma.collection.update({
        where: { id: existingCollection.id },
        data: {
          products: {
            set: [] // Remove all existing connections
          }
        }
      });
      
      // Then connect the new products
      updateData.products = {
        connect: data.productIds.map((id: string) => ({ id }))
      };
    }
    
    // Find the collection by slug or ID
    const existingCollection = await prisma.collection.findFirst({
      where: {
        OR: [
          { id: params.slug },
          { slug: params.slug }
        ]
      },
      select: { id: true }
    });
    
    if (!existingCollection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }
    
    // Update using ID
    const collection = await prisma.collection.update({
      where: { id: existingCollection.id },
      data: updateData,
      include: {
        products: true
      }
    });

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Error updating collection:", error);
    return NextResponse.json(
      { 
        error: "Failed to update collection",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Find the collection by slug or ID
    const existingCollection = await prisma.collection.findFirst({
      where: {
        OR: [
          { id: params.slug },
          { slug: params.slug }
        ]
      },
      select: { id: true }
    });
    
    if (!existingCollection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }
    
    // First disconnect all products to avoid foreign key constraints
    await prisma.collection.update({
      where: { id: existingCollection.id },
      data: {
        products: {
          set: [] // Disconnect all products
        }
      }
    });
    
    // Then delete the collection
    await prisma.collection.delete({
      where: { id: existingCollection.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting collection:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete collection",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
} 