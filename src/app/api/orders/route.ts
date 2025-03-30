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

    const orderData = await req.json();
    console.log("Received order data:", JSON.stringify(orderData));
    
    // Transform the orderData from frontend format to the format expected by our service
    const transformedOrderData = {
      userId: user.id,
      items: orderData.items.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      total: orderData.total,
      shippingAddress: orderData.shipping,
      status: 'pending',
      paymentMethod: orderData.payment.method
    };
    
    console.log("Transformed order data:", JSON.stringify(transformedOrderData));
    
    try {
      // Create the order using orderService
      const order = await createOrder(transformedOrderData);
      console.log("Order created:", order.id);
      
      return NextResponse.json({ orderId: order.id }, { status: 201 });
    } catch (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order in database" },
        { status: 500 }
      );
    }
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