"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowRight, Calendar, Info, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";
import { addDays, format, isToday, isSaturday, isSunday } from "date-fns";
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';

// Dynamically import the GoogleAlgarveMap component with no SSR
// This is necessary because Google Maps requires browser APIs
const GoogleAlgarveMap = dynamic(
  () => import('./GoogleAlgarveMap'),
  { ssr: false }
);

// Custom FormDescriptionInline component to avoid nesting issues
const FormDescriptionInline = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <div
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescriptionInline.displayName = "FormDescriptionInline";

// List of Algarve municipalities
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

// National holidays in Portugal (2024)
const PORTUGAL_HOLIDAYS_2024 = [
  new Date(2024, 0, 1),  // New Year's Day
  new Date(2024, 1, 13), // Carnival
  new Date(2024, 2, 29), // Good Friday
  new Date(2024, 2, 31), // Easter
  new Date(2024, 3, 25), // Liberty Day
  new Date(2024, 4, 1),  // Labor Day
  new Date(2024, 5, 10), // Portugal Day
  new Date(2024, 5, 13), // Santo António
  new Date(2024, 7, 15), // Assumption Day
  new Date(2024, 9, 5),  // Republic Day
  new Date(2024, 10, 1), // All Saints' Day
  new Date(2024, 11, 1), // Independence Restoration Day
  new Date(2024, 11, 8), // Immaculate Conception
  new Date(2024, 11, 25) // Christmas Day
];

// Check if a date is a holiday
const isHoliday = (date: Date) => {
  return PORTUGAL_HOLIDAYS_2024.some(holiday => 
    holiday.getFullYear() === date.getFullYear() &&
    holiday.getMonth() === date.getMonth() &&
    holiday.getDate() === date.getDate()
  );
};

// Check if current time is before 2PM (14:00) Portugal time
const isBeforeCutoff = () => {
  const now = new Date();
  return now.getHours() < 14;
};

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(9, "Phone number must be at least 9 digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  municipality: z.string().min(1, "Municipality is required"),
  postalCode: z.string().min(8, "Postal code must be at least 8 characters"),
  deliveryDate: z.date().nullable(),
  deliveryNotes: z.string().optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  sameAsShipping: z.boolean().default(true),
  // Billing address fields
  billingFirstName: z.string().optional(),
  billingLastName: z.string().optional(),
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingMunicipality: z.string().optional(),
  billingPostalCode: z.string().optional(),
}).refine((data) => {
  // If sameAsShipping is false, all billing fields are required
  if (!data.sameAsShipping) {
    return data.billingFirstName && 
           data.billingLastName && 
           data.billingAddress && 
           data.billingCity && 
           data.billingMunicipality && 
           data.billingPostalCode;
  }
  return true;
}, {
  message: "All billing address fields are required when billing address is different from shipping address",
  path: ["billingFirstName"]
});

type ShippingFormValues = z.infer<typeof formSchema>;

interface ShippingFormProps {
  initialData?: Partial<ShippingFormValues>;
  onSubmit: (data: ShippingFormValues) => void;
}

export default function ShippingForm({
  initialData = {},
  onSubmit,
}: ShippingFormProps) {
  // Store delivery date
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(initialData.deliveryDate || null);
  
  // Initialize coordinates with undefined instead of null to match the type
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | undefined>(
    initialData.coordinates && 
    typeof initialData.coordinates.lat === 'number' && 
    typeof initialData.coordinates.lng === 'number' 
      ? initialData.coordinates as {lat: number, lng: number} 
      : undefined
  );
  
  // Add state for showing/hiding sections
  const [showMap, setShowMap] = useState(false);
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);
  
  // Check if same-day delivery is available
  const sameDayAvailable = isBeforeCutoff();
  
  // Define form
  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      address: initialData.address || "",
      city: initialData.city || "",
      municipality: initialData.municipality || "",
      postalCode: initialData.postalCode || "",
      deliveryDate: initialData.deliveryDate || undefined,
      deliveryNotes: initialData.deliveryNotes || "",
      coordinates: coordinates,
      sameAsShipping: initialData.sameAsShipping !== false,
      billingFirstName: initialData.billingFirstName || "",
      billingLastName: initialData.billingLastName || "",
      billingAddress: initialData.billingAddress || "",
      billingCity: initialData.billingCity || "",
      billingMunicipality: initialData.billingMunicipality || "",
      billingPostalCode: initialData.billingPostalCode || "",
    },
  });

  // Effect to handle delivery date changes
  useEffect(() => {
    if (deliveryDate) {
      form.setValue("deliveryDate", deliveryDate, { shouldValidate: false });
      
      // We no longer want to auto-submit the form when date is selected
      // Just update the form value
    }
  }, [deliveryDate, form]);

  // Calculate shipping cost based on selected date
  const getShippingCost = () => {
    if (!deliveryDate) return null;
    return isToday(deliveryDate) && sameDayAvailable ? 29.99 : 19.99;
  };

  // Get formatted delivery date for display
  const getFormattedDeliveryDate = () => {
    if (!deliveryDate) return null;
    return format(deliveryDate, 'EEEE, MMMM do, yyyy');
  };

  // Check if the delivery date is today
  const isDeliveryDateToday = () => {
    if (!deliveryDate) return false;
    return isToday(deliveryDate);
  };

  // Shipping cost based on selected date
  const shippingCost = getShippingCost();
  const formattedDeliveryDate = getFormattedDeliveryDate();
  const isDeliveryToday = isDeliveryDateToday();

  const handleLocationConfirmed = (coords: {lat: number, lng: number}) => {
    setCoordinates(coords);
    form.setValue('coordinates', coords);
    setShowDeliveryOptions(true);
  };

  const handleSaveAddress = async () => {
    // Trigger validation on the required shipping fields
    const result = await form.trigger([
      "firstName", 
      "lastName", 
      "email", 
      "phone", 
      "address", 
      "city", 
      "municipality", 
      "postalCode"
    ]);
    
    // Show the map regardless of validation
    setShowMap(true);
    
    // If billing address is different, validate those fields too
    if (!form.getValues().sameAsShipping) {
      form.trigger([
        "billingFirstName", 
        "billingLastName", 
        "billingAddress", 
        "billingCity",
        "billingMunicipality",
        "billingPostalCode"
      ]);
    }
  };

  const handleProceedToPayment = () => {
    const data = form.getValues();
    onSubmit({
      ...data,
      coordinates: coordinates,
      deliveryDate: deliveryDate
    });
  };

  return (
    <Form {...form}>
      <div className="space-y-8">
        {/* Shipping Information Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
            <p className="text-muted-foreground">
              Please provide your shipping details so we can deliver your flowers in the Algarve region.
            </p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="João" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@exemplo.pt" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="9XXXXXXXX or 2XXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua Principal, 123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Municipality</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select municipality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ALGARVE_MUNICIPALITIES.map((municipality) => (
                          <SelectItem key={municipality} value={municipality}>
                            {municipality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="8000-000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button 
                type="button" 
                onClick={handleSaveAddress}
              >
                Confirm Address
              </Button>
            </div>
          </form>
        </div>

        {/* Map Section - Moved above billing address */}
        {showMap && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Delivery Location</h2>
              <p className="text-muted-foreground">
                Please confirm your exact location on the map to ensure accurate delivery.
              </p>
            </div>
            
            <GoogleAlgarveMap 
              address={form.watch('address')}
              city={form.watch('city')}
              municipality={form.watch('municipality')}
              postalCode={form.watch('postalCode')}
              onLocationConfirmed={handleLocationConfirmed}
            />
          </div>
        )}

        {/* Billing Address Section - Moved below map */}
        <div>
          <FormField
            control={form.control}
            name="sameAsShipping"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Billing address is the same as shipping address
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          {!form.watch('sameAsShipping') && (
            <div className="mt-6 space-y-6">
              <h3 className="text-lg font-medium">Billing Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="billingFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="João" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="billingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua Principal, 123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="billingCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingMunicipality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Municipality</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select municipality" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ALGARVE_MUNICIPALITIES.map((municipality) => (
                            <SelectItem key={municipality} value={municipality}>
                              {municipality}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingPostalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="8000-000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </div>

        {/* Delivery Options Section */}
        {showDeliveryOptions && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Delivery Options</h2>
              <p className="text-muted-foreground">
                Choose your preferred delivery date and add any special instructions.
              </p>
            </div>

            <div className="space-y-6">
              <div className="rounded-md border p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium text-sm">Select Your Delivery Date</h4>
                    <p className="text-muted-foreground text-xs mt-1">
                      We deliver Monday-Friday, excluding holidays
                    </p>
                  </div>
                  
                  {shippingCost && (
                    <span className="font-medium text-sm">
                      {shippingCost === 29.99 ? "€29.99" : "€19.99"}
                    </span>
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          setDate={(date) => setDeliveryDate(date)}
                          placeholderText="Select delivery date"
                          disablePastDates={true}
                          disableWeekends={true}
                          disabledDates={PORTUGAL_HOLIDAYS_2024}
                          isSameDay={true}
                        />
                      </FormControl>
                      
                      {formattedDeliveryDate && (
                        <div className="mt-2 p-2 bg-muted rounded-md">
                          <p className="text-sm font-medium flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                            Date selected: {formattedDeliveryDate}
                          </p>
                          <p className="text-xs mt-1">
                            Shipping method: {isDeliveryToday && sameDayAvailable ? 
                              "Same-day delivery (€29.99)" : 
                              "Standard delivery (€19.99)"}
                          </p>
                        </div>
                      )}
                      
                      <FormDescriptionInline className="mt-2">
                        <span className="flex flex-col space-y-1 text-xs">
                          <span className="flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                            <span>Same day delivery before 2PM: <strong>€29.99</strong></span>
                          </span>
                          <span className="flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                            <span>Any other date: <strong>€19.99</strong></span>
                          </span>
                        </span>
                      </FormDescriptionInline>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="deliveryNotes"
                render={({ field }) => (
                  <FormItem className="border p-4 rounded-md bg-muted/20">
                    <FormLabel className="text-lg font-medium">Delivery Notes (Optional)</FormLabel>
                    <p className="text-muted-foreground text-sm mb-3">
                      Help us deliver your flowers perfectly by providing additional details
                    </p>
                    <FormControl>
                      <Textarea
                        placeholder="Add special instructions for delivery (e.g., gate code, delivery preferences, specific location details)"
                        className="resize-none min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={handleProceedToPayment}
                  disabled={!deliveryDate}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Form>
  );
}