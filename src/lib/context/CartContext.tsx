"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '@/types/product';
import { useToast } from '@/lib/hooks/useToast';
import { useSession } from 'next-auth/react';

// Define cart item type (product with quantity)
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Define cart state
interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// Define cart actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART'; payload?: boolean }
  | { type: 'SET_ITEMS'; payload: CartItem[] };

// Define context type
interface CartContextType {
  cart: CartState;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (isOpen?: boolean) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Initial state
const initialState: CartState = {
  items: [],
  isOpen: false,
};

// Reducer function
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: updatedItems };
      } else {
        // New item, add to cart
        return { ...state, items: [...state.items, action.payload] };
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: action.payload !== undefined ? action.payload : !state.isOpen };
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

// Create provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const { toast } = useToast();
  const { data: session, status } = useSession();

  // Get current user ID or generate a temporary one for anonymous users
  const getUserKey = () => {
    if (session?.user?.id) {
      return `cart_${session.user.id}`;
    }
    
    // For anonymous users, create a temporary ID if needed
    let anonymousId = localStorage.getItem('anonymous_cart_id');
    if (!anonymousId) {
      anonymousId = `anonymous_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('anonymous_cart_id', anonymousId);
    }
    return `cart_${anonymousId}`;
  };

  // Load cart from localStorage on mount or when user session changes
  useEffect(() => {
    // Clear cart state first to avoid mixing data
    dispatch({ type: 'CLEAR_CART' });
    
    const userKey = getUserKey();
    const savedCart = localStorage.getItem(userKey);
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items && Array.isArray(parsedCart.items)) {
          dispatch({ type: 'SET_ITEMS', payload: parsedCart.items });
        }
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, [session?.user?.id, status]);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (cart.items.length > 0) {
      const userKey = getUserKey();
      localStorage.setItem(userKey, JSON.stringify({ items: cart.items }));
    }
  }, [cart.items, session?.user?.id]);

  // Add item to cart
  const addItem = (product: Product, quantity: number) => {
    if (!product.inStock) {
      toast({
        title: "Item unavailable",
        description: "This item is currently out of stock",
        variant: "destructive",
      });
      return;
    }

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 
        ? product.images[0] 
        : '/api/placeholder/100/100',
      quantity,
    };

    dispatch({ type: 'ADD_ITEM', payload: cartItem });
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
    
    // Don't automatically open cart sidebar when adding items
    // Removed: dispatch({ type: 'TOGGLE_CART', payload: true });
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    toast({
      title: "Removed from cart",
      description: "Item removed from your cart",
    });
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    
    // Also clear from localStorage
    const userKey = getUserKey();
    localStorage.removeItem(userKey);
    
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  // Toggle cart sidebar
  const toggleCart = (isOpen?: boolean) => {
    dispatch({ type: 'TOGGLE_CART', payload: isOpen });
  };

  // Calculate cart total
  const getCartTotal = () => {
    return cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Calculate cart item count
  const getCartCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};