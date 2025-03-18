import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  
  // Get the pathname of the request
  const { pathname } = request.nextUrl;
  
  // Authentication routes that should redirect to dashboard if already logged in
  const authRoutes = ['/login', '/register', '/forgot-password'];
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/checkout', '/account'];
  
  // Check if the pathname starts with any protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // If user is on an auth page and is already authenticated, redirect to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  // If user is not authenticated and tries to access protected route, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    // Store the current URL to redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all auth routes
    '/login',
    '/register',
    '/forgot-password',
    // Match all protected routes
    '/dashboard/:path*',
    '/checkout/:path*',
    '/account/:path*',
  ],
};