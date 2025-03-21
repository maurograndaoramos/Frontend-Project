"use client";

import AuthLayout from "@/components/layout/AuthLayout";

export default function AuthLayouts({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  );
}