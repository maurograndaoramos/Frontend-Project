"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '@/types/product';
import { useToast } from '@/lib/hooks/useToast';

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
}

// Define wishlist actions
type WishlistAction =
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' };

// Define context type
interface WishlistContextType {
  wishlist: WishlistState;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
}

// Create context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Initial state
const initialState: WishlistState = {
  items: [],
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

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        parsedWishlist.items.forEach((item: WishlistItem) => {
          dispatch({ type: 'ADD_ITEM', payload: item });
        });
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Add item to wishlist
  const addToWishlist = (product: Product) => {
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

    dispatch({ type: 'ADD_ITEM', payload: wishlistItem });
    
    toast({
      title: "Added to wishlist",
      description: `${product.name} saved to your wishlist`,
    });
  };

  // Remove item from wishlist
  const removeFromWishlist = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    toast({
      title: "Removed from wishlist",
      description: "Item removed from your wishlist",
    });
  };

  // Clear wishlist
  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist",
    });
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