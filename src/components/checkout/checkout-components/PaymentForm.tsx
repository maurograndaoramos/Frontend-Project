"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Path } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, ArrowRight, CreditCard, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const formSchema = z.object({
  method: z.enum(["credit-card", "mbway"]),
  cardHolder: z.string().min(3, "Please enter the cardholder name").optional(),
  cardNumber: z
    .string()
    .min(16, "Please enter a valid card number")
    .max(19, "Please enter a valid card number")
    .regex(/^[0-9 ]+$/, "Card number can only contain digits")
    .optional(),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, "Please use MM/YY format")
    .optional(),
  cvv: z
    .string()
    .min(3, "CVV must be 3-4 digits")
    .max(4, "CVV must be 3-4 digits")
    .regex(/^[0-9]+$/, "CVV can only contain digits")
    .optional(),
  mbwayPhone: z
    .string()
    .regex(/^9[0-9]{8}$/, "Please enter a valid Portuguese mobile number")
    .optional(),
}).refine((data) => {
  // Conditionally require fields based on payment method
  if (data.method === "credit-card") {
    return !!data.cardHolder && !!data.cardNumber && !!data.expiryDate && !!data.cvv;
  }
  if (data.method === "mbway") {
    return !!data.mbwayPhone;
  }
  return true;
}, {
  message: "Please fill in all required fields",
  path: ["method"], // This will show the error at the payment method selection
});

type PaymentFormValues = z.infer<typeof formSchema>;

interface PaymentFormProps {
  initialData?: Partial<PaymentFormValues>;
  onSubmit: (data: PaymentFormValues) => void;
  onBack: () => void;
}

export default function PaymentForm({
  initialData = {},
  onSubmit,
  onBack,
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "mbway">(
    (initialData.method as "credit-card" | "mbway") || "credit-card"
  );

  // Create separate states for MBWay phone
  const [mbwayPhone, setMbwayPhone] = useState(initialData.mbwayPhone || "");
  const [phoneError, setPhoneError] = useState("");

  // Create states for credit card
  const [cardData, setCardData] = useState({
    cardHolder: initialData.cardHolder || "",
    cardNumber: initialData.cardNumber || "",
    expiryDate: initialData.expiryDate || "",
    cvv: initialData.cvv || "",
  });
  const [cardErrors, setCardErrors] = useState({
    cardHolder: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Define form
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      method: initialData.method || "credit-card",
      cardHolder: initialData.cardHolder || "",
      cardNumber: initialData.cardNumber || "",
      expiryDate: initialData.expiryDate || "",
      cvv: initialData.cvv || "",
      mbwayPhone: initialData.mbwayPhone || "",
    },
  });

  // Handle payment method change
  const handleMethodChange = (value: string) => {
    setPaymentMethod(value as "credit-card" | "mbway");
    form.setValue("method", value as "credit-card" | "mbway");
  };

  // Handle MBWay phone change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get raw value without formatting
    const value = e.target.value.replace(/[^\d]/g, '');
    
    // Format the phone number as user types (9XX XXX XXX)
    let formattedValue = value;
    if (value.length > 3) {
      formattedValue = value.slice(0, 3) + ' ' + value.slice(3);
    }
    if (value.length > 6) {
      formattedValue = formattedValue.slice(0, 7) + ' ' + formattedValue.slice(7);
    }
    
    // Update display value with formatting
    e.target.value = formattedValue;
    
    // Update state with raw value for validation
    setMbwayPhone(value);
    form.setValue("mbwayPhone", value);
    
    // Clear error when typing
    if (phoneError) setPhoneError("");
  };

  // Handle credit card field changes
  const handleCardChange = (field: keyof typeof cardData, value: string) => {
    setCardData({
      ...cardData,
      [field]: value
    });
    form.setValue(field as any as Path<PaymentFormValues>, value);
    
    // Clear error when typing
    if (cardErrors[field]) {
      setCardErrors({
        ...cardErrors,
        [field]: ""
      });
    }
  };

  // Handle submit
  const handleContinueClick = () => {
    if (paymentMethod === "credit-card") {
      // Validate credit card fields
      let isValid = true;
      const newErrors = { ...cardErrors };
      
      if (!cardData.cardHolder || cardData.cardHolder.length < 3) {
        newErrors.cardHolder = "Please enter the cardholder name";
        isValid = false;
      }
      
      if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = "Please enter a valid card number";
        isValid = false;
      }
      
      if (!cardData.expiryDate || !/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(cardData.expiryDate)) {
        newErrors.expiryDate = "Please use MM/YY format";
        isValid = false;
      }
      
      if (!cardData.cvv || !/^[0-9]{3,4}$/.test(cardData.cvv)) {
        newErrors.cvv = "CVV must be 3-4 digits";
        isValid = false;
      }
      
      setCardErrors(newErrors);
      
      if (isValid) {
        onSubmit({
          method: "credit-card",
          cardHolder: cardData.cardHolder,
          cardNumber: cardData.cardNumber,
          expiryDate: cardData.expiryDate,
          cvv: cardData.cvv,
          mbwayPhone: undefined
        });
      }
    } else if (paymentMethod === "mbway") {
      // Validate phone number
      if (!mbwayPhone || !/^9[0-9]{8}$/.test(mbwayPhone)) {
        setPhoneError("Please enter a valid Portuguese mobile number");
        return;
      }
      
      // Submit MBWay payment
      onSubmit({
        method: "mbway",
        mbwayPhone: mbwayPhone,
        cardHolder: undefined,
        cardNumber: undefined,
        expiryDate: undefined,
        cvv: undefined
      });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
        <p className="text-muted-foreground">
          Choose your payment method and enter your payment details.
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={handleMethodChange}
                    defaultValue={field.value}
                    value={paymentMethod}
                    className="flex flex-col space-y-3"
                  >
                    <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <div className="flex-1">
                        <label
                          htmlFor="credit-card"
                          className="font-medium text-sm cursor-pointer flex items-center"
                        >
                          <CreditCard className="h-5 w-5 mr-2 text-primary" />
                          Credit or Debit Card
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Pay with your credit or debit card
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <div className="h-8 w-12 rounded border flex items-center justify-center bg-white">
                          <Image
                            src="/visa.svg"
                            width={32}
                            height={20}
                            alt="Visa"
                          />
                        </div>
                        <div className="h-8 w-12 rounded border flex items-center justify-center bg-white">
                          <Image
                            src="/mastercard.svg"
                            width={32}
                            height={20}
                            alt="Mastercard"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                      <RadioGroupItem value="mbway" id="mbway" />
                      <div className="flex-1">
                        <label
                          htmlFor="mbway"
                          className="font-medium text-sm cursor-pointer flex items-center"
                        >
                          <Smartphone className="h-5 w-5 mr-2 text-primary" />
                          MBWay
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Pay with your MBWay account
                        </p>
                      </div>
                      <div className="h-8 w-16 rounded border flex items-center justify-center bg-white">
                        <Image
                          src="/mbway.svg"
                          width={48}
                          height={30}
                          alt="MBWay"
                        />
                      </div>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          {paymentMethod === "credit-card" && (
            <div className="space-y-4">
              <div>
                <FormLabel htmlFor="cardHolder">Cardholder Name</FormLabel>
                <Input 
                  id="cardHolder"
                  placeholder="John Doe" 
                  value={cardData.cardHolder}
                  onChange={(e) => handleCardChange('cardHolder', e.target.value)}
                />
                {cardErrors.cardHolder && (
                  <p className="text-[0.8rem] font-medium text-destructive mt-1">{cardErrors.cardHolder}</p>
                )}
              </div>

              <div>
                <FormLabel htmlFor="cardNumber">Card Number</FormLabel>
                <Input 
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456" 
                  value={cardData.cardNumber}
                  onChange={(e) => {
                    // Format card number with spaces
                    const value = e.target.value.replace(/\s/g, '');
                    const formattedValue = value
                      .replace(/[^\d]/g, '')
                      .replace(/(.{4})/g, '$1 ')
                      .trim();
                    handleCardChange('cardNumber', formattedValue);
                  }}
                  maxLength={19}
                />
                {cardErrors.cardNumber && (
                  <p className="text-[0.8rem] font-medium text-destructive mt-1">{cardErrors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormLabel htmlFor="expiryDate">Expiry Date</FormLabel>
                  <Input 
                    id="expiryDate"
                    placeholder="MM/YY" 
                    value={cardData.expiryDate}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      let formattedValue = value;
                      if (value.length > 2) {
                        formattedValue = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
                      }
                      handleCardChange('expiryDate', formattedValue);
                    }}
                    maxLength={5}
                  />
                  {cardErrors.expiryDate && (
                    <p className="text-[0.8rem] font-medium text-destructive mt-1">{cardErrors.expiryDate}</p>
                  )}
                </div>

                <div>
                  <FormLabel htmlFor="cvv">CVV</FormLabel>
                  <Input 
                    id="cvv"
                    placeholder="123" 
                    value={cardData.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      handleCardChange('cvv', value);
                    }}
                    maxLength={4}
                    type="password"
                  />
                  {cardErrors.cvv && (
                    <p className="text-[0.8rem] font-medium text-destructive mt-1">{cardErrors.cvv}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "mbway" && (
            <div className="bg-muted/50 p-4 rounded-md space-y-4">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-medium text-sm">MBWay Payment</h3>
                  <p className="text-xs text-muted-foreground">Fast, secure mobile payments</p>
                </div>
              </div>
              
              <div className="rounded-md border border-muted bg-background p-3 text-sm">
                <p className="mb-2">
                  Once you submit your order, you'll receive a payment notification on your MBWay app. 
                  You'll have 5 minutes to approve the payment.
                </p>
                <p className="text-xs font-medium mb-1">Make sure:</p>
                <ul className="text-xs list-disc pl-4 space-y-1">
                  <li>Your phone number is correctly entered</li>
                  <li>You have the MBWay app installed and configured</li>
                  <li>Your phone is nearby to approve the payment</li>
                </ul>
              </div>
              
              <div>
                <FormLabel htmlFor="mbwayPhone">MBWay Phone Number</FormLabel>
                <Input 
                  id="mbwayPhone"
                  placeholder="9XX XXX XXX" 
                  value={mbwayPhone}
                  onChange={handlePhoneChange}
                  maxLength={11} // 9 digits + 2 spaces
                />
                {phoneError && (
                  <p className="text-[0.8rem] font-medium text-destructive mt-1">{phoneError}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the phone number associated with your MBWay account
                </p>
              </div>
            </div>
          )}

          <div className="sticky bottom-0 left-0 right-0 py-4 bg-background border-t mt-8 -mx-6 px-6">
            <div className="flex flex-col md:flex-row gap-3 w-full">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                className="w-full md:w-auto order-2 md:order-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shipping
              </Button>

              <Button 
                type="button"
                onClick={handleContinueClick}
                className="w-full md:w-auto order-1 md:order-2"
              >
                Continue to Review <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}