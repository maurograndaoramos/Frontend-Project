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
    
    try {
      console.log(`Fetching products with params: ${queryParams.toString()}`);
      const response = await fetch(`/api/products?${queryParams.toString()}`);
      
      if (!response.ok) {
        // Log the error response
        const errorText = await response.text();
        console.error(`API returned ${response.status}: ${errorText}`);
        throw new Error(`API error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`Received ${data.products?.length || 0} products`);
      
      return {
        data: data.products || [],
        pagination: data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          pages: 0,
        },
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return empty data instead of throwing
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
      throw new Error('Failed to fetch product');
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
      throw new Error('Failed to fetch categories');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}