// src/components/marketing/FeaturedProductsCarousel.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

// Sample featured products
const featuredProducts = [
  {
    id: "1",
    name: "Ceramic Dinner Set",
    price: 149.99,
    image: "/api/placeholder/400/300",
    badge: "Best Seller",
  },
  {
    id: "2",
    name: "Hand-Painted Vase",
    price: 69.99,
    image: "/api/placeholder/400/300",
    badge: "New Arrival",
  },
  {
    id: "3",
    name: "Coffee Mug Set",
    price: 39.99,
    image: "/api/placeholder/400/300",
    badge: "Limited Edition",
  },
  {
    id: "4",
    name: "Ceramic Planter",
    price: 29.99,
    image: "/api/placeholder/400/300",
    badge: "Trending",
  },
  {
    id: "5",
    name: "Decorative Plates",
    price: 89.99,
    image: "/api/placeholder/400/300",
    badge: "Exclusive",
  },
];

export default function FeaturedProductsCarousel() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Our most popular handcrafted pieces</p>
          </div>
          <Link href="/shop" className="text-primary mt-4 md:mt-0 hover:underline">
            View all products →
          </Link>
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            {featuredProducts.map((product) => (
              <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden h-full">
                  <div className="relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-2 left-2">{product.badge}</Badge>
                  </div>
                  <CardContent className="p-6">
                    <Link href={`/shop/product/${product.id}`} className="hover:underline">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    </Link>
                    <p className="font-medium mb-4">${product.price.toFixed(2)}</p>
                    <Button className="w-full">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    </section>
  );
}