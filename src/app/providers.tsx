"use client";

import { ThemeProvider } from "@/components/layout/Theme-Provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/lib/context/CartContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import QueryProvider from "@/lib/providers/QueryProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <WishlistProvider>
              <Toaster />
              {children}
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  );
}