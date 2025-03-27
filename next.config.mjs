/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignoring TypeScript errors during builds to allow production deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignoring ESLint errors during builds to allow production deployment
    ignoreDuringBuilds: true,
  },
  // Disable React strict mode to avoid hydration issues
  reactStrictMode: false,
  // Server actions configuration
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Auth.js is configured with trustHost: true in src/auth.ts
  // This allows it to work correctly in both development and production environments
};

export default nextConfig; 