"use client";

import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

/**
 * Example of using useSession hook with Next-Auth v5
 */
export function UserInfo() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  
  if (status === "unauthenticated") {
    return <div>Not signed in</div>;
  }
  
  return (
    <div>
      <p>Signed in as {session?.user?.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}

/**
 * Example login function using the Next-Auth v5 signIn method
 */
export async function login(
  email: string, 
  password: string, 
  rememberMe: boolean = false,
  callbackUrl: string = "/dashboard"
) {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });
    
    return result;
  } catch (error) {
    return { error: "Failed to sign in", ok: false };
  }
}

/**
 * Example sign out function using the Next-Auth v5 signOut method
 */
export async function logout(callbackUrl: string = "/") {
  try {
    await signOut({ callbackUrl, redirect: true });
  } catch (error) {
    // Silent fail for logout errors
  }
}

/**
 * Example OAuth login with Next-Auth v5
 */
export async function oauthLogin(provider: "google" | "facebook", callbackUrl: string = "/dashboard") {
  try {
    await signIn(provider, { callbackUrl });
  } catch (error) {
    // Silent fail for OAuth errors
  }
} 