import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/services/productService';
import { ProductFilters, productKeys } from './productApi';

// Debounce function helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Debounced search hook
export function useProductSearch(searchTerm: string, options: Omit<ProductFilters, 'search'> = {}) {
  const [inputValue, setInputValue] = useState(searchTerm);
  const debouncedSearch = useDebounce(inputValue, 500); // 500ms debounce delay
  
  // Update input value when searchTerm prop changes
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);
  
  // Main search query
  const searchQuery = useQuery({
    queryKey: [...productKeys.lists(), { ...options, search: debouncedSearch }],
    queryFn: () => getProducts({ ...options, search: debouncedSearch }),
    enabled: debouncedSearch.length >= 2, // Only search with 2+ characters
  });
  
  return {
    ...searchQuery,
    inputValue,
    setInputValue,
    debouncedSearch,
  };
}

// Hook for autocomplete suggestions
export function useSearchSuggestions(searchTerm: string, limit: number = 5) {
  const debouncedSearch = useDebounce(searchTerm, 300); // Faster debounce for suggestions
  
  return useQuery({
    queryKey: [...productKeys.lists(), { search: debouncedSearch, limit }],
    queryFn: () => getProducts({ search: debouncedSearch, limit }),
    enabled: debouncedSearch.length >= 2, // Only fetch suggestions with 2+ characters
    staleTime: 30 * 1000, // 30 seconds - suggestions change less frequently
  });
} 