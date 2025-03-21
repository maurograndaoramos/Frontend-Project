"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronDown, Eye, RefreshCw, ShoppingBag } from "lucide-react";

// Sample order data (would come from API in a real app)
const orders = [
  {
    id: "ORD-001",
    date: "March 14, 2025",
    status: "Delivered",
    total: "$120.50",
    items: [
      { name: "Ceramic Plant Pot (Medium)", price: "$24.99", quantity: 2 },
      { name: "Ceramic Tea Kettle", price: "$70.52", quantity: 1 },
    ],
    address: "123 Main St, Anytown, CA 12345",
    trackingNumber: "TRK9876543210",
  },
  {
    id: "ORD-002",
    date: "March 8, 2025",
    status: "Processing",
    total: "$75.20",
    items: [
      { name: "Coffee Mug Set", price: "$35.99", quantity: 1 },
      { name: "Ceramic Serving Platter", price: "$39.21", quantity: 1 },
    ],
    address: "123 Main St, Anytown, CA 12345",
    trackingNumber: null,
  },
  {
    id: "ORD-003",
    date: "February 27, 2025",
    status: "Shipped",
    total: "$240.00",
    items: [
      { name: "Ceramic Dinner Set (4 Person)", price: "$199.99", quantity: 1 },
      { name: "Serving Spoons", price: "$40.01", quantity: 1 },
    ],
    address: "123 Main St, Anytown, CA 12345",
    trackingNumber: "TRK1234567890",
  },
  {
    id: "ORD-004",
    date: "February 12, 2025",
    status: "Delivered",
    total: "$89.95",
    items: [
      { name: "Glazed Flower Pots (3 Pack)", price: "$59.95", quantity: 1 },
      { name: "Plant Nutrients", price: "$15.00", quantity: 2 },
    ],
    address: "123 Main St, Anytown, CA 12345",
    trackingNumber: "TRK5678901234",
  },
  {
    id: "ORD-005",
    date: "January 30, 2025",
    status: "Delivered",
    total: "$129.99",
    items: [
      { name: "Decorative Wall Plates (Set of 4)", price: "$129.99", quantity: 1 },
    ],
    address: "123 Main St, Anytown, CA 12345",
    trackingNumber: "TRK0987654321",
  },
];

// Type for the Order details
interface OrderItem {
  name: string;
  price: string;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: string;
  items: OrderItem[];
  address: string;
  trackingNumber: string | null;
}

export default function OrdersPage() {
  const router = useRouter();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // Filter orders based on status
  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filterStatus.toLowerCase());

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Get badge variant based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Delivered":
        return "default";
      case "Shipped":
        return "secondary";
      case "Processing":
        return "outline";
      case "Cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Order History</h1>
          <p className="text-muted-foreground">View and track your orders</p>
        </div>
        <Button 
          onClick={() => router.push("/dashboard")}
          variant="outline"
          className="transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Back to Dashboard
        </Button>
      </div>

      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                My Orders
              </CardTitle>
              <CardDescription>
                You have placed {orders.length} orders
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className="w-[180px] transition-colors hover:border-primary">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium">No orders found</h3>
              <p className="text-muted-foreground text-center mt-2">
                {filterStatus === "all" 
                  ? "You haven't placed any orders yet." 
                  : `You don't have any ${filterStatus} orders.`}
              </p>
              {filterStatus !== "all" && (
                <Button 
                  variant="outline" 
                  className="mt-4 transition-colors hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setFilterStatus("all")}
                >
                  View All Orders
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <TableRow 
                        className="cursor-pointer transition-colors hover:bg-muted/50"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={getBadgeVariant(order.status)}
                            className="transition-colors"
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.total}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="transition-colors hover:bg-primary hover:text-primary-foreground"
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="transition-colors hover:bg-primary hover:text-primary-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleOrderDetails(order.id);
                              }}
                            >
                              <ChevronDown className={`h-4 w-4 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedOrder === order.id && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-muted/30">
                            <div className="py-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Order Items</h4>
                                  <div className="space-y-2">
                                    {order.items.map((item, index) => (
                                      <div key={index} className="flex justify-between text-sm">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>{item.price}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Shipping Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <p>{order.address}</p>
                                    {order.trackingNumber && (
                                      <p>Tracking: {order.trackingNumber}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}