import 'server-only';
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcrypt";
import { CustomPrismaAdapter } from "@/lib/auth-adapter";
import { prisma } from "@/lib/prisma";

// Helper for determining the correct cookie domain
const getCookieDomain = () => {
  // In development, we don't need a domain specified (defaults to current domain)
  if (process.env.NODE_ENV !== "production") {
    return undefined;
  }
  
  // In production, let's check for the app URL
  const appUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    return undefined;
  }
  
  try {
    // Extract the domain from the URL
    const url = new URL(appUrl);
    const hostname = url.hostname;
    
    // Check if this is a vercel.app domain
    if (hostname.endsWith('vercel.app')) {
      return '.vercel.app';
    }
    
    // For custom domains, you can add more logic here
    // For example: if (hostname.endsWith('yourdomain.com')) return 'yourdomain.com';
    
    // By default, return the hostname without subdomain
    const parts = hostname.split('.');
    if (parts.length > 2) {
      // This handles subdomains by returning only the main domain
      return parts.slice(-2).join('.');
    }
    
    return hostname;
  } catch (error) {
    console.error('Error parsing app URL for cookie domain:', error);
    return undefined;
  }
};

// Define the shape of your session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
  }
}

// Define the shape of your user
export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
};

// Set up NextAuth configuration
export const authConfig = {
  adapter: CustomPrismaAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
      
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });
      
        if (!user || !user.hashedPassword) { 
          return null;
        }
      
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword.toString()
        );
      
        if (!isPasswordValid) {
          return null;
        }
      
        return user;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnCheckout = nextUrl.pathname.startsWith('/checkout');
      
      if (isOnAdmin) {
        // Only admin users can access admin pages - you'll need to implement
        // a check on the user role when you have that field in your schema
        return isLoggedIn; // For now just checks if logged in
      }
      
      if (isOnDashboard || isOnCheckout) {
        return isLoggedIn;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: getCookieDomain(),
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: getCookieDomain(),
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: getCookieDomain(),
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
  trustHost: true,
} satisfies NextAuthConfig;

// Export NextAuth handlers and helpers
export const { 
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth(authConfig); 