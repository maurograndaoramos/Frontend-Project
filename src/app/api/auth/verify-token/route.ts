import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/auth/verify-token - Verify a password reset token
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const rawToken = url.searchParams.get("token");
    
    // Clean and process the token to handle URL encoding and newlines
    const token = rawToken?.replace(/\r?\n|\r/g, '')?.trim();
    
    console.log('Raw token:', rawToken);
    console.log('Processed token:', token);

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }

    // Find user by reset token and ensure token is not expired
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token as string,
        resetTokenExpiry: {
          gt: new Date(),
        },
      } as any, // Type assertion needed due to Prisma types
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Token is valid" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Token verification error:", error);
    
    return NextResponse.json(
      { message: "An error occurred while verifying the token" },
      { status: 500 }
    );
  }
} 