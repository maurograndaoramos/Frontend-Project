"use client";

import * as React from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Key, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks/useToast";
import { motion } from "framer-motion";

const formSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawToken = searchParams.get("token");
  // Clean the token to handle any potential URL encoding or newline characters
  const token = rawToken?.replace(/\r?\n|\r/g, '')?.trim();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Verify the token
  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setIsVerifying(false);
        return;
      }

      setIsVerifying(true);
      try {
        // Make an API call to verify the token
        const response = await fetch(`/api/auth/verify-token?token=${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Invalid token');
        }
        
        setIsValidToken(true);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Invalid token",
          description: "This password reset link is invalid or has expired.",
        });
        setIsValidToken(false);
      } finally {
        setIsVerifying(false);
      }
    }

    verifyToken();
  }, [token, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) return;
    
    setIsLoading(true);
    
    try {
      // Call the API to reset the password
      const response = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      
      setIsSubmitted(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been reset. You can now log in with your new password.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to reset password",
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Show loading state
  if (isVerifying) {
    return (
      <div className="w-full text-center">
        <div className="inline-block animate-spin mb-4">
          <Key className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight mb-3">
          Verifying your reset link...
        </h1>
        <p className="text-sm text-muted-foreground">
          Please wait while we verify your password reset link.
        </p>
      </div>
    );
  }

  // Show invalid token state
  if (!token || !isValidToken) {
    return (
      <div className="w-full text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <h1 className="text-xl font-semibold tracking-tight mb-3">
          Invalid Reset Link
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          This password reset link is invalid or has expired.
        </p>
        <Button asChild>
          <Link href="/forgot-password">Request a new reset link</Link>
        </Button>
      </div>
    );
  }

  // Show success state
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full text-center space-y-4"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-xl font-semibold tracking-tight mb-3">
          Password Reset Successful
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Your password has been reset successfully. You can now log in with your new password.
        </p>
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
      </motion.div>
    );
  }

  // Show reset form
  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold tracking-tight mb-3 text-center">
        Reset Your Password
      </h1>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Please create a new password for your account.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </Button>

          <div className="text-center mt-4">
            <Link 
              href="/login" 
              className="text-sm text-primary hover:underline inline-flex items-center"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to Login
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="w-full text-center">
      <div className="inline-block animate-spin mb-4">
        <Key className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-xl font-semibold tracking-tight mb-3">
        Loading...
      </h1>
    </div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}