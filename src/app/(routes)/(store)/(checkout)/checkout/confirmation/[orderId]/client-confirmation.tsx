"use client";

import OrderConfirmationPageContent from '@/components/checkout/ConfirmationContent';

export default function ClientOrderConfirmation({ orderId }: { orderId: string }) {
  return <OrderConfirmationPageContent orderId={orderId} />;
} 