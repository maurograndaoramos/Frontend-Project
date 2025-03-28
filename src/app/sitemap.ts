import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL of your website
  const baseUrl = 'https://algarbloom.vercel.app'
  
  // Define your static routes
  const staticRoutes = [
    '',
    '/products',
    '/about',
    '/contact',
    '/blog',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))
  
  // You can add dynamic routes from your database
  // For example, product pages:
  /*
  const products = await fetchAllProducts()
  const productRoutes = products.map(product => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))
  */
  
  // Combine all routes
  return [
    ...staticRoutes,
    // ...productRoutes,
  ]
} 