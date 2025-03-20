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

interface ProductCardProps {
  product: Product;
  view: "grid" | "list";
}

export default function ProductCard({ product, view }: ProductCardProps) {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail
    e.stopPropagation(); // Prevent event bubbling
    addItem(product, 1); // Add 1 quantity by default from listing page
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isWishlisted = isInWishlist(product.id);

  if (view === "grid") {
    return (
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative">
          <Link href={`/shop/product/${product.id}`}>
            <Image
              src={product.images && product.images.length > 0 ? product.images[0] : "/api/placeholder/400/500"}
              alt={product.name}
              width={400}
              height={500}
              className="w-full h-64 object-cover"
            />
          </Link>
          {product.isNew && <Badge className="absolute top-3 left-3">New</Badge>}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="outline" className="bg-background/80">
                Out of Stock
              </Badge>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 h-8 w-8 rounded-full ${
              isWishlisted 
                ? "bg-primary text-primary-foreground hover:bg-primary/80" 
                : "bg-background/50 hover:bg-background/80"
            }`}
            onClick={toggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </Button>
        </div>
        <CardContent className="flex flex-col flex-grow p-4">
          <div className="mb-2">
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <Link href={`/shop/product/${product.id}`} className="hover:underline">
              <h3 className="font-semibold line-clamp-2">{product.name}</h3>
            </Link>
          </div>
          <div className="flex items-center mt-1 mb-auto">
            <span className="font-medium">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <Button
            className="w-full mt-4"
            disabled={!product.inStock}
            onClick={addToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // List view
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-48">
          <Link href={`/shop/product/${product.id}`}>
            <Image
              src={product.images && product.images.length > 0 ? product.images[0] : "/api/placeholder/400/500"}
              alt={product.name}
              width={400}
              height={500}
              className="w-full h-48 sm:h-full object-cover"
            />
          </Link>
          {product.isNew && <Badge className="absolute top-3 left-3">New</Badge>}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="outline" className="bg-background/80">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="flex-1 p-4">
          <div className="flex flex-col h-full justify-between">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <Link href={`/shop/product/${product.id}`} className="hover:underline">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {product.description}
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div>
                <span className="font-medium text-lg">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="ml-2 text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={isWishlisted ? "default" : "outline"}
                  size="icon"
                  onClick={toggleWishlist}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>
                <Button disabled={!product.inStock} onClick={addToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}