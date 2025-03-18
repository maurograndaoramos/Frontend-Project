"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export default function AuthStatus() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  useEffect(() => {
    // Show welcome toast on first load after login
    if (pathname === "/dashboard" && status === "authenticated" && session?.user) {
      toast({
        title: `Welcome, ${session.user.name || "there"}!`,
        description: "You've successfully signed in to your account.",
      });
    }
  }, [pathname, status, session]);
  
  return null; // This component doesn't render anything
}