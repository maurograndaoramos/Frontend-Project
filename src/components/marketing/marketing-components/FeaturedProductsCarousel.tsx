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
import { ShoppingCart, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/services/productService";
import { useCart } from "@/lib/context/CartContext";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/product";
import { motion } from "framer-motion";
import { toast } from "sonner";

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
        toast.error('Failed to load featured products');
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
    toast.success('Added to cart', {
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">No Featured Products</h2>
            <p className="text-muted-foreground">Check back later for our featured arrangements.</p>
          </div>
        </div>
      </section>
    );
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
            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {featuredProducts.map((product, index) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
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
                          <div className="absolute top-2 left-2 flex gap-2">
                            {product.isNew && (
                              <Badge className="bg-primary/95 backdrop-blur-sm shadow-sm">
                                New
                              </Badge>
                            )}
                            {product.hasDiscount && (
                              <Badge className="bg-red-500/95 text-white backdrop-blur-sm shadow-sm">
                                Discount
                              </Badge>
                            )}
                          </div>
                          {!product.inStock && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute inset-0 bg-background/80 flex items-center justify-center"
                            >
                              <Badge variant="outline" className="bg-background/80">Out of Stock</Badge>
                            </motion.div>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center mb-4">
                            <span className="font-medium text-lg">{formatPrice(product.price)}</span>
                            {product.hasDiscount && product.originalPrice && (
                              <span className="ml-2 text-sm text-muted-foreground line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90 transition-colors duration-300 group-hover:scale-105" 
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
            <CarouselPrevious className="bg-background/80 hover:bg-background/90 backdrop-blur-sm border-0 md:bg-primary md:hover:bg-primary/90 md:text-primary-foreground md:shadow-md md:hover:scale-110 transition-all">
              <ChevronLeft className="h-6 w-6" />
            </CarouselPrevious>
            <CarouselNext className="bg-background/80 hover:bg-background/90 backdrop-blur-sm border-0 md:bg-primary md:hover:bg-primary/90 md:text-primary-foreground md:shadow-md md:hover:scale-110 transition-all">
              <ChevronRight className="h-6 w-6" />
            </CarouselNext>
          </Carousel>
        </div>
      </div>
    </section>
  );
}