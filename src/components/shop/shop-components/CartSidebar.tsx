"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2, Package } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const CartSidebar: React.FC = () => {
  const { cart, toggleCart, removeItem, updateQuantity, clearCart, getCartTotal, getCartCount } = useCart();
  const isEmpty = cart.items.length === 0;

  return (
    <Sheet open={cart.isOpen} onOpenChange={toggleCart}>
      <SheetContent 
        className="flex flex-col p-0 w-full sm:max-w-md"
        aria-description="Shopping cart sidebar containing your selected items and checkout options"
      >
        {/* Fixed Header */}
        <div className="sticky top-0 bg-background z-10 border-b">
          <SheetHeader className="px-6 py-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Your Cart ({getCartCount()})
              </SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 hover:bg-accent"
                onClick={() => toggleCart(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {isEmpty ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center p-6"
              >
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Add items to your cart to see them here
                </p>
                <Button onClick={() => toggleCart(false)} asChild>
                  <Link href="/shop">Browse Products</Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="items"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                {/* Cart Items */}
                <div className="px-6 py-4 space-y-4">
                  {cart.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex space-x-4 group"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="relative h-20 w-20 rounded-md overflow-hidden border"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </motion.div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 rounded-r-none transition-colors hover:bg-accent"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="h-8 px-3 flex items-center justify-center border-y">
                              {item.quantity}
                            </div>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 rounded-l-none transition-colors hover:bg-accent"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Footer */}
        {!isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky bottom-0 bg-background border-t px-6 py-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="font-medium">{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex items-center justify-between font-medium mb-6">
              <span>Total</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
            
            <div className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/checkout" onClick={() => toggleCart(false)}>
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => toggleCart(false)}
                >
                  Continue Shopping
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={clearCart}
                  className="hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;