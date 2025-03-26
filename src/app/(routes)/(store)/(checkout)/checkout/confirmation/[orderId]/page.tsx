"use client";

import OrderConfirmationPageContent from '@/components/checkout/ConfirmationContent';

export default function OrderConfirmationByIdPage({
  params,
}: {
  params: { orderId: string }
}) {
  return <OrderConfirmationPageContent orderId={params.orderId} />;
} 