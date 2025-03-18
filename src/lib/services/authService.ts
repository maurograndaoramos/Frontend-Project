import { signIn } from "next-auth/react";

export const loginUser = async (email: string, password: string) => {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    return { success: !result?.error, error: result?.error };
  } catch (error) {
    return { success: false, error: "Authentication failed" };
  }
};