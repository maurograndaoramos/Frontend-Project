"use client";

import React from "react";
import { useState, useEffect } from "react";
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
import { 
  ChevronDown, 
  Eye, 
  RefreshCw, 
  ShoppingBag, 
  Loader2,
  Package,
  Truck,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

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
  const { data: session, status } = useSession();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Fetch orders from the API
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }
    
    fetchOrders();
  }, [session, status, router]);
  
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      
      // Transform the API response to match our Order interface
      const formattedOrders: Order[] = data.orders.map((order: any) => ({
        id: order.id,
        date: order.date,
        status: order.status,
        total: order.total,
        items: order.items.map((item: any) => ({
          name: item.product?.name || "Unknown Product",
          price: item.price,
          quantity: item.quantity
        })) || [],
        address: order.shippingAddress?.address || "No address provided",
        trackingNumber: order.trackingNumber || null,
      }));
      
      setOrders(formattedOrders);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error("Could not load orders");
      setIsLoading(false);
    }
  };
  
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchOrders();
      toast.success("Orders refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh orders");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Get badge variant and icon based on status
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Delivered":
        return { variant: "default" as const, icon: CheckCircle2 };
      case "Shipped":
        return { variant: "secondary" as const, icon: Truck };
      case "Processing":
        return { variant: "outline" as const, icon: Package };
      case "Cancelled":
        return { variant: "destructive" as const, icon: XCircle };
      default:
        return { variant: "outline" as const, icon: Package };
    }
  };

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
          <Skeleton className="h-10 w-32" />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-9 w-[180px]" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4">
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
            Order History
          </h1>
          <p className="text-muted-foreground">View and track your orders</p>
        </div>
        <Button 
          onClick={() => router.push("/dashboard")}
          variant="outline"
          className="transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
        >
          Back to Dashboard
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
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
                  <SelectTrigger className="w-[180px] transition-all duration-300 hover:border-primary">
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
                  className="h-9 w-9 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {filteredOrders.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                  >
                    <ShoppingBag className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h3 className="text-lg font-medium">No orders found</h3>
                  <p className="text-muted-foreground text-center mt-2">
                    {filterStatus === "all" 
                      ? "You haven't placed any orders yet." 
                      : `You don't have any ${filterStatus} orders.`}
                  </p>
                  {filterStatus !== "all" && (
                    <Button 
                      variant="outline" 
                      className="mt-4 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                      onClick={() => setFilterStatus("all")}
                    >
                      View All Orders
                    </Button>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-x-auto"
                >
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
                      <AnimatePresence>
                        {filteredOrders.map((order, index) => (
                          <React.Fragment key={order.id}>
                            <motion.tr
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ delay: index * 0.1 }}
                              className="cursor-pointer transition-all duration-300 hover:bg-muted/50"
                              onClick={() => toggleOrderDetails(order.id)}
                            >
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.date}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={getStatusInfo(order.status).variant}
                                  className="flex items-center gap-1 transition-colors"
                                >
                                  {React.createElement(getStatusInfo(order.status).icon, {
                                    className: "h-3 w-3"
                                  })}
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{order.total}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </motion.tr>
                            <AnimatePresence>
                              {expandedOrder === order.id && (
                                <motion.tr
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <TableCell colSpan={5} className="p-0">
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      className="bg-muted/30 p-4"
                                    >
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="font-medium mb-2">Order Items</h4>
                                          <div className="space-y-2">
                                            {order.items.map((item, i) => (
                                              <div key={i} className="flex justify-between text-sm">
                                                <span>x {item.quantity} {item.name}</span>
                                                <span>{item.price}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="font-medium mb-2">Shipping Address</h4>
                                          <p className="text-sm text-muted-foreground">{order.address}</p>
                                        </div>
                                        {order.trackingNumber && (
                                          <div>
                                            <h4 className="font-medium mb-2">Tracking Number</h4>
                                            <p className="text-sm text-muted-foreground">{order.trackingNumber}</p>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  </TableCell>
                                </motion.tr>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}