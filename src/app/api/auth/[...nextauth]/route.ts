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

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

import NextAuth from "next-auth/next";
import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcrypt";
import { CustomPrismaAdapter } from "@/lib/auth-adapter";

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
      
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
      
        if (!user || !user.hashedPassword) { 
          return null;
        }
      
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword 
        );
      
        if (!isPasswordValid) {
          return null;
        }
      
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user, account, profile, trigger, session }: { token: JWT; user?: any; account?: any; profile?: any; trigger?: any; session?: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async signIn({ user, account, profile, email, credentials }: any) {
      // NextAuth will automatically handle the OAuthAccountNotLinked error
      // when a user tries to sign in with a provider that doesn't match their existing account
      return true;
    },
  },
  events: {
    signIn: ({ user, account, isNewUser, profile }) => {
      // Event occurs on sign in
    }
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };