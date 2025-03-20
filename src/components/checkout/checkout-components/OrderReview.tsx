"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Check, CreditCard, MapPin, Truck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

interface OrderReviewProps {
  orderData: any;
  onBack: () => void;
  onPlaceOrder: () => void;
}

export default function OrderReview({
  orderData,
  onBack,
  onPlaceOrder,
}: OrderReviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    onPlaceOrder();
  };

  // Calculate shipping cost based on method
  const shippingCost = orderData.shipping.shippingMethod === "express" ? 12.99 : 0;
  
  // Calculate final total with shipping cost
  const finalTotal = orderData.subtotal + orderData.tax + shippingCost;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Review Your Order</h2>
        <p className="text-muted-foreground">
          Please review your order details before placing your order.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium">Shipping Information</h3>
            </div>
            <p className="text-sm">
              {orderData.shipping.firstName} {orderData.shipping.lastName}
              <br />
              {orderData.shipping.address}
              <br />
              {orderData.shipping.city}, {orderData.shipping.state}{" "}
              {orderData.shipping.zipCode}
              <br />
              {orderData.shipping.country}
              <br />
              {orderData.shipping.phone}
              <br />
              {orderData.shipping.email}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center mb-4">
              <Truck className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium">Shipping Method</h3>
            </div>
            <p className="text-sm">
              {orderData.shipping.shippingMethod === "standard"
                ? "Standard Shipping (2-3 days)"
                : "Express Shipping (1-2 days)"}
            </p>
            {orderData.shipping.deliveryNotes && (
              <div className="mt-2 p-2 bg-muted/50 rounded-md text-xs">
                <strong>Delivery Notes:</strong> {orderData.shipping.deliveryNotes}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center mb-4">
            {orderData.payment.method === "credit-card" ? (
              <CreditCard className="h-5 w-5 text-primary mr-2" />
            ) : (
              <Wallet className="h-5 w-5 text-primary mr-2" />
            )}
            <h3 className="font-medium">Payment Method</h3>
          </div>
          {orderData.payment.method === "credit-card" ? (
            <p className="text-sm">
              Credit Card ending in{" "}
              {orderData.payment.cardNumber
                ?.replace(/\s/g, "")
                .slice(-4)
                .padStart(4, "*")}
              <br />
              {orderData.payment.cardHolder}
              <br />
              Expires: {orderData.payment.expiryDate}
            </p>
          ) : (
            <p className="text-sm">PayPal</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Order Summary</h3>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(orderData.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Shipping</span>
              <span>{shippingCost > 0 ? formatPrice(shippingCost) : "Free"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Tax (8%)</span>
              <span>{formatPrice(orderData.tax)}</span>
            </div>

            <Separator className="my-3" />

            <div className="flex items-center justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/50 p-4 rounded-md">
        <div className="flex items-start space-x-3">
          <Check className="h-5 w-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="mb-1">
              By placing your order, you confirm that you've read and agree to our{" "}
              <a href="/terms" className="underline text-primary" target="_blank">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline text-primary" target="_blank">
                Privacy Policy
              </a>
              .
            </p>
            <p>
              All flowers are subject to availability. In some cases, substitutions of equal or greater value may be necessary.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Payment
        </Button>

        <Button onClick={handlePlaceOrder} disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
}