"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Package, ShoppingBag, UserCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface Order {
  id: string;
  date: string;
  status: "Delivered" | "Processing" | "Shipped";
  total: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
}

interface DashboardData {
  user: User;
  recentOrders: Order[];
  wishlistCount: number;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  
  const username = session?.user?.name?.toLowerCase().replace(/\s+/g, '-') || '';

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto py-8 px-4 space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-6 w-64" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Skeleton className="h-12 w-12 rounded-full mr-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-1" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!dashboardData) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto py-8 px-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-6"
        >
          <Package className="h-16 w-16 text-muted-foreground mx-auto" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-4">No Dashboard Data</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't load your dashboard data. Please try again later.
        </p>
        <Button onClick={() => window.location.reload()}>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Retry
        </Button>
      </motion.div>
    );
  }

  const { user, recentOrders, wishlistCount } = dashboardData;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-8 px-4 space-y-8"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="transition-all duration-300 hover:shadow-lg group">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                Account
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                  <UserCircle className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground group-hover:shadow-md" 
                asChild
              >
                <Link href={`/dashboard/${username}/profile`}>
                  Manage Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="transition-all duration-300 hover:shadow-lg group">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Orders
              </CardTitle>
              <CardDescription>Your order history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{recentOrders.length} Orders</p>
                  <p className="text-sm text-muted-foreground">Since {user.joinDate}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground group-hover:shadow-md" 
                asChild
              >
                <Link href={`/dashboard/${username}/orders`}>
                  View All Orders
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wishlist Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="transition-all duration-300 hover:shadow-lg group">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Wishlist
              </CardTitle>
              <CardDescription>Items you're interested in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{wishlistCount} Items</p>
                  <p className="text-sm text-muted-foreground">Save for later</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground group-hover:shadow-md" 
                asChild
              >
                <Link href={`/dashboard/${username}/wishlist`}>
                  View Wishlist
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Recent Orders
            </CardTitle>
            <CardDescription>Your order history for the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AnimatePresence>
                {recentOrders.map((order, index) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between border-b pb-4 transition-all duration-300 hover:bg-muted/50 rounded-lg p-4 group"
                  >
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge 
                        variant={
                          order.status === "Delivered" ? "default" : 
                          order.status === "Processing" ? "outline" : "secondary"
                        }
                        className="transition-colors"
                      >
                        {order.status}
                      </Badge>
                      <p className="font-medium">{order.total}</p>
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}