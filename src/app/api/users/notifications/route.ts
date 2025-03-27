import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateNotificationPreferences } from "@/lib/services/userService";

// PUT /api/users/notifications - Update notification preferences
export async function PUT(req: Request) {
  try {
    // Check if user is authenticated
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse request body
    const data = await req.json();
    
    // Basic validation
    if (!data || typeof data.email !== 'boolean' || typeof data.sms !== 'boolean') {
      return NextResponse.json(
        { error: "Invalid notification preferences" },
        { status: 400 }
      );
    }
    
    // Update notification preferences
    const preferences = await updateNotificationPreferences(session.user.id, {
      email: data.email,
      sms: data.sms
    });
    
    return NextResponse.json({
      message: "Notification preferences updated successfully",
      preferences
    });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    
    return NextResponse.json(
      { error: "Failed to update notification preferences" },
      { status: 500 }
    );
  }
} 