/**
 * Vercel Deployment Info for Next.js with Prisma
 * 
 * This project uses the following deployment strategy:
 * 
 * 1. Prisma Setup:
 *    - schema.prisma file defines the database structure
 *    - postinstall script ensures prisma generate runs after npm install
 *    - vercel-build.js explicitly runs prisma generate before the Next.js build
 * 
 * 2. Auth Configuration:
 *    - trustHost is set to true in src/auth.ts
 *    - this allows NextAuth to work in both development and production
 * 
 * 3. Build Optimization:
 *    - output: 'standalone' in next.config.mjs for better Vercel compatibility
 *    - NODE_OPTIONS="--max-old-space-size=4096" increases memory for build
 *    - TypeScript and ESLint errors are ignored during builds
 * 
 * 4. Client Components:
 *    - Shop and Search pages use static versions for production builds
 *    - Dynamic client components for development
 * 
 * Debug Steps for Common Issues:
 * 1. Prisma errors: Check if prisma generate runs before the build
 * 2. Auth errors: Verify NEXTAUTH_URL and NEXTAUTH_SECRET are set
 * 3. Database errors: Confirm DATABASE_URL is correctly configured
 * 4. Build timeout: Check for memory usage and optimize large components
 */

// This file is for documentation purposes only and is not executed
console.log('See this file for deployment information'); 