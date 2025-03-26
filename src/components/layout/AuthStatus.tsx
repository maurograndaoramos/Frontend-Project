"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function AuthStatus() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  
  useEffect(() => {
    // Check session storage to see if we've already shown the welcome toast
    const hasShownWelcomeToast = sessionStorage.getItem('hasShownWelcomeToast');
    
    // Only show welcome toast if we haven't shown it yet during this session
    if (pathname === "/dashboard" && status === "authenticated" && session?.user && !hasShownWelcomeToast) {
      toast({
        title: `Welcome, ${session.user.name || "there"}!`,
        description: "You've successfully signed in to your account.",
      });
      
      // Mark that we've shown the welcome toast for this session
      sessionStorage.setItem('hasShownWelcomeToast', 'true');
      setHasShownWelcome(true);
    }
  }, [pathname, status, session]);
  
  return null; // This component doesn't render anything
}