"use client";

import { useState, useEffect } from "react";
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
import { Package, CreditCard, CheckCircle2, ArrowLeft, Gift, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

// Add "recipient" to the checkout steps
type CheckoutStep = "recipient" | "shipping" | "payment" | "review";

// Define Algarve municipalities
const ALGARVE_MUNICIPALITIES = [
  "Albufeira",
  "Alcoutim",
  "Aljezur",
  "Castro Marim",
  "Faro",
  "Lagoa",
  "Lagos",
  "Loulé",
  "Monchique",
  "Olhão",
  "Portimão",
  "São Brás de Alportel",
  "Silves",
  "Tavira",
  "Vila do Bispo",
  "Vila Real de Santo António"
];

export default function CheckoutPageContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cart, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  
  // Change initial step to "recipient"
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("recipient");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isForMe, setIsForMe] = useState<boolean | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  const [orderData, setOrderData] = useState({
    shipping: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      municipality: "", // Changed from state to municipality
      postalCode: "", // Changed from zipCode to postalCode
      deliveryNotes: "",
      shippingMethod: "standard" as "standard" | "express",
      deliveryDate: undefined as Date | undefined, // Add delivery date
      coordinates: undefined as {lat: number, lng: number} | undefined, // Add coordinates
    },
    billing: {
      sameAsShipping: true,
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      municipality: "", // Changed from state to municipality
      postalCode: "", // Changed from zipCode to postalCode
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
    shippingCost: 19.99, // Default shipping cost
    tax: getCartTotal() * 0.23 / 1.23, // VAT amount (already included in price)
    total: getCartTotal(), // Total is just subtotal initially (VAT already included)
    orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date().toISOString(),
  });

  // Fetch user profile if the user is authenticated
  useEffect(() => {
    if (status === "loading") return;
    
    if (session?.user) {
      fetchUserProfile();
    }
  }, [session, status]);

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const response = await fetch('/api/users/profile');
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      toast({
        title: "Failed to load profile data",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Helper function to check if it's before 2PM cutoff
  const isBeforeCutoff = () => {
    const now = new Date();
    return now.getHours() < 14;
  };

  // Handler for recipient selection
  const handleRecipientSelection = (isForSelf: boolean) => {
    setIsForMe(isForSelf);
    
    // If "This is for me" and we have user profile data, pre-fill the shipping form
    if (isForSelf && userProfile) {
      // Extract first and last name from full name
      const nameParts = userProfile.name ? userProfile.name.split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Extract address parts - this depends on how your address is stored
      // This is a simple implementation assuming address is a single string
      const addressParts = userProfile.address ? userProfile.address.split(',') : [];
      const streetAddress = addressParts[0] || '';
      const city = addressParts[1]?.trim() || '';
      const municipalityPostal = addressParts[2]?.trim().split(' ') || ['', ''];
      const municipality = municipalityPostal[0] || '';
      const postalCode = municipalityPostal[1] || '';
      
      setOrderData({
        ...orderData,
        shipping: {
          ...orderData.shipping,
          firstName,
          lastName,
          email: userProfile.email || '',
          phone: userProfile.phone || '',
          address: streetAddress,
          city,
          municipality,
          postalCode,
          deliveryDate: isBeforeCutoff() ? new Date() : undefined,
          coordinates: userProfile.coordinates || undefined
        }
      });
    }
    
    setCurrentStep("shipping");
  };

  const updateShippingData = (data: any) => {
    // Check if this is a delivery date update only
    if (data.action === "updateDeliveryDateOnly") {
      // Calculate shipping cost based on delivery date
      const isToday = data.deliveryDate && 
                     data.deliveryDate.getDate() === new Date().getDate() &&
                     data.deliveryDate.getMonth() === new Date().getMonth() &&
                     data.deliveryDate.getFullYear() === new Date().getFullYear();
                     
      const sameDayAvailable = isBeforeCutoff();
      const shippingCost = (isToday && sameDayAvailable) ? 29.99 : 19.99;
      const total = orderData.subtotal + shippingCost;
      
      setOrderData({
        ...orderData,
        shipping: {
          ...orderData.shipping,
          deliveryDate: data.deliveryDate,
          shippingMethod: (isToday && sameDayAvailable) ? "express" : "standard"
        },
        shippingCost: shippingCost,
        total: total,
      });
      
      return; // Don't proceed with the validation or navigation
    }
    
    // Check if this is a shipping method update only (keeping this for backward compatibility)
    if (data.action === "updateShippingMethodOnly") {
      // Just update the shipping cost and total based on shipping method
      const shippingCost = data.shippingMethod === "express" ? 29.99 : 19.99;
      const total = orderData.subtotal + shippingCost;
      
      setOrderData({
        ...orderData,
        shipping: {
          ...orderData.shipping,
          shippingMethod: data.shippingMethod
        },
        shippingCost: shippingCost,
        total: total,
      });
      
      return; // Don't proceed with the validation or navigation
    }
    
    // Regular form submission - perform validation
    // Check if the selected municipality is in Algarve
    if (!ALGARVE_MUNICIPALITIES.includes(data.municipality)) {
      toast({
        title: "Delivery Limitation",
        description: "We apologize, but our flower delivery is currently limited to the Algarve region in Portugal.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate Portuguese postal code format (4 digits - 3 digits)
    const postalCodePattern = /^\d{4}-\d{3}$/;
    if (!postalCodePattern.test(data.postalCode)) {
      toast({
        title: "Invalid Postal Code",
        description: "Please enter a valid Portuguese postal code in the format 0000-000",
        variant: "destructive"
      });
      return;
    }

    // Calculate shipping cost based on delivery date
    const isToday = data.deliveryDate && 
                   data.deliveryDate.getDate() === new Date().getDate() &&
                   data.deliveryDate.getMonth() === new Date().getMonth() &&
                   data.deliveryDate.getFullYear() === new Date().getFullYear();
                   
    const sameDayAvailable = isBeforeCutoff();
    const shippingCost = (isToday && sameDayAvailable) ? 29.99 : 19.99;
    
    // Calculate total (subtotal + shipping cost)
    const total = orderData.subtotal + shippingCost;

    // Set the shipping method based on the delivery date
    const shippingMethod = (isToday && sameDayAvailable) ? "express" : "standard";

    setOrderData({
      ...orderData,
      shipping: { 
        ...data,
        shippingMethod // Override any selected shipping method with the one derived from the date
      },
      shippingCost: shippingCost,
      total: total,
      billing: {
        ...orderData.billing,
        firstName: data.sameAsShipping ? data.firstName : orderData.billing.firstName,
        lastName: data.sameAsShipping ? data.lastName : orderData.billing.lastName,
        address: data.sameAsShipping ? data.address : orderData.billing.address,
        city: data.sameAsShipping ? data.city : orderData.billing.city,
        municipality: data.sameAsShipping ? data.municipality : orderData.billing.municipality,
        postalCode: data.sameAsShipping ? data.postalCode : orderData.billing.postalCode,
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

  const placeOrder = async () => {
    try {
      // Set a flag in localStorage to indicate we're creating an order
      localStorage.setItem('creatingOrder', 'true');
      
      console.log("Sending order data:", JSON.stringify(orderData));
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server error response:", errorData);
        throw new Error(`Failed to place order: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Order created successfully:", result);
      
      // Save a flag that order was completed successfully
      localStorage.setItem('orderCompleted', 'true');
      
      // Clear the cart before redirecting
      clearCart();
      
      // Mark that we're no longer creating an order
      localStorage.removeItem('creatingOrder');
      
      // Hardcode the path that we know works in production based on your logs
      if (result && result.orderId) {
        // This is the exact path that was shown working in your logs
        console.log(`Redirecting to /confirmation/${result.orderId}`);
        window.location.href = `/confirmation/${result.orderId}`;
      } else {
        console.error("Missing orderId in response", result);
        toast({
          title: "Order created but redirect failed",
          description: "Your order was placed successfully, but we couldn't redirect you to the confirmation page.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during order placement:", error);
      localStorage.removeItem('creatingOrder');
      toast({
        title: "Failed to place order",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handler for step navigation
  const handleStepClick = (step: number) => {
    const stepMap = {
      0: "recipient",
      1: "shipping", 
      2: "payment",
      3: "review"
    } as const;
    
    const currentStepNumber = 
      currentStep === "recipient" ? 0 :
      currentStep === "shipping" ? 1 :
      currentStep === "payment" ? 2 : 3;

    // Only allow going backwards
    if (step < currentStepNumber) {
      setCurrentStep(stepMap[step]);
    }
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
              <Steps 
                currentStep={
                  currentStep === "recipient" ? 0 :
                  currentStep === "shipping" ? 1 : 
                  currentStep === "payment" ? 2 : 3
                }
                onStepClick={handleStepClick}
              >
                <Step title="Recipient" />
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
                {currentStep === "recipient" && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">Who is this order for?</h2>
                      <p className="text-muted-foreground">
                        Let us know if these flowers are for you or a gift for someone else.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Button
                        onClick={() => handleRecipientSelection(true)}
                        variant="outline"
                        size="lg"
                        className="h-auto p-6 flex flex-col items-center justify-center space-y-3 transition-all duration-300 hover:border-primary hover:shadow-md"
                        disabled={isLoadingProfile}
                      >
                        <User className="h-10 w-10 text-primary mb-2" />
                        <span className="font-medium text-lg">This is for me</span>
                      </Button>
                      
                      <Button
                        onClick={() => handleRecipientSelection(false)}
                        variant="outline"
                        size="lg"
                        className="h-auto p-6 flex flex-col items-center justify-center space-y-3 transition-all duration-300 hover:border-primary hover:shadow-md"
                        disabled={isLoadingProfile}
                      >
                        <Gift className="h-10 w-10 text-primary mb-2" />
                        <span className="font-medium text-lg">This is a gift</span>
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === "shipping" && (
                  <div>
                    {isForMe && (
                      <div className="mb-6 p-4 bg-primary/10 rounded-md">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <p className="text-sm font-medium">
                            Shipping to you. Your information has been pre-filled.
                          </p>
                        </div>
                      </div>
                    )}
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
          shipping={orderData.shipping}
          shippingCost={orderData.shippingCost}
          total={orderData.total}
        />
      </motion.div>
    </motion.div>
  );
}