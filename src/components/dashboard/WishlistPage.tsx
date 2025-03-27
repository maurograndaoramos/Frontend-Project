"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, ShoppingCart, Trash2, HeartOff, Loader2, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/context/CartContext";

// Type definitions
interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: string;
  originalPrice: string | null;
  image: string;
  inStock: boolean;
  category: string;
  addedDate: string;
  isNew?: boolean;
  hasDiscount?: boolean;
}

export default function WishlistPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const { addItem } = useCart();
  
  // Fetch wishlist items when component mounts
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }
    
    fetchWishlist();
  }, [session, status, router]);
  
  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }
      
      const data = await response.json();
      
      // If data is directly an array, use it as wishlist
      const wishlistData = Array.isArray(data) ? data : data.wishlist;
      
      if (!Array.isArray(wishlistData)) {
        console.error('Invalid wishlist data structure:', data);
        setItems([]);
        setIsLoading(false);
        return;
      }
      
      // Transform the API response to match our WishlistItem interface
      const formattedItems: WishlistItem[] = wishlistData.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        name: item.product?.name || 'Unknown Product',
        price: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'EUR'
        }).format(item.product?.price || 0),
        originalPrice: item.product?.originalPrice 
          ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'EUR'
            }).format(item.product.originalPrice)
          : null,
        image: item.product?.images && item.product.images.length > 0 
          ? item.product.images[0] 
          : '/api/placeholder/400/320',
        inStock: item.product?.inStock ?? false,
        category: item.product?.category || 'Uncategorized',
        addedDate: new Date(item.addedAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }),
        isNew: item.product?.isNew || false,
        hasDiscount: item.product?.hasDiscount || false
      }));
      
      setItems(formattedItems);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error("Could not load wishlist");
      setItems([]);
      setIsLoading(false);
    }
  };
  
  // Filter items based on category
  const filteredItems = categoryFilter === "all" 
    ? items 
    : items.filter(item => item.category.toLowerCase() === categoryFilter.toLowerCase());
  
  // Get unique categories for the filter
  const categories = Array.from(new Set(items.map(item => item.category)));
  
  const removeFromWishlist = async (itemId: string) => {
    setIsRemoving(itemId);
    try {
      const item = items.find(i => i.id === itemId);
      if (!item) return;
      
      const response = await fetch(`/api/wishlist/${item.productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove item');
      }
      
      setItems(items.filter(item => item.id !== itemId));
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error("Failed to remove item");
    } finally {
      setIsRemoving(null);
    }
  };
  
  const addToCart = async (productId: string) => {
    try {
      // Find the product in our wishlist items
      const item = items.find(item => item.productId === productId);
      if (!item) {
        throw new Error('Product not found');
      }
      
      if (!item.inStock) {
        toast.error("This item is out of stock");
        return;
      }
      
      // Get the product details from the API
      const response = await fetch(`/api/products/${productId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      
      const product = await response.json();
      
      // Add the item to cart using CartContext
      addItem(product, 1);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Failed to add item to cart");
    }
  };
  
  const addAllToCart = async () => {
    setIsAddingToCart(true);
    try {
      const inStockItems = filteredItems.filter(item => item.inStock);
      
      if (inStockItems.length === 0) {
        toast.error("No items in stock to add to cart");
        return;
      }
      
      // Fetch all products in parallel
      const productPromises = inStockItems.map(item => 
        fetch(`/api/products/${item.productId}`)
          .then(res => {
            if (!res.ok) throw new Error(`Failed to fetch product ${item.productId}`);
            return res.json();
          })
      );
      
      const products = await Promise.all(productPromises);
      
      // Add all products to cart
      products.forEach(product => {
        addItem(product, 1);
      });
      
      toast.success(`${inStockItems.length} items added to cart`);
    } catch (error) {
      console.error('Error adding items to cart:', error);
      toast.error("Failed to add items to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const clearWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear wishlist');
      }
      
      setItems([]);
      toast.success("Wishlist cleared");
      setShowClearDialog(false);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error("Failed to clear wishlist");
      setShowClearDialog(false);
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto py-8 px-4 space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-6 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Skeleton className="h-10 w-[180px]" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-8 px-4 space-y-8"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            My Wishlist
          </h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
        <Button 
          onClick={() => router.push("/dashboard")}
          variant="outline"
          className="transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
        >
          Back to Dashboard
        </Button>
      </motion.div>

      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Saved Items
              </CardTitle>
              <CardDescription>
                Products you're interested in purchasing
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-[180px] transition-all duration-300 hover:border-primary">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 sm:flex-none transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                  onClick={addAllToCart}
                  disabled={filteredItems.length === 0 || !filteredItems.some(item => item.inStock) || isAddingToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add All to Cart
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 transition-all duration-300 hover:bg-destructive hover:text-destructive-foreground hover:shadow-md"
                  onClick={() => setShowClearDialog(true)}
                  disabled={filteredItems.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {filteredItems.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                >
                  <HeartOff className="h-8 w-8 text-primary" />
                </motion.div>
                <h3 className="text-lg font-medium">Your wishlist is empty</h3>
                <p className="text-muted-foreground text-center mt-2">
                  {categoryFilter === "all" 
                    ? "You haven't added any items to your wishlist yet." 
                    : `You don't have any items in the ${categoryFilter} category.`}
                </p>
                {categoryFilter !== "all" && (
                  <Button 
                    variant="outline" 
                    className="mt-4 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                    onClick={() => setCategoryFilter("all")}
                  >
                    View All Items
                  </Button>
                )}
                <Button 
                  className="mt-4 transition-all duration-300 hover:bg-primary/90 hover:shadow-md"
                  onClick={() => router.push("/shop")}
                >
                  Browse Products
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg">
                      <div className="relative group cursor-pointer" onClick={() => router.push(`/shop/product/${item.productId}`)}>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-t-md">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-2 left-2 flex gap-2">
                            {item.isNew && (
                              <Badge className="bg-primary text-primary-foreground">
                                New
                              </Badge>
                            )}
                            {item.hasDiscount && (
                              <Badge className="bg-red-500/95 text-white">
                                Discount
                              </Badge>
                            )}
                          </div>
                          {!item.inStock && (
                            <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex items-center justify-center">
                              <Badge variant="outline" className="bg-background/80">
                                Out of Stock
                              </Badge>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/50 hover:bg-background/80 transition-all duration-300 hover:bg-destructive hover:text-destructive-foreground hover:shadow-md"
                          onClick={() => removeFromWishlist(item.id)}
                          disabled={isRemoving === item.id}
                        >
                          {isRemoving === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <CardContent className="flex flex-col flex-grow p-4">
                        <div className="mb-2 cursor-pointer" onClick={() => router.push(`/shop/product/${item.productId}`)}>
                          <Badge variant="secondary" className="mb-2 transition-all duration-300">
                            {item.category}
                          </Badge>
                          <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                        </div>
                        <div className="flex items-center mt-1 mb-4">
                          <span className="text-lg font-semibold">{item.price}</span>
                          {item.originalPrice && (
                            <span className="ml-2 text-sm text-muted-foreground line-through">
                              {item.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button 
                          className="w-full transition-all duration-300 hover:bg-primary/90 hover:shadow-md"
                          disabled={!item.inStock}
                          onClick={() => addToCart(item.productId)}
                        >
                          {item.inStock ? (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </>
                          ) : (
                            "Out of Stock"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Wishlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear your wishlist? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={clearWishlist}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear Wishlist
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}