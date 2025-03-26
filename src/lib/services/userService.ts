import { prisma } from '@/lib/prisma';

interface ProfileData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
}

// Get user profile
export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        address: true,
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Return user data along with default notification preferences
    // In a real app, you might want to store these in a separate table
    return {
      ...user,
      notifications: {
        email: true,
        sms: false
      }
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
}

// Update user profile
export async function updateUserProfile(userId: string, data: ProfileData) {
  try {
    // Validate data
    if (data.email) {
      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: userId }
        }
      });

      if (existingUser) {
        throw new Error('Email is already in use');
      }
    }

    // Update user in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      }
    });

    return updatedUser;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// Update notification preferences
export async function updateNotificationPreferences(userId: string, preferences: NotificationPreferences) {
  try {
    // In a real app, this would update a separate notifications_preferences table
    // For now, we'll just return the preferences that were passed in
    
    // To properly implement this, you would create a NotificationPreference model in Prisma
    // and then use prisma.notificationPreference.upsert here
    
    return preferences;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw new Error('Failed to update notification preferences');
  }
} 