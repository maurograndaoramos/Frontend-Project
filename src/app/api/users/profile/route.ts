import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserProfile, updateUserProfile } from "@/lib/services/userService";

// GET /api/users/profile - Get current user's profile
export async function GET() {
  try {
    // Check if user is authenticated
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get user profile
    const profile = await getUserProfile(session.user.id);
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error loading profile:", error);
    
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    );
  }
}

// PUT /api/users/profile - Update current user's profile
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
    if (!data) {
      return NextResponse.json(
        { error: "No data provided" },
        { status: 400 }
      );
    }
    
    // Update user profile
    const updatedProfile = await updateUserProfile(session.user.id, data);
    
    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedProfile
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    
    if (error.message === 'Email is already in use') {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
} 