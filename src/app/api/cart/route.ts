import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/cart - Add an item to the cart
export async function POST(req: Request) {
  try {
    // Get user session to ensure they're authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await req.json();
    const { productId, quantity = 1 } = body;
    
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    
    // Get the product details to confirm it exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    if (!product.inStock) {
      return NextResponse.json(
        { error: "Product is out of stock" },
        { status: 400 }
      );
    }
    
    // Since we're using client-side cart state with localStorage,
    // we don't need to save the cart to the database.
    // We'll just return success and let the client handle the cart state.
    
    return NextResponse.json(
      { 
        success: true,
        message: "Item added to cart",
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images && product.images.length > 0 
            ? product.images[0] 
            : null
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding item to cart:", error);
    
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
} 