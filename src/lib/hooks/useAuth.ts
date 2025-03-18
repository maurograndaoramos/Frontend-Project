import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        setError(result.error);
        return false;
      }
      
      router.push("/dashboard");
      return true;
    } catch (err) {
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return {
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading" || isLoading,
    error,
    login,
    logout,
  };
}