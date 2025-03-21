"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield, LockKeyhole } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[calc(100vh-132px)] py-8 md:py-12 flex flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-4">
        {/* Seasonal background decoration - can be swapped for different seasons */}
        <div className="absolute inset-0 overflow-hidden -z-10 opacity-5">
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary" />
          <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-primary" />
        </div>

        {/* Auth card with improved styling */}
        <div className="bg-card rounded-xl border shadow-lg overflow-hidden">

          <div className="p-6 sm:p-8">
            {/* Logo and brand section with larger sizing */}
            <div className="text-center mb-6">
              <Link href="/" className="inline-block">
                <Image 
                  src="/vercel.svg" 
                  alt="Mrs. Pots" 
                  width={120} 
                  height={40} 
                  className="mx-auto mb-2"
                />
                <span className="text-2xl font-bold">Mrs. Pots</span>
              </Link>
              <p className="text-sm text-muted-foreground mt-2">
                Beautiful floral arrangements for every occasion
              </p>
            </div>
            
            {/* The actual auth form from children */}
            {children}
            
            {/* Divider */}
            <Separator className="my-6" />
            
            {/* Security information */}
            <div className="text-center text-xs text-muted-foreground">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-3 w-3 mr-1" />
                <span>Secure Authentication</span>
              </div>
              <p>
                Your personal information is protected with industry-standard encryption.
              </p>
            </div>
          </div>
        </div>
        
        {/* Help text */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center">
            <LockKeyhole className="h-3 w-3 mr-1" />
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