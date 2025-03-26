"use client";

import { useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import OrderConfirmationPageContent from '@/components/checkout/ConfirmationContent';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  if (!orderId) {
    redirect('/shop');
  }
  
  return <OrderConfirmationPageContent orderId={orderId} />;
} 