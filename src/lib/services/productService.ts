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
  
  try {
    console.log(`Fetching products with params: ${queryParams.toString()}`);
    const response = await fetch(`/api/products?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('API error:', responseData);
      throw new Error(responseData.error || `API returned status ${response.status}`);
    }
    
    return {
      data: responseData.products || [],
      pagination: responseData.pagination || {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0,
      },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
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

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch product');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
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