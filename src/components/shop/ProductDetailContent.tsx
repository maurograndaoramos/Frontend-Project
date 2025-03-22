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
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { addToViewingHistory } from "@/lib/services/recommendationService";
import { getProduct } from "@/lib/services/productService";
import ProductRecommendations from "@/components/shop/shop-components/ProductRecommendations";
import RecentlyViewedProducts from "@/components/shop/shop-components/RecentlyViewedProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "sonner";

export default function ProductDetailContent() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const isWishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const productId = params.id as string;
        const productData = await getProduct(productId);
        setProduct(productData);
        
        if (productData) {
          addToViewingHistory(productData.id);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const addToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      await addItem(product, quantity);
      toast.success("Added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleWishlist = () => {
    if (!product) return;
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  // Loading state
  if (loading) {
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

  // Error state or product not found
  if (!product) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-6"
        >
          <Package className="h-16 w-16 text-muted-foreground mx-auto" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          Sorry, we couldn't find the product you're looking for.
        </p>
        <Button asChild>
          <a href="/shop">Back to Shop</a>
        </Button>
      </motion.div>
    );
  }

  // Get main image or fallback
  const mainImage = product.images && product.images.length > 0 
    ? product.images[selectedImage] 
    : "/api/placeholder/600/600";

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
          <div className="relative rounded-lg overflow-hidden border group">
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={mainImage}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-[400px] object-cover"
              />
            </motion.div>
            <AnimatePresence>
              {product.isNew && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute top-4 left-4"
                >
                  <Badge className="bg-primary text-primary-foreground">
                    New
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          </div>
          
          {/* Image thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`rounded-md overflow-hidden border cursor-pointer transition-all duration-200 ${
                    selectedImage === index 
                      ? "ring-2 ring-primary shadow-md" 
                      : "hover:border-primary/50"
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
                </motion.div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Badge variant="secondary" className="transition-colors duration-200 hover:bg-secondary/80">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>

            <div className="flex items-center mt-4">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="ml-3 text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.originalPrice && (
                <Badge variant="secondary" className="ml-3">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              )}
            </div>
          </motion.div>

          <Separator />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-4"
          >
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Stock status */}
            <div className="flex items-center space-x-2">
              <span className="font-medium">Availability:</span>
              <span className={`flex items-center space-x-1 ${
                product.inStock 
                  ? "text-green-600 dark:text-green-400" 
                  : "text-red-600 dark:text-red-400"
              }`}>
                {product.inStock ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>In Stock</span>
                  </>
                ) : (
                  <span>Out of Stock</span>
                )}
              </span>
            </div>

            {/* Quantity selector */}
            {product.inStock && (
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-8 w-8 rounded-r-none hover:bg-accent/50 transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-1 border-x">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    className="h-8 w-8 rounded-l-none hover:bg-accent/50 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={addToCart}
                disabled={!product.inStock || isAddingToCart}
              >
                {isAddingToCart ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </motion.div>
                    <span>Adding to Cart...</span>
                  </motion.div>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={toggleWishlist}
              >
                <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? "fill-current text-red-500" : ""}`} />
                {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            </div>
          </motion.div>

          <Separator />

          {/* Features */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[
              {
                icon: <Truck className="h-5 w-5" />,
                title: "Free Shipping",
                description: "On orders over $200"
              },
              {
                icon: <ShieldCheck className="h-5 w-5" />,
                title: "Secure Payment",
                description: "100% secure checkout"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="text-primary">{feature.icon}</div>
                <div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Product Details Tabs */}
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

      {/* Related Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-12"
      >
        <ProductRecommendations currentProductId={product.id} />
      </motion.div>

      {/* Recently Viewed */}
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