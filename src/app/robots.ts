import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Protected routes, only for logged in users but crawlers won't access them since they can't login?
      disallow: [
        '/dashboard/',
        '/dashboard/*',
        '/checkout/',
        '/checkout/*',
        '/login',
        '/register',
        '/forgot-password',
      ],
    },
    sitemap: 'https://algarbloom.vercel.app/sitemap.xml',
  }
} 