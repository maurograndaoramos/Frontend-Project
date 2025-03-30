"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, CalendarCheck, Clock, Home, Package, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice } from "@/lib/utils";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from "@/lib/context/CartContext";

export default function OrderConfirmationPageContent({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { clearCart } = useCart();
  
  // If no order ID, redirect to shop
  useEffect(() => {
    if (!orderId) {
      router.push("/shop");
    } else {
      // Fetch order details
      fetchOrderDetails(orderId);
    }
  }, [orderId, router]);

  // Check if orderCompleted flag exists and clear cart if needed
  useEffect(() => {
    const orderCompleted = localStorage.getItem('orderCompleted');
    if (orderCompleted === 'true') {
      // Clear the flag
      localStorage.removeItem('orderCompleted');
      // Clear the cart again to be sure
      clearCart();
    }
  }, [clearCart]);
  
  // Fetch order details from API
  const fetchOrderDetails = async (id) => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      
      const data = await response.json();
      setOrderDetails(data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Fallback order details if API call fails
  const fallbackOrderDetails = {
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

  // Use the fetched order details or fallback
  const order = orderDetails || fallbackOrderDetails;

  if (!orderId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto px-4 py-10 text-center"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex justify-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            className="rounded-full bg-primary/10 p-4 mb-4"
          >
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </motion.div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your order has been received and is being processed. You'll receive an email confirmation shortly.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="text-left"
              >
                <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                <p className="font-medium">{order.id}</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="text-left"
              >
                <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                <p className="font-medium">{order.date}</p>
              </motion.div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[
                {
                  icon: <CalendarCheck className="h-6 w-6 text-primary mb-3" />,
                  title: "Estimated Delivery",
                  content: order.expectedDelivery,
                  delay: 0.5
                },
                {
                  icon: <Clock className="h-6 w-6 text-primary mb-3" />,
                  title: "Order Status",
                  content: "Processing",
                  delay: 0.6
                },
                {
                  icon: <Home className="h-6 w-6 text-primary mb-3" />,
                  title: "Shipping To",
                  content: order.address,
                  delay: 0.7
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: item.delay }}
                  className="flex flex-col items-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {item.icon}
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  <p className="text-muted-foreground text-sm truncate max-w-full">
                    {item.content}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              className="bg-muted/20 rounded-lg p-4"
            >
              <div className="flex justify-between text-sm mb-2">
                <div>
                  <span>Subtotal</span>
                  <div className="text-xs text-muted-foreground text-left">VAT (23%) included</div>
                </div>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="text-center space-y-6"
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mail className="h-4 w-4 text-primary" />
            <p className="text-sm text-muted-foreground">
              We've sent a confirmation to {order.email} with all the details of your order.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Have questions about your order? Visit our{" "}
            <Link href="/faq" className="text-primary underline hover:text-primary/80 transition-colors">
              FAQ page
            </Link>{" "}
            or{" "}
            <Link href="/contact" className="text-primary underline hover:text-primary/80 transition-colors">
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
      </motion.div>
    </motion.div>
  );
}