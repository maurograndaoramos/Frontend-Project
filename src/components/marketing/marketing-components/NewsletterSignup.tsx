// src/components/marketing/NewsletterSignup.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call an API to handle the subscription
    console.log("Email submitted:", email);
    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Mail className="h-12 w-12 mx-auto mb-4 text-primary-foreground/80" />
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-primary-foreground/90 mb-8">
            Stay updated with new products, seasonal collections and exclusive offers.
          </p>

          {isSubmitted ? (
            <div className="bg-white/10 rounded-lg p-6 text-primary-foreground">
              <p className="font-medium mb-2">Thank you for subscribing!</p>
              <p>We've sent a confirmation email to your inbox.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button type="submit" variant="secondary" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}