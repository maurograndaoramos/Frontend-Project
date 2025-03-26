"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Check, CreditCard, MapPin, Truck, Wallet, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { format, isToday } from "date-fns";

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

  // Calculate shipping cost based on delivery date
  const isDeliveryToday = orderData.shipping.deliveryDate && 
                         isToday(new Date(orderData.shipping.deliveryDate));
  const shippingCost = isDeliveryToday ? 29.99 : 19.99;
  
  // Calculate final total with shipping cost (VAT already included in subtotal)
  const finalTotal = orderData.subtotal + shippingCost;

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
              {orderData.shipping.city}, {orderData.shipping.municipality}{" "}
              {orderData.shipping.postalCode}
              <br />
              Portugal
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
              {isDeliveryToday
                ? "Same-day Express Delivery"
                : "Standard Delivery"}
              <span className="ml-2 font-medium">
                {formatPrice(shippingCost)}
              </span>
            </p>
            {orderData.shipping.deliveryDate && (
              <div className="flex items-center mt-2 text-sm">
                <Calendar className="h-4 w-4 text-primary mr-2" />
                <span>Delivery on {format(new Date(orderData.shipping.deliveryDate), "dd/MM/yyyy")}</span>
              </div>
            )}
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
            <p className="text-sm">
              MBWay<br />
              Phone: {orderData.payment.mbwayPhone}
            </p>
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
              <span>{formatPrice(shippingCost)}</span>
            </div>
            <div className="flex items-start justify-between text-sm">
              <div>
                <span>VAT (23%)</span>
                <div className="text-xs text-muted-foreground mt-0.5">Already included in product price</div>
              </div>
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
              We currently only deliver to the Algarve region in Portugal.
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