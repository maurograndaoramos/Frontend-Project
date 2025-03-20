"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cart } = useCart();
  const router = useRouter();
  
  // Redirect to the cart if there are no items
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/shop");
    }
  }, [cart.items.length, router]);

  return (
    <div className="min-h-screen bg-muted/30 py-10">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <Link href="/shop" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Shopping
          </Link>
          <h1 className="text-2xl font-bold ml-auto">Checkout</h1>
        </div>

        {children}
      </div>
    </div>
  );
}