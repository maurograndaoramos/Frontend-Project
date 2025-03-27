"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, ReactNode, useEffect } from "react";
import { useToast } from "@/lib/hooks/useToast";

interface QueryProviderProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const { toast } = useToast();
  
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
              if (failureCount >= 3) return false;
              
              if (
                error?.message?.includes('concurrent connections limit exceeded') ||
                error?.details?.includes('concurrent connections limit exceeded')
              ) {
                console.log(`Retrying database connection (attempt ${failureCount})`);
                return true;
              }
              
              return failureCount < 1;
            },
            retryDelay: (attemptIndex) => {
              return Math.min(1000 * 2 ** attemptIndex + Math.random() * 1000, 30000);
            },
          },
        },
      })
  );

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      
      if (
        event.reason?.message?.includes('concurrent connections limit exceeded') ||
        event.reason?.details?.includes('concurrent connections limit exceeded')
      ) {
        console.error('Database connection limit exceeded in unhandled rejection');
        toast({
          variant: "destructive",
          title: "Database connection error",
          description: "We're having trouble connecting to our database. Please try again later.",
        });
      }
    };
    
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [toast]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
} 