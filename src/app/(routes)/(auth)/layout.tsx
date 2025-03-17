"use client";

import { Shield, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-muted/10 min-h-[calc(100vh-132px)] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-4">
        {/* Auth card with subtle shadow */}
        <div className="bg-card rounded-lg shadow-md p-6 sm:p-8">
          {/* Logo and brand section */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold">Mrs. Pots</span>
            </Link>
          </div>
          
          {/* The actual auth form from children */}
          {children}
          
          {/* Divider */}
          <Separator className="my-6" />
          
          {/* Security information */}
          <div className="text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-4 w-4 mr-1" />
              <span>Secure Authentication</span>
            </div>
            <p>
              We protect your personal information with industry-standard encryption.
            </p>
          </div>
        </div>
        
        {/* Help text */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center">
            <LockKeyhole className="h-4 w-4 mr-1" />
            <span>Having trouble signing in?</span>
          </div>
          <Link 
            href="/faq" 
            className="text-primary hover:underline mt-1 inline-block"
          >
            Visit our help center
          </Link>
        </div>
      </div>
    </div>
  );
}