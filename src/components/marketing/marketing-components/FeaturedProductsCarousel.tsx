"use client";

import { useEffect, useState } from "react";
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
import { ShoppingCart, Heart } from "lucide-react";
import { getProducts } from "@/lib/services/productService";
import { useCart } from "@/lib/context/CartContext";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/product";
import { motion } from "framer-motion";

export default function FeaturedProductsCarousel() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    async function loadFeaturedProducts() {
      setLoading(true);
      try {
        const { data } = await getProducts({ 
          sort: "featured",
          limit: 5 
        });
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Failed to load featured products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedProducts();
  }, []);

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Carousel>
            <CarouselContent>
              {[1, 2, 3].map((i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Arrangements</h2>
            <p className="text-muted-foreground">Our most popular flower arrangements</p>
          </div>
          <Link 
            href="/shop" 
            className="text-primary mt-4 md:mt-0 hover:underline inline-flex items-center group"
          >
            View all products 
            <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </motion.div>

        <Carousel className="w-full">
          <CarouselContent>
            {featuredProducts.map((product, index) => (
              <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 * index }}
                >
                  <Link href={`/shop/product/${product.id}`}>
                    <Card className="overflow-hidden h-full group hover:shadow-xl transition-all duration-300">
                      <div className="relative">
                        <Image
                          src={product.images && product.images.length > 0 
                            ? product.images[0] 
                            : "/api/placeholder/400/300?text=Beautiful+Flowers"}
                          alt={product.name}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-white/90 hover:bg-white shadow-md"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        {product.isNew && (
                          <Badge className="absolute top-2 left-2 bg-white text-black hover:bg-white/90">
                            New
                          </Badge>
                        )}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <Badge variant="outline" className="bg-background/80">Out of Stock</Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center mb-4">
                          <span className="font-medium text-lg">{formatPrice(product.price)}</span>
                          {product.originalPrice && (
                            <span className="ml-2 text-sm text-muted-foreground line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90 transition-colors duration-300" 
                          disabled={!product.inStock}
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-white/80 hover:bg-white shadow-md" />
          <CarouselNext className="right-2 bg-white/80 hover:bg-white shadow-md" />
        </Carousel>
      </div>
    </section>
  );
}