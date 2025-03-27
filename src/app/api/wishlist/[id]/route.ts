// src/app/api/wishlist/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { 
  addToWishlist,
  removeFromWishlist,
  isInWishlist
} from "@/lib/services/wishlistService";

// GET /api/wishlist/[id] - Check if product is in wishlist
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const productId = params.id;
    
    // Check if product is in wishlist
    const inWishlist = await isInWishlist(session.user.id, productId);
    
    return NextResponse.json({ inWishlist });
  } catch (error) {
    console.error("Error checking wishlist:", error);
    
    return NextResponse.json(
      { error: "Failed to check wishlist" },
      { status: 500 }
    );
  }
}

// PUT /api/wishlist/[id] - Add product to wishlist
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const productId = params.id;
    
    // Add product to wishlist
    await addToWishlist(session.user.id, productId);
    
    return NextResponse.json({ 
      message: "Product added to wishlist" 
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    
    if (error instanceof Error && error.message === 'Product not found') {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to add product to wishlist" },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist/[id] - Remove product from wishlist
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const productId = params.id;
    
    // Remove product from wishlist
    await removeFromWishlist(session.user.id, productId);
    
    return NextResponse.json({ 
      message: "Product removed from wishlist" 
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    
    return NextResponse.json(
      { error: "Failed to remove product from wishlist" },
      { status: 500 }
    );
  }
}