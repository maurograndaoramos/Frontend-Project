import { auth } from "@/auth";

/**
 * Example server component that uses the auth() function
 * to get the current session and display user information
 */
export async function ServerUserInfo() {
  const session = await auth();
  
  if (!session?.user) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
        <p className="text-yellow-700">
          You are not signed in. Please sign in to view this content.
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded">
      <h2 className="text-xl font-semibold mb-2">User Information (Server Component)</h2>
      <p><strong>Name:</strong> {session.user.name || 'Not provided'}</p>
      <p><strong>Email:</strong> {session.user.email}</p>
      <p><strong>User ID:</strong> {session.user.id}</p>
    </div>
  );
}

/**
 * Example function to check if a user has admin permissions
 * This can be used in server components or server actions
 */
export async function hasAdminPermission() {
  const session = await auth();
  
  // You would typically check a role field in your database
  // This is just a placeholder example
  return !!session?.user?.email?.includes('admin');
}

/**
 * Example of a protected server component
 * Only renders content if the user is authenticated
 */
export async function ProtectedServerComponent({ 
  children,
  fallback = <p>You need to be logged in to view this content</p>
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
} 