"use client";

import CheckoutLayout from "@/components/layout/CheckoutLayout";

export default function CheckoutLayouts({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CheckoutLayout>
      {children}
    </CheckoutLayout>
  );
}