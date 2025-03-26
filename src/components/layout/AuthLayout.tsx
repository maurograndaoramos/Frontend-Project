"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield, LockKeyhole, Flower2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[calc(100vh-132px)] py-8 md:py-12 flex flex-col justify-center"
    >
      <div className="mx-auto w-full max-w-md px-4">
        {/* Seasonal background decoration with animations */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 overflow-hidden -z-10"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary"
          />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-primary"
          />
        </motion.div>

        {/* Auth card with improved styling and animations */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-xl border shadow-lg overflow-hidden backdrop-blur-sm bg-opacity-95"
        >
          <div className="p-6 sm:p-8">
            {/* Logo and brand section with animations */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-6"
            >
              <Link href="/" className="inline-block group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-32 h-32 mx-auto mb-2 rounded-full bg-accent/50 flex items-center justify-center p-4">
                    <Image 
                      src="/flower-shop-logo.svg" 
                      alt="Blooming Delights" 
                      width={80} 
                      height={80} 
                      className="mx-auto"
                    />
                  </div>
                  <motion.span 
                    className="text-2xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Blooming Delights
                  </motion.span>
                </motion.div>
              </Link>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-muted-foreground mt-2"
              >
                Beautiful floral arrangements for every occasion
              </motion.p>
            </motion.div>
            
            {/* The actual auth form from children */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {children}
            </motion.div>
            
            {/* Divider with animation */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Separator className="my-6" />
            </motion.div>
            
            {/* Security information with animations */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center text-xs text-muted-foreground"
            >
              <motion.div 
                className="flex items-center justify-center mb-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Shield className="h-3 w-3 mr-1" />
                <span>Secure Authentication</span>
              </motion.div>
              <p>
                Your personal information is protected with industry-standard encryption.
              </p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Help text with animations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          <motion.div 
            className="flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <LockKeyhole className="h-3 w-3 mr-1" />
            <span>Having trouble signing in?</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link 
              href="/faq" 
              className="text-primary hover:underline mt-1 inline-block group"
            >
              <span className="flex items-center justify-center">
                Visit our help center
                <Flower2 className="h-3 w-3 ml-1 transition-transform group-hover:rotate-12" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}