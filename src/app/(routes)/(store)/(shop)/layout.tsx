"use client";

import ShopLayout from "@/components/layout/ShopLayout";

export default function ShopLayouts({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ShopLayout>
      {children}
    </ShopLayout>
  );
}