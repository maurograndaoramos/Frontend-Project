// src/lib/services/productService.ts
import { Product } from "@/types/product";

type ProductFilters = {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
  inStock?: boolean;
  ids?: string[];
  includeRelated?: boolean;
  includeFullData?: boolean;
};

type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

// Cache management
const productCache = new Map<string, { data: PaginatedResponse<Product>, timestamp: number }>();
const productDetailCache = new Map<string, { data: Product, timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const DETAIL_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
  const queryParams = new URLSearchParams();
  
  // Add filters to query params
  if (filters.category) queryParams.set('category', filters.category);
  if (filters.search) queryParams.set('search', filters.search);
  if (filters.minPrice) queryParams.set('minPrice', filters.minPrice.toString());
  if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice.toString());
  if (filters.sort) queryParams.set('sort', filters.sort);
  if (filters.page) queryParams.set('page', filters.page.toString());
  if (filters.limit) queryParams.set('limit', filters.limit.toString());
  if (filters.inStock) queryParams.set('inStock', 'true');
  if (filters.includeRelated) queryParams.set('includeRelated', 'true');
  if (filters.includeFullData) queryParams.set('includeFullData', 'true');
  if (filters.ids && filters.ids.length > 0) queryParams.set('ids', filters.ids.join(','));
  
  const cacheKey = queryParams.toString();
  const now = Date.now();
  
  // Check cache first
  const cachedData = productCache.get(cacheKey);
  if (cachedData && (now - cachedData.timestamp < CACHE_TTL)) {
    console.log(`Using cached products for params: ${cacheKey}`);
    return cachedData.data;
  }
  
  try {
    console.log(`Fetching products with params: ${queryParams.toString()}`);
    const response = await fetch(`/api/products?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('API error:', responseData);
      
      // Check for Prisma connection errors
      if (responseData?.details?.includes('concurrent connections limit exceeded')) {
        console.log('Database connection limit exceeded, using cached data if available');
        if (cachedData) {
          return cachedData.data;
        }
      }
      
      throw new Error(responseData.error || `API returned status ${response.status}`);
    }
    
    // Handle both old and new response formats
    let result: PaginatedResponse<Product>;
    
    if (responseData.data) {
      // New response format
      result = {
        data: responseData.data,
        pagination: responseData.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          pages: 0,
        },
      };
    } else if (responseData.products) {
      // Old response format
      result = {
        data: responseData.products,
        pagination: responseData.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          pages: 0,
        },
      };
    } else {
      // Fallback for unexpected format
      console.error('Unexpected API response format:', responseData);
      result = {
        data: Array.isArray(responseData) ? responseData : [],
        pagination: {
          total: Array.isArray(responseData) ? responseData.length : 0,
          page: 1,
          limit: 10,
          pages: 1,
        },
      };
    }
    
    // Store in cache
    productCache.set(cacheKey, { data: result, timestamp: now });
    
    return result;
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Try to return cached data even if it's expired
    if (cachedData) {
      console.log('Returning stale cached data due to error');
      return cachedData.data;
    }
    
    // Return empty data on error
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0,
      },
    };
  }
}

export async function getProduct(identifier: string, includeRelated = false): Promise<Product | null> {
  // Build query params
  const queryParams = new URLSearchParams();
  if (includeRelated) {
    queryParams.set('includeRelated', 'true');
    queryParams.set('similarCount', '4');
  }
  
  // Create cache key
  const cacheKey = `${identifier}-${includeRelated}`;
  const now = Date.now();
  
  // Check cache first
  const cachedProduct = productDetailCache.get(cacheKey);
  if (cachedProduct && (now - cachedProduct.timestamp < DETAIL_CACHE_TTL)) {
    console.log(`Using cached product for identifier: ${identifier}`);
    return cachedProduct.data;
  }
  
  try {
    console.log(`Attempting to fetch product with identifier: ${identifier}`, { includeRelated });
    const url = includeRelated
      ? `/api/products/${identifier}?${queryParams.toString()}`
      : `/api/products/${identifier}`;
      
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Failed to fetch product ${identifier}, status: ${response.status}`);
      
      // Check for Prisma connection errors and return cached data if available
      if (errorData?.details?.includes('concurrent connections limit exceeded') && cachedProduct) {
        console.log('Using cached product data due to connection limits');
        return cachedProduct.data;
      }
      
      return null; // Return null instead of throwing to prevent unhandled rejections
    }
    
    const product = await response.json();
    
    // Store in cache
    productDetailCache.set(cacheKey, { data: product, timestamp: now });
    
    return product;
  } catch (error) {
    console.error(`Error fetching product with identifier ${identifier}:`, error);
    
    // Try to return cached data even if it's expired
    if (cachedProduct) {
      console.log('Returning stale cached data due to error');
      return cachedProduct.data;
    }
    
    return null;
  }
}

export async function getCategories() {
  try {
    const response = await fetch('/api/categories');
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch categories');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}