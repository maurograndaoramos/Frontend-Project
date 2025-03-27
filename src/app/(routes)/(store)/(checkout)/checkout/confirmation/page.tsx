"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import OrderConfirmationPageContent from '@/components/checkout/ConfirmationContent';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  if (!orderId) {
    redirect('/shop');
  }
  
  return <OrderConfirmationPageContent orderId={orderId} />;
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading order details...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
} 