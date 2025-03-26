import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { emailService } from "@/lib/services/emailService";
import bcrypt from "bcrypt";

// POST /api/auth/reset-password - Request a password reset email
export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const { email } = body;
    
    // Validation
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    // Don't reveal if user exists or not for security reasons
    // We'll return a success message even if the user doesn't exist
    if (!user || !user.email) {
      return NextResponse.json(
        { 
          message: "If your email exists in our system, you'll receive password reset instructions." 
        },
        { status: 200 }
      );
    }
    
    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour
    
    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetToken as string,
        resetTokenExpiry: resetTokenExpiry,
      } as any, // Type assertion needed due to Prisma types
    });
    
    // Construct reset URL - ensure the token is properly formatted
    const cleanToken = resetToken.replace(/\r?\n|\r/g, ''); // Remove any newline chars
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${cleanToken}`;
    
    // Send password reset email with properly formatted text
    const emailText = `Hello${user.name ? ` ${user.name}` : ''},

You recently requested to reset your password for your Blooming Delights account.

Please click the link below to reset your password. This link is valid for 1 hour.

${resetUrl}

If you did not request a password reset, please ignore this email or contact support if you have questions.

Thank you,
The Blooming Delights Team`;

    const emailSent = await emailService.sendEmail({
      to: { email: user.email, name: user.name ?? undefined },
      subject: "Reset Your Blooming Delights Password",
      text: emailText,
    });
    
    if (!emailSent) {
      return NextResponse.json(
        { message: "Failed to send reset email" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        message: "If your email exists in our system, you'll receive password reset instructions." 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    
    return NextResponse.json(
      { message: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

// PUT /api/auth/reset-password - Reset the password using a token
export async function PUT(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const { token, password } = body;
    
    // Validation
    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      );
    }
    
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
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
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update user with new password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        hashedPassword: hashedPassword,
        resetToken: null as any,
        resetTokenExpiry: null,
      } as any, // Type assertion needed due to Prisma types
    });
    
    return NextResponse.json(
      { message: "Password has been reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    
    return NextResponse.json(
      { message: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}