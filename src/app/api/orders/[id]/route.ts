import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }
    
    // Find the order with items and related products
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    
    // For security, only allow users to view their own orders unless they're an admin
    if (session?.user?.email !== order.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Format the order data for the client
    const formattedOrder = {
      id: order.id,
      date: order.createdAt.toLocaleDateString(),
      status: order.status,
      expectedDelivery: new Date(
        order.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
      email: order.user.email,
      address: formatAddress(order.shippingAddress),
      items: order.items.map((item) => ({
        id: item.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        image: item.product.images[0],
      })),
      subtotal: order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      shipping: 19.99, // Assuming standard shipping
      total: order.total,
    };
    
    return NextResponse.json({ order: formattedOrder });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// Helper function to format the address from the JSON
function formatAddress(addressJSON: any) {
  try {
    const address = typeof addressJSON === 'string' 
      ? JSON.parse(addressJSON) 
      : addressJSON;
      
    return `${address.address}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  } catch (error) {
    console.error("Error formatting address:", error);
    return "Address unavailable";
  }
} 