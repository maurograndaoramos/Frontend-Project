import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Middleware for handling authentication checks - simplified for better performance
export async function middleware(request: NextRequest) {
  try {
    // Get token with more explicit options
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
      cookieName: "next-auth.session-token",
    });

    // Debug token (remove in production)
    if (process.env.NODE_ENV !== "production") {
    }

    const isAuthenticated = !!token;
    const { pathname } = request.nextUrl;
    
    // Authentication routes that should redirect to dashboard if already logged in
    const authRoutes = ['/login', '/register', '/forgot-password'];
    
    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/checkout']; 
    
    // Check route types
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
    
    // Debug route info (remove in production)
    if (process.env.NODE_ENV !== "production") {
      console.log({
        pathname,
        isAuthenticated,
        isProtectedRoute,
        isAuthRoute
      });
    }

    // If user is on an auth page and is already authenticated, redirect to dashboard
    if (isAuthRoute && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // If user is not authenticated and tries to access protected route, redirect to login
    if (isProtectedRoute && !isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // On error, allow the request to proceed but log the error
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
    '/forgot-password'
  ]
};