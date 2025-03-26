"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-8 px-4"
    >
      {/* Dashboard header with animation */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 p-6 bg-primary/10 rounded-lg border border-primary/20 backdrop-blur-sm shadow-sm"
      >
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-medium text-primary flex items-center gap-2 text-lg"
        >
          <Heart className="h-5 w-5 text-primary animate-pulse" />
          Valentine's Day Promotion
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground mt-1"
        >
          Order by February 7th for guaranteed delivery before Valentine's Day!
        </motion.p>
      </motion.div>

      {/* Main content area with animation */}
      <motion.main 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card rounded-lg border shadow-sm p-6"
      >
        {children}
      </motion.main>
    </motion.div>
  );
}