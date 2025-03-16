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
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Order History</h1>
          <p className="text-muted-foreground">View and track your orders</p>
        </div>
        <Button onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>My Orders</CardTitle>
              <CardDescription>
                You have placed {orders.length} orders
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className="w-[180px]">
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
              <Button variant="outline" size="icon" className="h-9 w-9">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No orders found</h3>
              <p className="text-muted-foreground text-center mt-2">
                {filterStatus === "all" 
                  ? "You haven't placed any orders yet." 
                  : `You don't have any ${filterStatus} orders.`}
              </p>
              {filterStatus !== "all" && (
                <Button 
                  variant="outline" 
                  className="mt-4"
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
                        <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => toggleOrderDetails(order.id)}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Badge variant={getBadgeVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.total}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleOrderDetails(order.id);
                              }}
                            >
                              <ChevronDown 
                                className={`h-4 w-4 transition-transform ${
                                  expandedOrder === order.id ? "rotate-180" : ""
                                }`} 
                              />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedOrder === order.id && (
                        <TableRow>
                          <TableCell colSpan={5} className="p-0">
                            <div className="bg-muted/30 p-4 px-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <h4 className="text-sm font-semibold mb-2">Shipping Address</h4>
                                  <p className="text-sm">{order.address}</p>
                                </div>
                                {order.trackingNumber && (
                                  <div>
                                    <h4 className="text-sm font-semibold mb-2">Tracking Number</h4>
                                    <p className="text-sm font-mono">{order.trackingNumber}</p>
                                  </div>
                                )}
                              </div>
                              <h4 className="text-sm font-semibold mb-2">Order Items</h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead className="text-right">Subtotal</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.items.map((item, index) => (
                                    <TableRow key={`${order.id}-item-${index}`}>
                                      <TableCell>{item.name}</TableCell>
                                      <TableCell>{item.price}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell className="text-right">
                                        {`$${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}`}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                              <div className="flex justify-between items-center mt-4">
                                <Button variant="outline" size="sm">
                                  Need Help?
                                </Button>
                                {order.status === "Delivered" && (
                                  <Button size="sm">
                                    Write a Review
                                  </Button>
                                )}
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
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
}