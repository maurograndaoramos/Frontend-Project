// src/components/marketing/NewsletterSignup.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      // Here you would typically call an API to handle the subscription
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setIsSubmitted(true);
      setEmail("");
      toast.success("Successfully subscribed!", {
        description: "Thank you for joining our newsletter.",
      });
    } catch (error) {
      setError("Failed to subscribe. Please try again later.");
      toast.error("Subscription failed", {
        description: "There was an error processing your subscription.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full transform rotate-12" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full transform -rotate-12" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Mail className="h-12 w-12 mx-auto mb-4 text-primary-foreground/80" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl font-bold text-primary-foreground mb-4"
          >
            Subscribe to Our Newsletter
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-primary-foreground/90 mb-8"
          >
            Stay updated with new products, seasonal collections and exclusive offers.
          </motion.p>

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-primary-foreground"
              >
                <CheckCircle2 className="h-8 w-8 mx-auto mb-3 text-green-300" />
                <p className="font-medium mb-2">Thank you for subscribing!</p>
                <p className="text-primary-foreground/80">We've sent a confirmation email to your inbox.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <div className="relative flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    required
                    className={`bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 pr-10 ${
                      error ? 'border-red-300 focus-visible:ring-red-300' : ''
                    }`}
                  />
                  {error && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <AlertCircle className="h-4 w-4 text-red-300" />
                    </div>
                  )}
                </div>
                <Button 
                  type="submit" 
                  variant="secondary" 
                  className="whitespace-nowrap min-w-[120px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Subscribing...
                    </motion.div>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-300 text-sm mt-2 sm:mt-0 sm:absolute sm:bottom-0 sm:left-0 sm:translate-y-full"
                  >
                    {error}
                  </motion.p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}