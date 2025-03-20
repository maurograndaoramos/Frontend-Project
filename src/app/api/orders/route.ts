// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createOrder, getUserOrders } from "@/lib/services/orderService";

// POST /api/orders - Create a new order
export async function POST(req: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    const { items, total, shippingAddress, paymentMethod, paymentIntent } = body;
    
    // Basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }
    
    if (!shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }
    
    // Create the order with user's ID
    const order = await createOrder({
      userId: session.user.id,
      items,
      total,
      shippingAddress,
      status: "pending",
      paymentMethod,
      paymentIntent
    });
    
    return NextResponse.json(
      { 
        message: "Order created successfully", 
        orderId: order.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// GET /api/orders - Get user's orders
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
    
    // Get user's orders
    const orders = await getUserOrders(session.user.id);
    
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}