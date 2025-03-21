"use client";

import MarketingLayout from "@/components/layout/MarketingLayout";

export default function MarketingLayouts({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <MarketingLayout>
      {children}
    </MarketingLayout>
  );
}