"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, CalendarCheck, Clock, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice } from "@/lib/utils";
import confetti from "canvas-confetti";

export default function OrderConfirmationPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get("orderId");
  
  // If no order ID, redirect to shop
  useEffect(() => {
    if (!orderId) {
      router.push("/shop");
    }
  }, [orderId, router]);

  // Trigger confetti effect when page loads
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#4CAF50", "#8BC34A", "#CDDC39"],
        });
      } catch (error) {
        console.error("Confetti error:", error);
      }
    }
  }, []);

  // Mock order data - in real app, this would be fetched from API
  const orderDetails = {
    id: orderId || "ORDER-XXXXX",
    date: new Date().toLocaleDateString(),
    expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    email: "customer@example.com",
    address: "123 Main St, Anytown, CA 12345",
    subtotal: 89.97,
    shipping: 0,
    tax: 7.20,
    total: 97.17,
  };

  if (!orderId) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-center">
      <div className="mb-8">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your order has been received and is being processed. You'll receive an email confirmation shortly.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-left">
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="font-medium">{orderDetails.id}</p>
            </div>
            <div className="text-left">
              <p className="text-sm text-muted-foreground mb-1">Order Date</p>
              <p className="font-medium">{orderDetails.date}</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
              <CalendarCheck className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-medium text-sm">Estimated Delivery</h3>
              <p className="text-muted-foreground text-sm">{orderDetails.expectedDelivery}</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
              <Clock className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-medium text-sm">Order Status</h3>
              <p className="text-muted-foreground text-sm">Processing</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
              <Home className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-medium text-sm">Shipping To</h3>
              <p className="text-muted-foreground text-sm truncate max-w-full">
                {orderDetails.address}
              </p>
            </div>
          </div>

          <div className="bg-muted/20 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>{formatPrice(orderDetails.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Shipping</span>
              <span>{orderDetails.shipping === 0 ? "Free" : formatPrice(orderDetails.shipping)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Tax</span>
              <span>{formatPrice(orderDetails.tax)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(orderDetails.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-6">
        <div className="max-w-md mx-auto">
          <p className="text-sm text-muted-foreground mb-1">
            We've sent a confirmation to {orderDetails.email} with all the details of your order.
          </p>
          <p className="text-sm text-muted-foreground">
            Have questions about your order? Visit our{" "}
            <Link href="/faq" className="text-primary underline">
              FAQ page
            </Link>{" "}
            or{" "}
            <Link href="/contact" className="text-primary underline">
              contact us
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/shop">
              Continue Shopping
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/user/orders`}>
              View Your Orders <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}