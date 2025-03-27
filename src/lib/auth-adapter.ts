import type { Adapter } from '@auth/core/adapters';
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

// This adapter extends the PrismaAdapter to work with our existing Prisma schema
// No need to pass prisma as a parameter since we import it directly
export function CustomPrismaAdapter(): Adapter {
  const baseAdapter = PrismaAdapter(prisma);
  
  return {
    ...baseAdapter,
    async linkAccount(data: any) {
      // Map NextAuth field names to our schema names
      const mappedData = {
        userId: data.userId,
        providerType: data.type,
        providerId: data.provider,
        providerAccountId: data.providerAccountId,
        refreshToken: data.refresh_token,
        accessToken: data.access_token,
        accessTokenExpires: data.expires_at ? new Date(data.expires_at * 1000) : null,
      };

      return prisma.account.create({ data: mappedData }) as any;
    },
    async getAccount(params: any) {
      return prisma.account.findUnique({
        where: {
          providerId_providerAccountId: {
            providerId: params.provider,
            providerAccountId: params.providerAccountId,
          },
        },
      }) as any;
    },
    async getUserByAccount(params: any) {
      const account = await prisma.account.findUnique({
        where: {
          providerId_providerAccountId: {
            providerId: params.provider,
            providerAccountId: params.providerAccountId,
          },
        },
        include: { user: true },
      });
      
      return (account?.user || null) as any;
    },
  } as Adapter;
} 