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

// Sample wishlist data (would come from API in a real app)
const wishlistItems = [
  {
    id: "PROD-001",
    name: "Handcrafted Ceramic Vase",
    price: "$45.99",
    originalPrice: "$59.99",
    image: "/api/placeholder/400/320",
    inStock: true,
    category: "Home Decor",
    addedDate: "March 10, 2025",
  },
  {
    id: "PROD-002",
    name: "Pottery Coffee Mug Set (Set of 4)",
    price: "$35.50",
    originalPrice: null,
    image: "/api/placeholder/400/320",
    inStock: true,
    category: "Kitchenware",
    addedDate: "March 8, 2025",
  },
  {
    id: "PROD-003",
    name: "Glazed Plant Pot - Large",
    price: "$29.99",
    originalPrice: "$39.99",
    image: "/api/placeholder/400/320",
    inStock: false,
    category: "Garden",
    addedDate: "March 5, 2025",
  },
  {
    id: "PROD-004",
    name: "Ceramic Dinner Plates (Set of 6)",
    price: "$85.00",
    originalPrice: null,
    image: "/api/placeholder/400/320",
    inStock: true,
    category: "Kitchenware",
    addedDate: "February 28, 2025",
  },
  {
    id: "PROD-005",
    name: "Handmade Clay Serving Bowl",
    price: "$65.99",
    originalPrice: "$75.99",
    image: "/api/placeholder/400/320",
    inStock: true,
    category: "Kitchenware",
    addedDate: "February 20, 2025",
  },
];

// Type definitions
interface WishlistItem {
  id: string;
  name: string;
  price: string;
  originalPrice: string | null;
  image: string;
  inStock: boolean;
  category: string;
  addedDate: string;
}

export default function WishlistPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [items, setItems] = useState<WishlistItem[]>(wishlistItems);
  const [showClearDialog, setShowClearDialog] = useState(false);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Filter items based on category
  const filteredItems = categoryFilter === "all" 
    ? items 
    : items.filter(item => item.category.toLowerCase() === categoryFilter.toLowerCase());
  
  // Get unique categories for the filter
  const categories = Array.from(new Set(items.map(item => item.category)));
  
  const removeFromWishlist = async (itemId: string) => {
    setIsRemoving(itemId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setItems(items.filter(item => item.id !== itemId));
      toast.success("Item removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setIsRemoving(null);
    }
  };
  
  const addAllToCart = async () => {
    setIsAddingToCart(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      const inStockItems = filteredItems.filter(item => item.inStock);
      toast.success(`${inStockItems.length} items added to cart`);
    } catch (error) {
      toast.error("Failed to add items to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const clearWishlist = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setItems([]);
      toast.success("Wishlist cleared");
      setShowClearDialog(false);
    } catch (error) {
      toast.error("Failed to clear wishlist");
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
                      <div className="relative group">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={400}
                          height={320}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {!item.inStock && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-background/80 flex items-center justify-center"
                          >
                            <Badge variant="outline" className="bg-background/80">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Out of Stock
                            </Badge>
                          </motion.div>
                        )}
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
                        <div className="mb-2">
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