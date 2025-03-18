"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductDetail from "@/components/shop/shop-components/ProductDetail";
import { Product } from "@/types/product";
import { getProduct } from "@/lib/services/productService";
import { useToast } from "@/lib/hooks/useToast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function ProductDetailContent() {
  const params = useParams();
  const productId = params.id as string;
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(false);
      
      try {
        const data = await getProduct(productId);
        
        if (!data) {
          setError(true);
          toast({
            variant: "destructive",
            title: "Product not found",
            description: "The requested product could not be found.",
          });
          return;
        }
        
        // Extract relatedProducts before setting product
        const { relatedProducts: related, ...productData } = data;
        
        setProduct(productData);
        
        // Make sure relatedProducts is of type Product[]
        if (related && Array.isArray(related)) {
          // Assuming each item in related is a Product 
          const typedRelated = related as unknown as Product[];
          setRelatedProducts(typedRelated);
        }
      } catch (err) {
        setError(true);
        toast({
          variant: "destructive",
          title: "Error loading product",
          description: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadProduct();
  }, [productId, toast]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find the product you're looking for.
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }
  
  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}