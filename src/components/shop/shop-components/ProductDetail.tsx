// src/components/shop/ProductDetail.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  StarHalf, 
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

interface ProductDetailProps {
  product: Product;
  relatedProducts?: Product[];
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const addToCart = () => {
    console.log(`Adding ${quantity} of ${product.name} to cart`);
    // This will be connected to your cart state management
  };

  const addToWishlist = () => {
    console.log(`Adding ${product.name} to wishlist`);
    // This will be connected to your wishlist state management
  };

  // Function to render rating stars
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`star-${i}`} className="w-4 h-4 fill-primary text-primary" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-primary text-primary" />}
        <span className="ml-2 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border">
            <Image
              src={product.image}
              alt={product.name}
              width={600}
              height={600}
              className="w-full object-cover"
            />
            {product.isNew && <Badge className="absolute top-4 left-4">New</Badge>}
          </div>
          {/* Additional image thumbnails would go here */}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary">{product.category}</Badge>
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
            
            <div className="flex items-center mt-2">
              {product.rating && renderRating(product.rating)}
            </div>
            
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
          </div>

          <Separator />

          <div className="space-y-4">
            <p className="text-muted-foreground">{product.description}</p>
            
            {/* Quantity selector */}
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
                variant="outline" 
                size="lg" 
                onClick={addToWishlist}
              >
                <Heart className="mr-2 h-5 w-5" />
                Add to Wishlist
              </Button>
            </div>
          </div>

          <Separator />

          {/* Product features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">2-year warranty included</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">30-day returns policy</span>
            </div>
          </div>

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="p-4 border rounded-b-lg">
            <p>
              Detailed description of the product would go here. This would include
              information about materials, craftsmanship, and any special features.
            </p>
          </TabsContent>
          <TabsContent value="specifications" className="p-4 border rounded-b-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Dimensions</h3>
                <p className="text-sm text-muted-foreground">H: 10in x W: 5in x D: 5in</p>
              </div>
              <div>
                <h3 className="font-medium">Materials</h3>
                <p className="text-sm text-muted-foreground">Hand-thrown ceramic, glazed finish</p>
              </div>
              <div>
                <h3 className="font-medium">Weight</h3>
                <p className="text-sm text-muted-foreground">2.5 lbs</p>
              </div>
              <div>
                <h3 className="font-medium">Care</h3>
                <p className="text-sm text-muted-foreground">Hand wash only, not microwave safe</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-4 border rounded-b-lg">
            <p>Customer reviews would be displayed here.</p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related products would go here */}
    </div>
  );
}