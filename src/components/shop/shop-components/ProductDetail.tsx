"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/product";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { addToViewingHistory } from "@/lib/services/recommendationService";
import ProductRecommendations from "@/components/shop/shop-components/ProductRecommendations";
import RecentlyViewedProducts from "@/components/shop/shop-components/RecentlyViewedProducts";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  useEffect(() => {
    // Add to viewing history when component mounts
    addToViewingHistory(product.id);
  }, [product.id]);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const addToCart = () => {
    addItem(product, quantity);
  };

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Get main image or fallback
  const mainImage = product.images && product.images.length > 0 
    ? product.images[selectedImage] 
    : "/api/placeholder/600/600";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border">
            <Image
              src={mainImage}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-[400px] object-cover"
            />
            {product.isNew && <Badge className="absolute top-4 left-4">New</Badge>}
          </div>
          
          {/* Image thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`rounded-md overflow-hidden border cursor-pointer ${
                    selectedImage === index ? "ring-2 ring-primary" : ""
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
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary">{product.category}</Badge>
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>

            <div className="flex items-center mt-4">
              <span className="text-2xl font-bold">€{product.price.toFixed(2)}</span>
              {product.hasDiscount && product.originalPrice && (
                <span className="ml-3 text-lg text-muted-foreground line-through">
                  €{product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.hasDiscount && product.originalPrice && (
                <Badge variant="secondary" className="ml-3">
                  Save €{(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <p className="text-muted-foreground">{product.description}</p>

            {/* Stock status */}
            <div className="flex items-center space-x-2">
              <span className="font-medium">Availability:</span>
              <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity selector */}
            {product.inStock && (
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-8 w-8 rounded-r-none"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <div className="h-8 px-4 flex items-center justify-center border-y">
                    {quantity}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    className="h-8 w-8 rounded-l-none"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Action buttons */}
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
        </div>
      </div>

      {/* Product details tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="p-4 border rounded-b-lg">
            <p>
              {product.description}
            </p>
            {product.care && product.care.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Care Instructions:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {product.care.map((instruction, index) => (
                    <li key={index} className="text-muted-foreground">{instruction}</li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>
          <TabsContent value="specifications" className="p-4 border rounded-b-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.dimensions && (
                <div>
                  <h3 className="font-medium">Dimensions</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.dimensions.height && `H: ${product.dimensions.height}${product.dimensions.unit} `}
                    {product.dimensions.width && `W: ${product.dimensions.width}${product.dimensions.unit} `}
                    {product.dimensions.depth && `D: ${product.dimensions.depth}${product.dimensions.unit}`}
                  </p>
                </div>
              )}
              {product.weight && (
                <div>
                  <h3 className="font-medium">Weight</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.weight.value} {product.weight.unit}
                  </p>
                </div>
              )}
              {product.material && (
                <div>
                  <h3 className="font-medium">Materials</h3>
                  <p className="text-sm text-muted-foreground">{product.material}</p>
                </div>
              )}
              <div>
                <h3 className="font-medium">Category</h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>
              {product.subcategory && (
                <div>
                  <h3 className="font-medium">Subcategory</h3>
                  <p className="text-sm text-muted-foreground">{product.subcategory}</p>
                </div>
              )}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product recommendations */}
      <ProductRecommendations 
        currentProductId={product.id} 
        category={product.category} 
      />
      
      {/* Recently viewed products */}
      <RecentlyViewedProducts 
        maxItems={4}
        excludeProductId={product.id}
        title="Recently Viewed Items"
      />
    </div>
  );
}