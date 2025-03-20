// src/lib/services/wishlistService.ts
import { prisma } from '@/lib/prisma';
import { emailService } from './emailService';

export async function addToWishlist(userId: string, productId: string) {
  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    // Create or update wishlist item
    const wishlistItem = await prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId
        }
      },
      update: {}, // No updates needed if it exists
      create: {
        userId,
        productId
      }
    });
    
    return wishlistItem;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw new Error('Failed to add item to wishlist');
  }
}

export async function removeFromWishlist(userId: string, productId: string) {
  try {
    // Delete wishlist item if it exists
    await prisma.wishlistItem.deleteMany({
      where: {
        userId,
        productId
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw new Error('Failed to remove item from wishlist');
  }
}

export async function getUserWishlist(userId: string) {
  try {
    // Get all wishlist items for the user with product details
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return wishlistItems.map(item => ({
      id: item.id,
      productId: item.productId,
      product: item.product,
      addedAt: item.createdAt
    }));
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw new Error('Failed to fetch wishlist');
  }
}

export async function clearWishlist(userId: string) {
  try {
    // Delete all wishlist items for the user
    await prisma.wishlistItem.deleteMany({
      where: { userId }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    throw new Error('Failed to clear wishlist');
  }
}

export async function isInWishlist(userId: string, productId: string) {
  try {
    // Check if item exists in wishlist
    const item = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });
    
    return !!item; // Convert to boolean
  } catch (error) {
    console.error('Error checking wishlist:', error);
    throw new Error('Failed to check if item is in wishlist');
  }
}

export async function sendWishlistReminders() {
  try {
    // Get all users with items in their wishlist
    const usersWithWishlist = await prisma.user.findMany({
      where: {
        wishlistItems: {
          some: {
            product: {
              inStock: true
            }
          }
        }
      },
      include: {
        wishlistItems: {
          where: {
            product: {
              inStock: true
            }
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                inStock: true
              }
            }
          }
        }
      }
    });
    
    // Send reminder emails to each user
    const results = await Promise.all(
      usersWithWishlist.map(async (user) => {
        if (!user.email) return { userId: user.id, success: false, reason: 'No email' };
        
        const items = user.wishlistItems.map(item => ({
          id: item.product.id,
          name: item.product.name,
          inStock: item.product.inStock
        }));
        
        const emailSent = await emailService.sendWishlistReminder(
          {
            email: user.email,
            name: user.name || undefined
          },
          { items }
        );
        
        return {
          userId: user.id,
          success: emailSent,
          itemsCount: items.length
        };
      })
    );
    
    return {
      totalUsers: usersWithWishlist.length,
      emailsSent: results.filter(r => r.success).length,
      results
    };
  } catch (error) {
    console.error('Error sending wishlist reminders:', error);
    throw new Error('Failed to send wishlist reminders');
  }
}