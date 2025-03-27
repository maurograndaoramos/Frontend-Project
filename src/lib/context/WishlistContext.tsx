"use client";

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { useToast } from '@/lib/hooks/useToast';
import { useSession } from 'next-auth/react';

// Define wishlist item type
export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  category: string;
  addedDate: string;
}

// Define wishlist state
interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
}

// Define wishlist actions
type WishlistAction =
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'SET_WISHLIST'; payload: WishlistItem[] }
  | { type: 'SET_LOADING'; payload: boolean };

// Define context type
interface WishlistContextType {
  wishlist: WishlistState;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (id: string) => boolean;
}

// Create context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Initial state
const initialState: WishlistState = {
  items: [],
  isLoading: false,
};

// Reducer function
function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Check if item already exists
      if (state.items.some(item => item.id === action.payload.id)) {
        return state; // Item already exists
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case 'CLEAR_WISHLIST':
      return { ...state, items: [] };
    case 'SET_WISHLIST':
      return { ...state, items: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

// Create provider component
export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlist, dispatch] = useReducer(wishlistReducer, initialState);
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [isInitialized, setIsInitialized] = useState(false);

  // Load wishlist from API and fallback to localStorage on mount
  useEffect(() => {
    async function loadWishlist() {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // First load from localStorage as a fast initial state
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          dispatch({ type: 'SET_WISHLIST', payload: parsedWishlist.items || [] });
        } catch (error) {
          console.error('Failed to parse wishlist from localStorage:', error);
        }
      }
      
      // Then, if user is authenticated, fetch from API
      if (status === 'authenticated' && session?.user) {
        try {
          const response = await fetch('/api/wishlist');
          
          if (response.ok) {
            const data = await response.json();
            
            // Transform API data to match our WishlistItem format
            const apiItems: WishlistItem[] = data.map((item: any) => ({
              id: item.productId,
              name: item.product.name,
              price: item.product.price,
              originalPrice: item.product.originalPrice,
              image: item.product.images && item.product.images.length > 0 
                ? item.product.images[0] 
                : '/api/placeholder/100/100',
              inStock: item.product.inStock,
              category: item.product.category,
              addedDate: new Date(item.addedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
            }));
            
            dispatch({ type: 'SET_WISHLIST', payload: apiItems });
            
            // Update localStorage with latest data
            localStorage.setItem('wishlist', JSON.stringify({ items: apiItems }));
          } else {
            console.error('Failed to fetch wishlist from API');
          }
        } catch (error) {
          console.error('Error fetching wishlist from API:', error);
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
      
      setIsInitialized(true);
    }
    
    loadWishlist();
  }, [status, session]);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist.items, isInitialized]);

  // Add item to wishlist
  const addToWishlist = async (product: Product) => {
    // Create wishlist item for local state
    const wishlistItem: WishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images && product.images.length > 0 
        ? product.images[0] 
        : '/api/placeholder/100/100',
      inStock: product.inStock,
      category: product.category,
      addedDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    // Update local state immediately for responsive UI
    dispatch({ type: 'ADD_ITEM', payload: wishlistItem });
    
    // Show toast
    toast({
      title: "Added to wishlist",
      description: `${product.name} saved to your wishlist`,
    });
    
    // If user is authenticated, sync with database
    if (status === 'authenticated' && session?.user) {
      try {
        const response = await fetch(`/api/wishlist/${product.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          console.error('Failed to add item to wishlist in database');
          // Optionally revert local state on error
          // dispatch({ type: 'REMOVE_ITEM', payload: product.id });
        }
      } catch (error) {
        console.error('Error adding item to wishlist:', error);
      }
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (id: string) => {
    // Update local state immediately
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    
    // Show toast
    toast({
      title: "Removed from wishlist",
      description: "Item removed from your wishlist",
    });
    
    // If user is authenticated, sync with database
    if (status === 'authenticated' && session?.user) {
      try {
        const response = await fetch(`/api/wishlist/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          console.error('Failed to remove item from wishlist in database');
        }
      } catch (error) {
        console.error('Error removing item from wishlist:', error);
      }
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    // Update local state immediately
    dispatch({ type: 'CLEAR_WISHLIST' });
    
    // Show toast
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist",
    });
    
    // If user is authenticated, sync with database
    if (status === 'authenticated' && session?.user) {
      try {
        const response = await fetch('/api/wishlist', {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          console.error('Failed to clear wishlist in database');
        }
      } catch (error) {
        console.error('Error clearing wishlist:', error);
      }
    }
  };

  // Check if an item is in the wishlist
  const isInWishlist = (id: string) => {
    return wishlist.items.some(item => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};