// src/app/api/wishlist/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { 
  getUserWishlist, 
  clearWishlist 
} from "@/lib/services/wishlistService";

/**
 * GET /api/wishlist - Get user's wishlist items
 */
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(wishlistItems);
  } catch (error) {
    console.error("[WISHLIST_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST /api/wishlist - Add item to wishlist
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }
    
    // Check if item already exists in wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });
    
    if (existingItem) {
      return NextResponse.json({ error: "Item already in wishlist" }, { status: 409 });
    }
    
    // Add item to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId,
      },
    });
    
    return NextResponse.json(wishlistItem);
  } catch (error) {
    console.error("[WISHLIST_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/wishlist - Clear user's wishlist
export async function DELETE(req: Request) {
  try {
    // Check if user is authenticated
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Clear user's wishlist
    await clearWishlist(session.user.id);
    
    return NextResponse.json({ 
      message: "Wishlist cleared successfully" 
    });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    
    return NextResponse.json(
      { error: "Failed to clear wishlist" },
      { status: 500 }
    );
  }
}