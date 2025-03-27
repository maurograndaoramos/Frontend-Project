import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Middleware for handling authentication checks
export async function middleware(request: NextRequest) {
  // Get token from NextAuth with more explicit options
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });
  
  console.log("Token in middleware:", !!token); // Log token presence for debugging
  
  const isAuthenticated = !!token;
  
  // Get the pathname of the request
  const { pathname } = request.nextUrl;
  
  // Authentication routes that should redirect to dashboard if already logged in
  const authRoutes = ['/login', '/register', '/forgot-password'];
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/checkout']; 
  
  // Check if the pathname starts with any protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  console.log("Route info:", { pathname, isProtectedRoute, isAuthRoute, isAuthenticated });
  
  // If user is on an auth page and is already authenticated, redirect to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  // If user is not authenticated and tries to access protected route, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    // Create login URL with the proper base URL
    const loginUrl = new URL("/login", request.url);
    
    // Only add callback URL if it's not redirecting to login itself (to prevent loops)
    // Store the current URL to redirect back after login
    if (!pathname.startsWith('/login')) {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
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