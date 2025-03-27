import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/types/product';

// Types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Local storage keys
const CART_STORAGE_KEY = 'algarbloom-cart';

// Helper functions
const getCartFromStorage = (): CartState => {
  if (typeof window === 'undefined') {
    return { items: [], total: 0, itemCount: 0 };
  }
  
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (!storedCart) {
    return { items: [], total: 0, itemCount: 0 };
  }
  
  try {
    return JSON.parse(storedCart);
  } catch (error) {
    console.error('Failed to parse cart from local storage:', error);
    return { items: [], total: 0, itemCount: 0 };
  }
};

const saveCartToStorage = (cart: CartState) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

// Query keys
export const cartKeys = {
  all: ['cart'] as const,
  items: () => [...cartKeys.all, 'items'] as const,
  item: (id: string) => [...cartKeys.items(), id] as const,
};

// React Query hooks
export function useCart() {
  const queryClient = useQueryClient();
  
  // Get cart data
  const { data: cart = { items: [], total: 0, itemCount: 0 } } = useQuery({
    queryKey: cartKeys.all,
    queryFn: getCartFromStorage,
    staleTime: Infinity, // Cart data doesn't go stale since we manage it locally
  });
  
  // Add item to cart
  const addItemMutation = useMutation({
    mutationFn: async ({ product, quantity }: { product: Product, quantity: number }) => {
      const currentCart = getCartFromStorage();
      const existingItemIndex = currentCart.items.findIndex((item) => item.product.id === product.id);
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // Update existing item
        updatedItems = [...currentCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Add new item
        updatedItems = [...currentCart.items, { id: product.id, product, quantity }];
      }
      
      const newCart = {
        items: updatedItems,
        total: calculateCartTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
      
      saveCartToStorage(newCart);
      return newCart;
    },
    onSuccess: (newCart) => {
      queryClient.setQueryData(cartKeys.all, newCart);
    },
  });
  
  // Update item quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string, quantity: number }) => {
      const currentCart = getCartFromStorage();
      const itemIndex = currentCart.items.findIndex((item) => item.product.id === productId);
      
      if (itemIndex === -1) {
        throw new Error('Item not found in cart');
      }
      
      const updatedItems = [...currentCart.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity,
      };
      
      const newCart = {
        items: updatedItems,
        total: calculateCartTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
      
      saveCartToStorage(newCart);
      return newCart;
    },
    onSuccess: (newCart) => {
      queryClient.setQueryData(cartKeys.all, newCart);
    },
  });
  
  // Remove item from cart
  const removeItemMutation = useMutation({
    mutationFn: async (productId: string) => {
      const currentCart = getCartFromStorage();
      const updatedItems = currentCart.items.filter((item) => item.product.id !== productId);
      
      const newCart = {
        items: updatedItems,
        total: calculateCartTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
      
      saveCartToStorage(newCart);
      return newCart;
    },
    onSuccess: (newCart) => {
      queryClient.setQueryData(cartKeys.all, newCart);
    },
  });
  
  // Clear cart
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const emptyCart = { items: [], total: 0, itemCount: 0 };
      saveCartToStorage(emptyCart);
      return emptyCart;
    },
    onSuccess: (emptyCart) => {
      queryClient.setQueryData(cartKeys.all, emptyCart);
    },
  });
  
  return {
    cart,
    addItem: (product: Product, quantity: number) => addItemMutation.mutateAsync({ product, quantity }),
    updateQuantity: (productId: string, quantity: number) => updateQuantityMutation.mutateAsync({ productId, quantity }),
    removeItem: (productId: string) => removeItemMutation.mutateAsync(productId),
    clearCart: () => clearCartMutation.mutateAsync(),
    isAddingItem: addItemMutation.isPending,
    isUpdatingQuantity: updateQuantityMutation.isPending,
    isRemovingItem: removeItemMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
  };
} 