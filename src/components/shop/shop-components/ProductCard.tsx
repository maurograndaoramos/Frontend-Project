"use client";

import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCardProps {
  product: Product;
  view: "grid" | "list";
}

export default function ProductCard({ product, view }: ProductCardProps) {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Parse image data - handle both string and array formats
  let imageArray: string[] = [];
  
  if (product.images) {
    // Cast to any first to avoid TypeScript errors
    const imageData = product.images as any;
    
    if (typeof imageData === 'string') {
      // Handle comma-separated string
      imageArray = imageData.split(',');
    } else if (Array.isArray(imageData)) {
      // Already an array
      imageArray = imageData;
    }
  }

  // Get the first image for display or use a default
  const primaryImage = imageArray.length > 0 
    ? imageArray[0].trim() // Trim whitespace from path
    : "/images/products/default-product.jpg";

  console.log(`Product: ${product.name}, Primary image:`, primaryImage);

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      console.error("Error toggling wishlist item:", error);
    }
  };

  const isWishlisted = isInWishlist(product.id);

  if (view === "grid") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -4 }}
      >
        <Card className="overflow-hidden h-full flex flex-col group hover:shadow-xl transition-all duration-500 ease-in-out border-border/50">
          <div className="relative">
            <Link href={`/shop/product/${product.id}`} className="block">
              <div className="relative aspect-[4/5] overflow-hidden bg-muted/50">
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>
            </Link>
            <AnimatePresence>
              <div className="absolute top-3 left-3 flex gap-2">
                {product.isNew && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge className="bg-primary/95 backdrop-blur-sm shadow-sm">
                      New
                    </Badge>
                  </motion.div>
                )}
                {product.hasDiscount && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge className="bg-red-500/95 text-white backdrop-blur-sm shadow-sm">
                      Discount
                    </Badge>
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
          </div>
          <CardContent className="flex flex-col flex-grow p-4 space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="bg-accent/40 hover:bg-accent/60 transition-colors duration-300">
                  {product.category}
                </Badge>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-full transition-all duration-300 ease-out",
                      isWishlisted 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "hover:bg-accent/40"
                    )}
                    onClick={toggleWishlist}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={cn("h-4 w-4 transition-all duration-300", isWishlisted && "fill-current")} />
                  </Button>
                </motion.div>
              </div>
              <Link 
                href={`/shop/product/${product.id}`} 
                className="block group-hover:text-primary transition-colors duration-300"
              >
                <h3 className="font-medium line-clamp-2">{product.name}</h3>
              </Link>
            </div>
            <div className="flex items-center mt-auto">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{formatPrice(product.price)}</span>
                {product.hasDiscount && product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className={cn(
                  "w-full transition-all duration-300 ease-out",
                  product.inStock 
                    ? "bg-primary hover:bg-primary/90 hover:shadow-md" 
                    : "bg-muted hover:bg-muted/80 cursor-not-allowed"
                )}
                disabled={!product.inStock}
                onClick={addToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // List view
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ x: 4 }}
    >
      <Card className="overflow-hidden group hover:shadow-xl transition-all duration-500 ease-in-out border-border/50">
        <div className="flex flex-col sm:flex-row">
          <div className="relative sm:w-48">
            <Link href={`/shop/product/${product.id}`} className="block">
              <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-muted/50">
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>
            </Link>
            <AnimatePresence>
              <div className="absolute top-3 left-3 flex gap-2">
                {product.isNew && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge className="bg-primary/95 backdrop-blur-sm shadow-sm">
                      New
                    </Badge>
                  </motion.div>
                )}
                {product.hasDiscount && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge className="bg-red-500/95 text-white backdrop-blur-sm shadow-sm">
                      Discount
                    </Badge>
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
            <AnimatePresence>
              {!product.inStock && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-background/90 backdrop-blur-[2px] flex items-center justify-center"
                >
                  <Badge variant="outline" className="bg-background/95 shadow-sm">
                    Out of Stock
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <CardContent className="flex-1 p-6">
            <div className="flex flex-col h-full justify-between space-y-4">
              <div className="space-y-3">
                <Badge variant="secondary" className="bg-accent/40 hover:bg-accent/60 transition-colors duration-300">
                  {product.category}
                </Badge>
                <Link 
                  href={`/shop/product/${product.id}`} 
                  className="block group-hover:text-primary transition-colors duration-300"
                >
                  <h3 className="font-medium text-lg">{product.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">{formatPrice(product.price)}</span>
                  {product.hasDiscount && product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={isWishlisted ? "default" : "outline"}
                      size="icon"
                      onClick={toggleWishlist}
                      className={cn(
                        "transition-all duration-300 ease-out",
                        isWishlisted 
                          ? "bg-primary hover:bg-primary/90" 
                          : "hover:bg-accent/50"
                      )}
                      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={cn("h-4 w-4 transition-all duration-300", isWishlisted && "fill-current")} />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      disabled={!product.inStock} 
                      onClick={addToCart}
                      className={cn(
                        "transition-all duration-300 ease-out",
                        product.inStock 
                          ? "bg-primary hover:bg-primary/90 hover:shadow-md" 
                          : "bg-muted hover:bg-muted/80 cursor-not-allowed"
                      )}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}