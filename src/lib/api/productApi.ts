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
};

// Query keys for consistent caching
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
};

// Hook for fetching products with filters
export function useProducts(filters: ProductFilters = {}) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => getProducts(filters),
    placeholderData: (oldData) => oldData,
  });
}

// Hook for fetching a single product
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id || ''),
    queryFn: () => getProduct(id || ''),
    enabled: !!id, // Only run query if ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes - product details change less frequently
  });
}

// Hook for fetching categories
export function useCategories() {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories rarely change
  });
} 