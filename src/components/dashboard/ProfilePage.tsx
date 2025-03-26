"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserCircle, Loader2, Camera, Bell, MessageSquare, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useSession } from "next-auth/react";

// Define interfaces for our data structure
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordEmailSent, setPasswordEmailSent] = useState(false);
  
  // User data state
  const [user, setUser] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(user);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    sms: false,
  });

  // Fetch user data
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }

    console.log("Session data:", session);

    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/users/profile');
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        console.log("API Response:", data);
        
        setUser({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
        
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
        
        if (data.notifications) {
          setNotifications({
            email: data.notifications.email ?? true,
            sms: data.notifications.sms ?? false,
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("Could not load profile data");
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [session, status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      const updatedUser = await response.json();
      setUser({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
      });
      
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const handleImageUpload = async () => {
    setIsUploading(true);
    try {
      // In a real implementation, you would use FormData to upload the image
      // For now, we'll simulate a successful upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Profile picture updated successfully");
    } catch (error) {
      toast.error("Failed to update profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleNotification = async (type: 'email' | 'sms') => {
    const newSettings = {
      ...notifications,
      [type]: !notifications[type]
    };
    
    setNotifications(newSettings);
    
    try {
      const response = await fetch('/api/users/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }
      
      toast.success("Notification settings updated");
    } catch (error) {
      // Revert state if failed
      setNotifications(notifications);
      toast.error("Failed to update notification settings");
    }
  };

  const handleChangePassword = async () => {
    setIsChangingPassword(true);
    
    try {
      // Call the API to send a reset email
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }
      
      setPasswordEmailSent(true);
      toast.success("Password reset email sent successfully");
    } catch (error) {
      toast.error("Failed to send password reset email");
    } finally {
      setIsChangingPassword(false);
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-24 w-24 rounded-full mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
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
            Profile Settings
          </h1>
          <p className="text-muted-foreground">Manage your account details</p>
        </div>
        <Button 
          onClick={() => router.back()}
          variant="outline"
          className="transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
        >
          Back to Dashboard
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1"
        >
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                  >
                    {session?.user?.image ? (
                      <img 
                        src={session.user.image}
                        alt={user.name || "User"}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="h-20 w-20 text-primary" />
                    )}
                  </motion.div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                    onClick={handleImageUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                  onClick={handleChangePassword}
                  disabled={isChangingPassword || passwordEmailSent}
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : passwordEmailSent ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Email Sent
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 space-y-6"
        >
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your account details</CardDescription>
              <p className="text-xs text-muted-foreground mt-1">
                Note: In this demo, profile changes are saved for the current session only
              </p>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {!isEditing ? (
                  <Button 
                    type="button" 
                    onClick={() => setIsEditing(true)}
                    className="transition-all duration-300 hover:bg-primary/90 hover:shadow-md"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                      className="transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSaving}
                      className="transition-all duration-300 hover:bg-primary/90 hover:shadow-md"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </>
                )}
              </CardFooter>
            </form>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Settings
              </CardTitle>
              <CardDescription>Manage how we contact you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive updates about your orders and account</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={() => toggleNotification('email')}
                    className="transition-all duration-300"
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-muted-foreground">Get text messages about order status</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={() => toggleNotification('sms')}
                    className="transition-all duration-300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}