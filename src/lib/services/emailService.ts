// src/lib/services/emailService.ts

// In a real application, this would connect to a proper email sending service
// like SendGrid, AWS SES, or similar. For this example, we'll just simulate 
// sending emails with a function that logs the email content.

interface EmailConfig {
    from?: string;
    replyTo?: string;
    templateId?: string;
  }
  
  interface EmailAddress {
    email: string;
    name?: string;
  }
  
  interface EmailOptions {
    to: EmailAddress | EmailAddress[];
    subject: string;
    templateId?: string;
    templateData?: Record<string, any>;
    text?: string;
    html?: string;
  }
  
  const DEFAULT_CONFIG: EmailConfig = {
    from: 'orders@bloomingdelights.com',
    replyTo: 'support@bloomingdelights.com',
  };
  
  /**
   * Email service for sending transactional and promotional emails
   */
  export class EmailService {
    private config: EmailConfig;
  
    constructor(config: EmailConfig = {}) {
      this.config = { ...DEFAULT_CONFIG, ...config };
    }
  
    /**
     * Send an email
     */
    async sendEmail(options: EmailOptions): Promise<boolean> {
      try {
        // In a real app, this would call an email API
        console.log('Sending email:', {
          from: this.config.from,
          replyTo: this.config.replyTo,
          ...options,
        });
        
        // Simulate successful email sending
        return true;
      } catch (error) {
        console.error('Failed to send email:', error);
        return false;
      }
    }
  
    /**
     * Send order confirmation email
     */
    async sendOrderConfirmation(
      to: EmailAddress,
      orderData: {
        orderId: string;
        items: any[];
        total: number;
        shippingAddress: any;
        estimatedDelivery: string;
      }
    ): Promise<boolean> {
      return this.sendEmail({
        to,
        subject: `Your Blooming Delights Order Confirmation #${orderData.orderId}`,
        templateId: 'order-confirmation',
        templateData: {
          firstName: to.name?.split(' ')[0] || 'there',
          ...orderData,
        },
        // Fallback text email if template is not available
        text: `
          Thank you for your order, ${to.name || 'there'}!
          
          Your order #${orderData.orderId} has been received and is being processed.
          
          Order Total: $${orderData.total.toFixed(2)}
          Estimated Delivery: ${orderData.estimatedDelivery}
          
          You can view your order details at: https://bloomingdelights.com/orders/${orderData.orderId}
          
          Thank you for shopping with Blooming Delights!
        `,
      });
    }
    
    /**
     * Send shipping confirmation email
     */
    async sendShippingConfirmation(
      to: EmailAddress,
      orderData: {
        orderId: string;
        trackingNumber: string;
        estimatedDelivery: string;
      }
    ): Promise<boolean> {
      return this.sendEmail({
        to,
        subject: `Your Blooming Delights Order #${orderData.orderId} Has Shipped!`,
        templateId: 'shipping-confirmation',
        templateData: {
          firstName: to.name?.split(' ')[0] || 'there',
          ...orderData,
        },
        // Fallback text email if template is not available
        text: `
          Good news, ${to.name || 'there'}!
          
          Your order #${orderData.orderId} has shipped and is on its way to you.
          
          Tracking Number: ${orderData.trackingNumber}
          Estimated Delivery: ${orderData.estimatedDelivery}
          
          You can track your order at: https://bloomingdelights.com/orders/${orderData.orderId}
          
          Thank you for shopping with Blooming Delights!
        `,
      });
    }
    
    /**
     * Send promotional email
     */
    async sendPromotionalEmail(
      to: EmailAddress | EmailAddress[],
      data: {
        subject: string;
        promotionName: string;
        promotionDetails: string;
        expiryDate?: string;
        promoCode?: string;
      }
    ): Promise<boolean> {
      return this.sendEmail({
        to,
        subject: data.subject,
        templateId: 'promotional-email',
        templateData: {
          firstName: Array.isArray(to) ? 'there' : (to.name?.split(' ')[0] || 'there'),
          ...data,
        },
        // Fallback text email if template is not available
        text: `
          Hello ${Array.isArray(to) ? 'there' : (to.name || 'there')}!
          
          ${data.promotionName}
          
          ${data.promotionDetails}
          ${data.promoCode ? `Use code: ${data.promoCode} at checkout` : ''}
          ${data.expiryDate ? `Offer expires: ${data.expiryDate}` : ''}
          
          Shop now: https://bloomingdelights.com/shop
          
          To unsubscribe from promotional emails, click here: https://bloomingdelights.com/unsubscribe
        `,
      });
    }
    
    /**
     * Send wishlist reminder email
     */
    async sendWishlistReminder(
      to: EmailAddress,
      wishlistData: {
        items: { name: string; id: string; inStock: boolean }[];
      }
    ): Promise<boolean> {
      const itemsInStock = wishlistData.items.filter(item => item.inStock);
      
      if (itemsInStock.length === 0) {
        return false; // No in-stock items to remind about
      }
      
      return this.sendEmail({
        to,
        subject: `Items in Your Wishlist Are Waiting for You!`,
        templateId: 'wishlist-reminder',
        templateData: {
          firstName: to.name?.split(' ')[0] || 'there',
          items: itemsInStock,
        },
        // Fallback text email if template is not available
        text: `
          Hello ${to.name || 'there'}!
          
          Just a friendly reminder that you have ${itemsInStock.length} items in your wishlist:
          
          ${itemsInStock.map(item => `- ${item.name}`).join('\n')}
          
          These items are currently in stock and ready to be added to your home.
          
          Visit your wishlist: https://bloomingdelights.com/wishlist
          
          Thank you for your interest in Blooming Delights!
        `,
      });
    }
  
    /**
     * Send welcome email after registration
     */
    async sendWelcomeEmail(to: EmailAddress): Promise<boolean> {
      return this.sendEmail({
        to, 
        subject: 'Welcome to Blooming Delights!',
        templateId: 'welcome-email',
        templateData: {
          firstName: to.name?.split(' ')[0] || 'there',
        },
        // Fallback text email if template is not available
        text: `
          Welcome to Blooming Delights, ${to.name || 'there'}!
          
          Thank you for creating an account with us. We're excited to have you join our community of floral enthusiasts.
          
          As a new member, you'll enjoy:
          - Special offers and promotions
          - Early access to seasonal collections
          - Personalized product recommendations
          
          Start exploring our collections: https://bloomingdelights.com/shop
          
          If you have any questions, our customer service team is always here to help.
          
          Happy shopping!
          The Blooming Delights Team
        `,
      });
    }
  }
  
  // Export a singleton instance for use throughout the application
  export const emailService = new EmailService();