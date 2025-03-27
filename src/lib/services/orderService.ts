// src/lib/services/orderService.ts
import { prisma } from '@/lib/prisma';
import { emailService } from './emailService';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email: string;
  phone: string;
  [key: string]: string; // Add index signature to satisfy Prisma's JSON type
}

interface OrderData {
  userId: string;
  items: OrderItem[];
  total: number;
  shippingAddress: ShippingAddress;
  status?: string;
  paymentMethod?: string;
  paymentIntent?: string;
}

export async function createOrder(orderData: OrderData) {
  try {
    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: orderData.userId,
        total: orderData.total,
        status: orderData.status || 'pending',
        shippingAddress: orderData.shippingAddress as any, // Type assertion to handle JSON field
        paymentIntent: orderData.paymentIntent,
        items: {
          create: orderData.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Calculate estimated delivery date (5 business days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    // Send order confirmation email
    await emailService.sendOrderConfirmation(
      { 
        email: orderData.shippingAddress.email,
        name: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`
      },
      {
        orderId: order.id,
        items: (order as any).items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: order.total,
        shippingAddress: order.shippingAddress as ShippingAddress,
        estimatedDelivery: estimatedDelivery.toLocaleDateString()
      }
    );

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
}

export async function getOrderById(orderId: string) {
  try {
    return await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order');
  }
}

export async function getUserOrders(userId: string) {
  try {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw new Error('Failed to fetch user orders');
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Send shipping confirmation email if status is 'shipped'
    if (status === 'shipped') {
      // Generate a mock tracking number
      const trackingNumber = `TRACK-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      
      // Calculate estimated delivery date (3 business days from now)
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
      
      const shippingAddress = updatedOrder.shippingAddress as any as ShippingAddress;
      
      await emailService.sendShippingConfirmation(
        {
          email: shippingAddress.email,
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`
        },
        {
          orderId: updatedOrder.id,
          trackingNumber,
          estimatedDelivery: estimatedDelivery.toLocaleDateString()
        }
      );
    }

    return updatedOrder;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
}

// Send promotional emails to all users or a segment of users
export async function sendPromotionalEmail(
  userIds: string[] | null, // null means send to all users
  promotionData: {
    subject: string;
    promotionName: string;
    promotionDetails: string;
    expiryDate?: string;
    promoCode?: string;
  }
) {
  try {
    // Get users to send the email to
    const users = await prisma.user.findMany({
      where: userIds ? { id: { in: userIds } } : {},
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    // Filter out users without emails
    const validUsers = users.filter(user => user.email);

    if (validUsers.length === 0) {
      return { success: false, message: 'No valid users found' };
    }

    // Format users for email service
    const emailRecipients = validUsers.map(user => ({
      email: user.email!,
      name: user.name || undefined
    }));

    // Send the promotional email
    const emailSent = await emailService.sendPromotionalEmail(
      emailRecipients,
      promotionData
    );

    return {
      success: emailSent,
      usersCount: validUsers.length,
      message: emailSent 
        ? `Promotional email sent to ${validUsers.length} users` 
        : 'Failed to send promotional email'
    };
  } catch (error) {
    console.error('Error sending promotional email:', error);
    throw new Error('Failed to send promotional email');
  }
}