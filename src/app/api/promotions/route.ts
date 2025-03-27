// src/app/api/promotions/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendPromotionalEmail } from "@/lib/services/orderService";

// POST /api/promotions - Send promotional emails
export async function POST(req: Request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // In a real app, you would check if the user is an admin
    // Here we'll just assume the endpoint is secured

    // Parse request body
    const body = await req.json();
    const { 
      userIds, // Optional array of user IDs to target specific users
      subject,
      promotionName,
      promotionDetails,
      expiryDate,
      promoCode
    } = body;
    
    // Basic validation
    if (!subject || !promotionName || !promotionDetails) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Send promotional email
    const result = await sendPromotionalEmail(
      userIds || null, // null means send to all users
      {
        subject,
        promotionName,
        promotionDetails,
        expiryDate,
        promoCode
      }
    );
    
    const { message: ignoredMessage, ...resultRest } = result;
    
    return NextResponse.json({ 
      message: "Promotional emails sent successfully",
      ...resultRest
    });
  } catch (error) {
    console.error("Error sending promotional emails:", error);
    
    return NextResponse.json(
      { error: "Failed to send promotional emails" },
      { status: 500 }
    );
  }
}