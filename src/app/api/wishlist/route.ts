// src/app/api/wishlist/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { 
  getUserWishlist, 
  clearWishlist 
} from "@/lib/services/wishlistService";

// GET /api/wishlist - Get user's wishlist
export async function GET(req: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get user's wishlist
    const wishlist = await getUserWishlist(session.user.id);
    
    return NextResponse.json({ wishlist });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist - Clear user's wishlist
export async function DELETE(req: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
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