import 'server-only';
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcrypt";
import { CustomPrismaAdapter } from "@/lib/auth-adapter";
import { prisma } from "@/lib/prisma";

// Helper for determining the correct cookie domain - simplified for performance
const getCookieDomain = () => {
  // For simplicity and to avoid timeouts, don't use domain-specific cookies
  // This allows the browser to handle cookies normally for the current domain
  return undefined;
};

// Define the shape of your session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image?: string | null;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    email: string | null;
    name: string | null;
    accessToken?: string;
    provider?: string;
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
    async jwt({ token, user, account, trigger }) {
      if (trigger === "signIn" && user) {
        token.id = user.id as string;
        token.email = user.email as string;
        token.name = user.name as string;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle relative URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Handle absolute URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Default to base URL
      return baseUrl;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard') || 
                             nextUrl.pathname.startsWith('/admin') ||
                             nextUrl.pathname.startsWith('/checkout');
      
      if (isProtectedRoute) {
        return isLoggedIn;
      }

      return true;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
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