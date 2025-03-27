"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  Share2,
  Package,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/product";
import { addToViewingHistory } from "@/lib/services/recommendationService";
import ProductRecommendations from "@/components/shop/shop-components/ProductRecommendations";
import RecentlyViewedProducts from "@/components/shop/shop-components/RecentlyViewedProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "sonner";
import { useProduct } from "@/lib/api/productApi";
import { useCart } from "@/lib/api/cartApi";
import { useWishlist } from "@/lib/api/wishlistApi";

export default function ProductDetailContent() {
  const params = useParams();
  const productIdentifier = params?.identifier?.toString() || '';
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Fetch product with related items in a single API call to reduce database load
  const { data: product, isLoading, error } = useProduct(productIdentifier, true);
  
  // Get cart and wishlist hooks
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Check if the product is in the wishlist
  const isWishlisted = product ? isInWishlist(product.id) : false;
  
  // Add to viewing history when product loads
  useEffect(() => {
    if (product) {
      addToViewingHistory(product.id);
    }
  }, [product]);

  // Handle image selection
  const mainImage = product?.images && product.images.length > 0
    ? product.images[selectedImage]
    : '/placeholder.webp';
    
  // Format product price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Add to cart handler
  const addToCart = () => {
    if (!product) return;
    
    addItem(product, quantity);
    
    toast.success(`Added ${product.name} to cart`, {
      description: `${quantity} item${quantity > 1 ? 's' : ''} added`,
      action: {
        label: "View Cart",
        onClick: () => { /* Navigate to cart */ }
      }
    });
  };

  // Toggle wishlist handler
  const toggleWishlist = () => {
    if (!product) return;
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success(`Removed from wishlist`, {
        description: product.name
      });
    } else {
      addToWishlist(product);
      toast.success(`Added to wishlist`, {
        description: product.name
      });
    }
  };

  // Increment/decrement quantity
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // Loading state
  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Skeleton */}
          <div className="space-y-4">
            <Skeleton className="w-full h-[400px] rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="w-full h-20 rounded-md" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-8 w-36" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="flex flex-col sm:flex-row gap-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
            <Skeleton className="h-px w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          Sorry, we couldn't find the product you're looking for.
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="relative rounded-lg overflow-hidden border">
            <Image
              src={mainImage}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-[400px] object-cover"
              priority
            />
            {product.hasDiscount && (
              <Badge className="absolute top-4 left-4 bg-red-500">
                {product.discountPercent ? Math.round(product.discountPercent * 100) : ''}% OFF
              </Badge>
            )}
          </div>
          
          {/* Image thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`rounded-md overflow-hidden border cursor-pointer transition-all duration-200 ${
                    selectedImage === index ? "ring-2 ring-primary" : "hover:opacity-80"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image 
                    src={image}
                    alt={`${product.name} - view ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-20 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{product.category}</Badge>
              {product.inStock ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">In Stock</Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Out of Stock</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>

            <div className="flex items-center mt-4">
              <span className="text-2xl font-bold">
                {formatPrice(product.price)}
              </span>
              {product.hasDiscount && product.originalPrice && (
                <span className="ml-3 text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <Separator />

          {/* Product description (short version) */}
          <p className="text-muted-foreground">
            {product.description.length > 250 
              ? `${product.description.substring(0, 250)}...` 
              : product.description}
          </p>

          {/* Quantity selector */}
          <div className="flex items-center">
            <span className="mr-3 font-medium">Quantity:</span>
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none rounded-l-md h-10 w-10 hover:bg-accent/50"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex items-center justify-center h-10 w-10 border-l border-r">
                {quantity}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none rounded-r-md h-10 w-10 hover:bg-accent/50"
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to cart & wishlist buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1"
              size="lg"
              disabled={!product.inStock}
              onClick={addToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button
              variant={isWishlisted ? "default" : "outline"}
              size="lg"
              onClick={toggleWishlist}
            >
              <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
              {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>

          <Separator />

          {/* Product features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Free shipping on orders over €50</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Satisfaction guaranteed</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">30-day returns policy</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">SKU: {product.id}</span>
            <Button variant="ghost" size="sm">
              <Share2 className="mr-1 h-4 w-4" />
              Share
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Product tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12"
      >
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="care">Care</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div className="prose prose-sm max-w-none">
              <p>{product.description}</p>
              {/* Add more detailed description content here */}
            </div>
          </TabsContent>
          <TabsContent value="care" className="mt-6">
            <div className="prose prose-sm max-w-none">
              <h3>Care Instructions</h3>
              <p>To maintain the quality and longevity of your product:</p>
              <ul>
                <li>Clean with a soft, damp cloth</li>
                <li>Avoid exposure to direct sunlight</li>
                <li>Store in a cool, dry place</li>
                <li>Handle with care to prevent damage</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Related Products - Optimized to use productId only instead of full reload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-12"
      >
        <ProductRecommendations 
          currentProductId={productIdentifier} 
          category={product.category} 
        />
      </motion.div>

      {/* Recently Viewed - Only using local storage, no DB calls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12"
      >
        <RecentlyViewedProducts />
      </motion.div>
    </motion.div>
  );
}