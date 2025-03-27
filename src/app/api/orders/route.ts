// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createOrder, getUserOrders } from "@/lib/services/orderService";

// POST /api/orders - Create a new order
export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to create an order" },
        { status: 401 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { items, shippingAddress, total } = body;
    
    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: "pending",
        total,
        shippingAddress,
        items: {
          create: items.map((item: any) => ({
            quantity: item.quantity,
            price: item.price,
            productId: item.id,
          })),
        },
      },
    });

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
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
    const session = await auth();
    
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