"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid, Heart, List, ShoppingCart } from "lucide-react";

// Mock product data
const products = [
  {
    id: "1",
    name: "Handcrafted Ceramic Vase",
    price: 45.99,
    originalPrice: 59.99,
    image: "/api/placeholder/400/500",
    inStock: true,
    category: "Home Decor",
    isNew: true,
    rating: 4.5,
  },
  {
    id: "2",
    name: "Pottery Coffee Mug Set (Set of 4)",
    price: 35.50,
    originalPrice: null,
    image: "/api/placeholder/400/500",
    inStock: true,
    category: "Kitchenware",
    isNew: false,
    rating: 4.8,
  },
  {
    id: "3",
    name: "Glazed Plant Pot - Large",
    price: 29.99,
    originalPrice: 39.99,
    image: "/api/placeholder/400/500",
    inStock: false,
    category: "Garden",
    isNew: false,
    rating: 4.2,
  },
  {
    id: "4",
    name: "Ceramic Dinner Plates (Set of 6)",
    price: 85.00,
    originalPrice: null,
    image: "/api/placeholder/400/500",
    inStock: true,
    category: "Kitchenware",
    isNew: true,
    rating: 4.9,
  },
  {
    id: "5",
    name: "Handmade Clay Serving Bowl",
    price: 65.99,
    originalPrice: 75.99,
    image: "/api/placeholder/400/500",
    inStock: true,
    category: "Kitchenware",
    isNew: false,
    rating: 4.7,
  },
  {
    id: "6",
    name: "Decorative Wall Plate Set",
    price: 120.00,
    originalPrice: 150.00,
    image: "/api/placeholder/400/500",
    inStock: true,
    category: "Home Decor",
    isNew: true,
    rating: 4.6,
  },
];

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState("featured");

  // Sort products based on selected option
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return a.isNew ? -1 : b.isNew ? 1 : 0;
      case "rating":
        return b.rating - a.rating;
      case "featured":
      default:
        return 0;
    }
  });

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Shop All Products</h1>
        <p className="text-muted-foreground mt-2">
          Browse our collection of handcrafted pottery and ceramic goods
        </p>
      </div>

      {/* Sort and view controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{products.length}</span> products
        </p>

        <div className="flex items-center gap-4">
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none rounded-l-md ${viewMode === "grid" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none rounded-r-md ${viewMode === "list" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden h-full flex flex-col">
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={500}
                  className="w-full h-64 object-cover"
                />
                {product.isNew && (
                  <Badge className="absolute top-3 left-3">New</Badge>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Badge variant="outline" className="bg-background/80">Out of Stock</Badge>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/50 hover:bg-background/80"
                  aria-label="Add to wishlist"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="flex flex-col flex-grow p-4">
                <div className="mb-2">
                  <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                  <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                </div>
                <div className="flex items-center mt-1 mb-auto">
                  <span className="font-medium">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="ml-2 text-sm text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <Button
                  className="w-full mt-4"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="relative sm:w-48">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={500}
                    className="w-full h-48 sm:h-full object-cover"
                  />
                  {product.isNew && (
                    <Badge className="absolute top-3 left-3">New</Badge>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <Badge variant="outline" className="bg-background/80">Out of Stock</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="flex-1 p-4">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        A beautiful handcrafted piece that adds elegance to any space.
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="font-medium text-lg">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Add to wishlist"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}