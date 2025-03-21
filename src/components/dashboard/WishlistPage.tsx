"use client";

import { useState } from "react";
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
import { Heart, ShoppingCart, Trash2, HeartOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [items, setItems] = useState<WishlistItem[]>(wishlistItems);
  
  // Filter items based on category
  const filteredItems = categoryFilter === "all" 
    ? items 
    : items.filter(item => item.category.toLowerCase() === categoryFilter.toLowerCase());
  
  // Get unique categories for the filter
  const categories = Array.from(new Set(items.map(item => item.category)));
  
  const removeFromWishlist = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };
  
  const addAllToCart = () => {
    // In a real app, this would add all items to the cart
    alert('All in-stock items would be added to cart');
  };
  
  const clearWishlist = () => {
    // Confirmation could be added here
    setItems([]);
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">My Wishlist</h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
        <Button 
          onClick={() => router.push("/dashboard")}
          variant="outline"
          className="transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Back to Dashboard
        </Button>
      </div>

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
                <SelectTrigger className="w-[180px] transition-colors hover:border-primary">
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
                  className="flex-1 sm:flex-none transition-colors hover:bg-primary hover:text-primary-foreground"
                  onClick={addAllToCart}
                  disabled={filteredItems.length === 0 || !filteredItems.some(item => item.inStock)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add All to Cart
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 transition-colors hover:bg-primary hover:text-primary-foreground"
                  onClick={clearWishlist}
                  disabled={filteredItems.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <HeartOff className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Your wishlist is empty</h3>
              <p className="text-muted-foreground text-center mt-2">
                {categoryFilter === "all" 
                  ? "You haven't added any items to your wishlist yet." 
                  : `You don't have any items in the ${categoryFilter} category.`}
              </p>
              {categoryFilter !== "all" && (
                <Button 
                  variant="outline" 
                  className="mt-4 transition-colors hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setCategoryFilter("all")}
                >
                  View All Items
                </Button>
              )}
              <Button 
                className="mt-4 transition-colors hover:bg-primary/90"
                onClick={() => router.push("/shop")}
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative group">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={400}
                      height={320}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Badge variant="outline" className="bg-background/80">Out of Stock</Badge>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/50 hover:bg-background/80 transition-colors hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="flex flex-col flex-grow p-4">
                    <div className="mb-2">
                      <Badge variant="secondary" className="mb-2 transition-colors">{item.category}</Badge>
                      <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                    </div>
                    <div className="flex items-center mt-1 mb-4">
                      <span className="font-medium">{item.price}</span>
                      {item.originalPrice && (
                        <span className="ml-2 text-sm text-muted-foreground line-through">
                          {item.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-auto mb-3">
                      Added on {item.addedDate}
                    </p>
                    <Button
                      className="w-full mt-auto transition-colors hover:bg-primary/90"
                      disabled={!item.inStock}
                    >
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {filteredItems.length > 0 && (
            <div className="mt-8">
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredItems.length} of {items.length} items
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={clearWishlist}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Wishlist
                  </Button>
                  <Button size="sm" onClick={() => router.push("/shop")}>
                    <Heart className="h-4 w-4 mr-2" />
                    Discover More
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}