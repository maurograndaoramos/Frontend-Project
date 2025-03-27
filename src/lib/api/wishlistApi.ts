import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/types/product';
import { toast } from 'sonner';

// Types
export interface WishlistItem {
  id: string;
  product: Product;
}

// Local storage keys (for offline fallback)
const WISHLIST_STORAGE_KEY = 'algarbloom-wishlist';

// API endpoints
const API_ENDPOINTS = {
  WISHLIST: '/api/wishlist',
  WISHLIST_ITEM: (id: string) => `/api/wishlist/${id}`,
};

// Query keys
export const wishlistKeys = {
  all: ['wishlist'] as const,
  items: () => [...wishlistKeys.all, 'items'] as const,
  item: (id: string) => [...wishlistKeys.items(), id] as const,
};

// Helper functions
const getWishlistFromStorage = (): WishlistItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
  if (!storedWishlist) {
    return [];
  }
  
  try {
    return JSON.parse(storedWishlist);
  } catch (error) {
    console.error('Failed to parse wishlist from local storage:', error);
    return [];
  }
};

const saveWishlistToStorage = (wishlist: WishlistItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
};

// React Query hooks
export function useWishlist() {
  const queryClient = useQueryClient();
  
  // Get wishlist data
  const { data: wishlistItems = [] } = useQuery({
    queryKey: wishlistKeys.items(),
    queryFn: async () => {
      try {
        // Try to fetch from API first
        const response = await fetch(API_ENDPOINTS.WISHLIST);
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist');
        }
        return await response.json();
      } catch (error) {
        // Fall back to local storage if API call fails
        console.error('Error fetching wishlist, using local storage:', error);
        return getWishlistFromStorage();
      }
    },
    staleTime: 60 * 1000, // 1 minute - wishlist changes less frequently than cart
  });
  
  // Check if product is in wishlist
  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some((item: any) => 
      (item.productId === productId) || (item.product?.id === productId)
    );
  };
  
  // Add to wishlist
  const addToWishlistMutation = useMutation({
    mutationFn: async (product: Product) => {
      // Optimistically update local storage
      const currentWishlist = getWishlistFromStorage();
      if (!currentWishlist.some(item => item.id === product.id)) {
        const updatedWishlist = [...currentWishlist, { id: product.id, product }];
        saveWishlistToStorage(updatedWishlist);
      }
      
      // Call API
      const response = await fetch(API_ENDPOINTS.WISHLIST_ITEM(product.id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to add to wishlist');
      }
      
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.items() });
    },
    onError: (error) => {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add item to wishlist');
    },
  });
  
  // Remove from wishlist
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      // Optimistically update local storage
      const currentWishlist = getWishlistFromStorage();
      const updatedWishlist = currentWishlist.filter(item => item.id !== productId);
      saveWishlistToStorage(updatedWishlist);
      
      // Call API
      const response = await fetch(API_ENDPOINTS.WISHLIST_ITEM(productId), {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove from wishlist');
      }
      
      return productId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.items() });
    },
    onError: (error) => {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    },
  });
  
  // Clear wishlist
  const clearWishlistMutation = useMutation({
    mutationFn: async () => {
      // Optimistically update local storage
      saveWishlistToStorage([]);
      
      // Call API
      const response = await fetch(API_ENDPOINTS.WISHLIST, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear wishlist');
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.items() });
    },
    onError: (error) => {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    },
  });
  
  return {
    wishlistItems,
    isInWishlist,
    addToWishlist: (product: Product) => addToWishlistMutation.mutateAsync(product),
    removeFromWishlist: (productId: string) => removeFromWishlistMutation.mutateAsync(productId),
    clearWishlist: () => clearWishlistMutation.mutateAsync(),
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending,
    isClearingWishlist: clearWishlistMutation.isPending,
  };
} 