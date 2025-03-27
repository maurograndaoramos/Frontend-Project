import { Suspense } from 'react';
import ClientOrderConfirmation from './client-confirmation';

export default function OrderConfirmationByIdPage({
  params,
}: {
  params: { orderId: string };
}) {
  return (
    <Suspense fallback={<div>Loading order details...</div>}>
      <ClientOrderConfirmation orderId={params.orderId} />
    </Suspense>
  );
} 