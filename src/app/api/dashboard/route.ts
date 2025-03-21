import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user data from Prisma
    const userData = await prisma.user.findFirst({
      where: {
        id: session.user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch recent orders from Prisma
    const ordersData = await prisma.order.findMany({
      where: {
        userId: userData.id,
        createdAt: {
          gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        total: true
      }
    });

    const formattedOrders = ordersData.map(order => ({
      id: order.id,
      date: new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      status: order.status as "Delivered" | "Processing" | "Shipped",
      total: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(order.total)
    }));

    // Fetch wishlist count from Prisma
    const wishlistItems = await prisma.wishlistItem.count({
      where: {
        userId: userData.id
      }
    });

    return NextResponse.json({
      user: {
        id: userData.id,
        name: userData.name || "Unknown User",
        email: userData.email || "",
        joinDate: new Date(userData.createdAt).toLocaleDateString('en-US', { 
          month: 'long',
          year: 'numeric'
        })
      },
      recentOrders: formattedOrders,
      wishlistCount: wishlistItems
    });
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 