"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, ArrowRight, CreditCard, Wallet } from "lucide-react";
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
  method: z.enum(["credit-card", "paypal"]),
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
  const [paymentMethod, setPaymentMethod] = useState(initialData.method || "credit-card");

  // Define form
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      method: initialData.method || "credit-card",
      cardHolder: initialData.cardHolder || "",
      cardNumber: initialData.cardNumber || "",
      expiryDate: initialData.expiryDate || "",
      cvv: initialData.cvv || "",
    },
  });

  const handleSubmit = (data: PaymentFormValues) => {
    onSubmit(data);
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
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      setPaymentMethod(value as "credit-card" | "paypal");
                    }}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <div className="flex-1">
                        <label
                          htmlFor="credit-card"
                          className="font-medium text-sm cursor-pointer flex items-center"
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Credit or Debit Card
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Pay with your credit or debit card
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <div className="h-6 w-10 rounded border flex items-center justify-center bg-white">
                          <Image
                            src="/api/placeholder/40/25"
                            width={28}
                            height={18}
                            alt="Visa"
                          />
                        </div>
                        <div className="h-6 w-10 rounded border flex items-center justify-center bg-white">
                          <Image
                            src="/api/placeholder/40/25"
                            width={28}
                            height={18}
                            alt="Mastercard"
                          />
                        </div>
                        <div className="h-6 w-10 rounded border flex items-center justify-center bg-white">
                          <Image
                            src="/api/placeholder/40/25"
                            width={28}
                            height={18}
                            alt="Amex"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <div className="flex-1">
                        <label
                          htmlFor="paypal"
                          className="font-medium text-sm cursor-pointer flex items-center"
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          PayPal
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Pay with your PayPal account
                        </p>
                      </div>
                      <div className="h-6 w-16 rounded border flex items-center justify-center bg-white">
                        <Image
                          src="/api/placeholder/64/40"
                          width={48}
                          height={30}
                          alt="PayPal"
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
              <FormField
                control={form.control}
                name="cardHolder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cardholder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="1234 5678 9012 3456" 
                        {...field} 
                        onChange={(e) => {
                          // Format card number with spaces
                          const value = e.target.value.replace(/\s/g, '');
                          const formattedValue = value
                            .replace(/[^\d]/g, '')
                            .replace(/(.{4})/g, '$1 ')
                            .trim();
                          field.onChange(formattedValue);
                        }}
                        maxLength={19}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="MM/YY" 
                          {...field} 
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, '');
                            let formattedValue = value;
                            if (value.length > 2) {
                              formattedValue = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
                            }
                            field.onChange(formattedValue);
                          }}
                          maxLength={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123" 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, '');
                            field.onChange(value);
                          }}
                          maxLength={4}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div className="bg-muted/50 p-4 rounded-md">
              <p className="text-center text-muted-foreground mb-4">
                You will be redirected to PayPal to complete your payment after reviewing your order.
              </p>
              <div className="flex justify-center">
                <Image
                  src="/api/placeholder/200/60"
                  width={180}
                  height={50}
                  alt="PayPal"
                  className="h-12 w-auto"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shipping
            </Button>

            <Button type="submit">
              Continue to Review <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}