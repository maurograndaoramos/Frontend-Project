"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Package, ShoppingBag, UserCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (isLoading || !dashboardData) {
    return <div>Loading...</div>;
  }

  const { user, recentOrders, wishlistCount } = dashboardData;

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Summary */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              Account
            </CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <UserCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full transition-colors hover:bg-primary hover:text-primary-foreground" asChild>
              <Link href={`/dashboard/${user.name.toLowerCase().replace(/\s+/g, '-')}/profile`}>Manage Profile</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Orders
            </CardTitle>
            <CardDescription>Your order history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">{recentOrders.length} Orders</p>
                <p className="text-sm text-muted-foreground">Since {user.joinDate}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full transition-colors hover:bg-primary hover:text-primary-foreground" asChild>
              <Link href={`/dashboard/${user.name.toLowerCase().replace(/\s+/g, '-')}/orders`}>View All Orders</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Wishlist Summary */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Wishlist
            </CardTitle>
            <CardDescription>Items you're interested in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">{wishlistCount} Items</p>
                <p className="text-sm text-muted-foreground">Save for later</p>
              </div>
            </div>
            <Button variant="outline" className="w-full transition-colors hover:bg-primary hover:text-primary-foreground" asChild>
              <Link href={`/dashboard/${user.name.toLowerCase().replace(/\s+/g, '-')}/wishlist`}>View Wishlist</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
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
            {recentOrders.map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between border-b pb-4 transition-colors hover:bg-muted/50 rounded-lg p-4"
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}