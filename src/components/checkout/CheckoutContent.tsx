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
import { motion, AnimatePresence } from 'framer-motion';
import { Package, CreditCard, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CheckoutStep = "shipping" | "payment" | "review";

export default function CheckoutPageContent() {
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
      shippingMethod: "standard" as "standard",
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
      method: "credit-card" as "credit-card",
      cardHolder: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
    items: cart.items,
    subtotal: getCartTotal(),
    shippingCost: 0,
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Main checkout form */}
      <div className="lg:col-span-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
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
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                {currentStep === "shipping" && (
                  <div>
                    <ShippingForm 
                      initialData={orderData.shipping} 
                      onSubmit={updateShippingData} 
                    />
                  </div>
                )}

                {currentStep === "payment" && (
                  <div>
                    <div className="mb-6">
                      <Button
                        variant="ghost"
                        onClick={() => setCurrentStep("shipping")}
                        className="mb-4"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Shipping
                      </Button>
                    </div>
                    <PaymentForm 
                      initialData={orderData.payment}
                      onSubmit={updatePaymentData}
                      onBack={() => setCurrentStep("shipping")}
                    />
                  </div>
                )}

                {currentStep === "review" && (
                  <div>
                    <div className="mb-6">
                      <Button
                        variant="ghost"
                        onClick={() => setCurrentStep("payment")}
                        className="mb-4"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Payment
                      </Button>
                    </div>
                    <OrderReview
                      orderData={orderData}
                      onBack={() => setCurrentStep("payment")}
                      onPlaceOrder={placeOrder}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Order summary */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="lg:col-span-1"
      >
        <OrderSummary 
          items={cart.items} 
          subtotal={getCartTotal()} 
          tax={orderData.tax}
          shipping={orderData.shippingCost}
          total={orderData.total}
        />
      </motion.div>
    </motion.div>
  );
}