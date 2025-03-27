import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/types/product';
import { getProduct, getProducts, getCategories } from '@/lib/services/productService';

// Types
export type ProductFilters = {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
  inStock?: boolean;
  ids?: string[];
  isRecentlyViewed?: boolean;
  isRecommended?: boolean;
  includeRelated?: boolean;
  includeFullData?: boolean;
};

// Query keys for consistent caching
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string, includeRelated = false) => 
    [...productKeys.details(), id, { includeRelated }] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
};

// Hook for fetching products with filters
export function useProducts(filters: ProductFilters = {}) {
  const queryClient = useQueryClient();
  
  // Initialize error logger
  const logError = (error: any) => {
    console.error('Error in useProducts hook:', error);
  };
  
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => {
      return getProducts({
        ...filters,
        // Only include related data if specifically requested
        includeRelated: filters.includeRelated || false,
        // For lists, we prefer smaller payload unless full data is requested
        includeFullData: filters.includeFullData || false,
      }).catch(err => {
        logError(err);
        throw err;
      });
    },
    placeholderData: (oldData) => oldData,
    // Increase stale time for connection issues
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Add error handling with specific retry logic
    retry: (failureCount, error: any) => {
      if (failureCount >= 3) return false;
      
      // Special handling for database connection errors
      if (
        error?.message?.includes('concurrent connections limit exceeded') ||
        error?.details?.includes('concurrent connections limit exceeded')
      ) {
        console.log(`Retrying product fetch due to connection issue (attempt ${failureCount})`);
        return true;
      }
      
      return failureCount < 1;
    },
    // Add exponential backoff for retries
    retryDelay: (attemptIndex) => {
      return Math.min(1000 * 2 ** attemptIndex + Math.random() * 1000, 30000);
    }
  });
}

// Hook for fetching single product with optional related products
export function useProduct(id: string | undefined, includeRelated = false) {
  // Handle the case where id might be undefined
  const enabled = !!id;
  
  return useQuery({
    queryKey: enabled ? productKeys.detail(id as string, includeRelated) : ['products', 'detail', 'invalid'],
    queryFn: () => getProduct(id as string, includeRelated),
    enabled: enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching categories
export function useCategories() {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes - categories change less frequently
  });
} 