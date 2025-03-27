import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Middleware for handling authentication checks - simplified for better performance
export async function middleware(request: NextRequest) {
  try {
    // Get token from NextAuth with simplified options
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    const isAuthenticated = !!token;
    const { pathname } = request.nextUrl;
    
    // Authentication routes that should redirect to dashboard if already logged in
    const authRoutes = ['/login', '/register', '/forgot-password'];
    
    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/checkout']; 
    
    // Check route types
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
    
    // If user is on an auth page and is already authenticated, redirect to dashboard
    if (isAuthRoute && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // If user is not authenticated and tries to access protected route, redirect to login
    if (isProtectedRoute && !isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      
      // Add callback URL for non-login pages
      if (!pathname.startsWith('/login')) {
        loginUrl.searchParams.set("callbackUrl", pathname);
      }
      
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  } catch (error) {
    // In case of errors, allow the request to proceed
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Match all protected routes
    '/dashboard/:path*',
    '/checkout/:path*',
    
    // Match auth routes only for redirect-to-dashboard logic (when already logged in)
    '/login',
    '/register',
    '/forgot-password',
  ],
};