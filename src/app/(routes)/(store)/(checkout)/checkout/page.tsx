"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/lib/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Steps, Step } from "@/components/ui/steps";
import ShippingForm from "@/components/checkout/checkout-components/ShippingForm";
import PaymentForm from "@/components/checkout/checkout-components/PaymentForm";
import OrderSummary from "@/components/checkout/checkout-components/OrderSummary";
import OrderReview from "@/components/checkout/checkout-components/OrderReview";

type CheckoutStep = "shipping" | "payment" | "review";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [orderData, setOrderData] = useState({
    shipping: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      shippingMethod: "standard",
      deliveryNotes: "",
    },
    billing: {
      sameAsShipping: true,
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
    },
    payment: {
      method: "credit-card",
      cardHolder: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
    items: cart.items,
    subtotal: getCartTotal(),
    shipping: 0,
    tax: getCartTotal() * 0.08, // 8% tax rate
    total: getCartTotal() + (getCartTotal() * 0.08),
    orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date().toISOString(),
  });

  const updateShippingData = (data: any) => {
    setOrderData({
      ...orderData,
      shipping: { ...data },
      billing: {
        ...orderData.billing,
        firstName: data.sameAsShipping ? data.firstName : orderData.billing.firstName,
        lastName: data.sameAsShipping ? data.lastName : orderData.billing.lastName,
        address: data.sameAsShipping ? data.address : orderData.billing.address,
        city: data.sameAsShipping ? data.city : orderData.billing.city,
        state: data.sameAsShipping ? data.state : orderData.billing.state,
        zipCode: data.sameAsShipping ? data.zipCode : orderData.billing.zipCode,
        country: data.sameAsShipping ? data.country : orderData.billing.country,
      },
    });
    setCurrentStep("payment");
  };

  const updatePaymentData = (data: any) => {
    setOrderData({
      ...orderData,
      payment: { ...data },
    });
    setCurrentStep("review");
  };

  const placeOrder = () => {
    // In a real implementation, this would call an API to create the order
    console.log("Placing order:", orderData);
    
    // Mock order placement - in a real app this would be an API call
    setTimeout(() => {
      // Redirect to thank you page with order ID
      clearCart();
      router.push(`/checkout/confirmation?orderId=${orderData.orderId}`);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main checkout form */}
      <div className="lg:col-span-2">
        <Card className="mb-8">
          <CardContent className="p-6">
            <Steps currentStep={
              currentStep === "shipping" ? 0 : 
              currentStep === "payment" ? 1 : 2
            }>
              <Step title="Shipping" />
              <Step title="Payment" />
              <Step title="Review" />
            </Steps>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {currentStep === "shipping" && (
              <ShippingForm 
                initialData={orderData.shipping} 
                onSubmit={updateShippingData} 
              />
            )}

            {currentStep === "payment" && (
              <PaymentForm 
                initialData={orderData.payment}
                onSubmit={updatePaymentData}
                onBack={() => setCurrentStep("shipping")}
              />
            )}

            {currentStep === "review" && (
              <OrderReview 
                orderData={orderData}
                onBack={() => setCurrentStep("payment")}
                onPlaceOrder={placeOrder}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order summary */}
      <div className="lg:col-span-1">
        <OrderSummary 
          items={cart.items} 
          subtotal={getCartTotal()} 
          tax={orderData.tax}
          shipping={orderData.shipping}
          total={orderData.total}
        />
      </div>
    </div>
  );
}