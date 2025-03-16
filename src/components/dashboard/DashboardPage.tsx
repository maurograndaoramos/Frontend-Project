"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Package, ShoppingBag, UserCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // Mock data - in a real app, this would come from an API or context
  const recentOrders = [
    { id: "ORD-001", date: "March 14, 2025", status: "Delivered", total: "$120.50" },
    { id: "ORD-002", date: "March 8, 2025", status: "Processing", total: "$75.20" },
    { id: "ORD-003", date: "February 27, 2025", status: "Shipped", total: "$240.00" },
  ];

  const user = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    joinDate: "January 2025",
    id: "12345",
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* User Profile Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Account</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <UserCircle className="h-12 w-12 text-primary mr-4" />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
                <Link href={`/dashboard/${user.name.toLowerCase().replace(/\s+/g, '-')}/profile`}>Manage Profile</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Orders</CardTitle>
            <CardDescription>Your order history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <ShoppingBag className="h-12 w-12 text-primary mr-4" />
              <div>
                <p className="font-medium">3 Orders</p>
                <p className="text-sm text-muted-foreground">Since {user.joinDate}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/orders">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Wishlist Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Wishlist</CardTitle>
            <CardDescription>Items you're interested in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <Package className="h-12 w-12 text-primary mr-4" />
              <div>
                <p className="font-medium">5 Items</p>
                <p className="text-sm text-muted-foreground">Save for later</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/wishlist">View Wishlist</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your order history for the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.date}</p>
                </div>
                <div className="flex items-center">
                  <Badge 
                    variant={
                      order.status === "Delivered" ? "default" : 
                      order.status === "Processing" ? "outline" : "secondary"
                    }
                    className="mr-4"
                  >
                    {order.status}
                  </Badge>
                  <p className="font-medium mr-4">{order.total}</p>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}