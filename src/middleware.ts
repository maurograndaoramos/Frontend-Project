import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Middleware for handling authentication checks
export async function middleware(request: NextRequest) {
  try {
    // Get the host and origin for debugging
    const host = request.headers.get('host') || 'unknown';
    const origin = request.headers.get('origin') || 'unknown';
    
    console.log(`[Middleware] Request: ${request.method} ${request.url}`);
    console.log(`[Middleware] Host: ${host}, Origin: ${origin}`);
    console.log(`[Middleware] Cookies:`, request.cookies.getAll().map(c => c.name));
    
    // Get token from NextAuth with more explicit options
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });
    
    console.log(`[Middleware] Token present: ${!!token}`);
    if (token) {
      console.log(`[Middleware] Token info: id=${token.id}, email=${token.email}`);
    }
    
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
    
    console.log(`[Middleware] Path: ${pathname}, Protected: ${isProtectedRoute}, AuthRoute: ${isAuthRoute}, Authenticated: ${isAuthenticated}`);
    
    // If user is on an auth page and is already authenticated, redirect to dashboard
    if (isAuthRoute && isAuthenticated) {
      console.log(`[Middleware] Redirecting authenticated user from auth route to dashboard`);
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
        console.log(`[Middleware] Redirecting unauthenticated user to login with callbackUrl=${pathname}`);
      }
      
      return NextResponse.redirect(loginUrl);
    }
    
    console.log(`[Middleware] Allowing request to proceed`);
    return NextResponse.next();
  } catch (error) {
    console.error(`[Middleware] Error:`, error);
    // In case of any errors, we'll allow the request to proceed
    // This prevents the middleware from blocking access if there's an issue
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