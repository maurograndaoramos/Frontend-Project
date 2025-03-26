"use client";

import React from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/lib/context/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isToday } from "date-fns";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: any;
  tax: number;
  total: number;
  shippingCost?: number;
}

export default function OrderSummary({
  items,
  subtotal,
  shipping,
  tax,
  total,
  shippingCost: externalShippingCost,
}: OrderSummaryProps) {
  // Calculate shipping cost based on delivery date if available
  const shippingCost = externalShippingCost !== undefined 
    ? externalShippingCost 
    : (shipping?.deliveryDate && isToday(new Date(shipping.deliveryDate))) 
      ? 29.99 
      : 19.99;
  
  // Calculate final total with shipping cost (VAT already included in subtotal)
  const finalTotal = subtotal + shippingCost;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[220px] mb-4">
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.id} className="py-3 flex items-start">
                <div className="relative h-16 w-16 rounded-md overflow-hidden border flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{item.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatPrice(item.price)} × {item.quantity}
                    </span>
                    <span className="text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>

        <Separator className="my-4" />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Shipping</span>
            <span>{formatPrice(shippingCost)}</span>
          </div>
          <div className="flex items-start justify-between text-sm">
            <div>
              <span>VAT (23%)</span>
              <div className="text-xs text-muted-foreground mt-0.5">Already included in product price</div>
            </div>
            <span>{formatPrice(tax)}</span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between font-medium">
          <span>Total</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>

        <div className="mt-6 bg-muted/50 p-3 rounded-md">
          <p className="text-xs text-muted-foreground">
            By placing your order, you agree to our{" "}
            <a href="/terms" className="underline text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline text-primary">
              Privacy Policy
            </a>
            . We currently only deliver to the Algarve region in Portugal.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}