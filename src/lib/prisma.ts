import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
  var prismaRead: PrismaClient | undefined;
}

// Configure Prisma write client (for mutations)
const createWriteClient = () => {
  const client = new PrismaClient({
    log: ['error'],
    // Add datasource configuration
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    }
  });

  // Add query event hooks to better handle connection issues
  client.$use(async (params, next) => {
    const { model, action } = params;
    const start = Date.now();
    
    try {
      const result = await next(params);
      
      // Log slow queries for optimization (over 500ms)
      const duration = Date.now() - start;
      if (duration > 500) {
        console.log(`[WRITE] Slow query (${duration}ms): ${model}.${action}`);
      }
      
      return result;
    } catch (error: any) {
      // Enhanced error logging and handling for connection issues
      if (error.message && error.message.includes('concurrent connections limit exceeded')) {
        console.error(`[WRITE] Database connection limit exceeded in ${model}.${action}`);
        // Add a delay before rejecting to help prevent rapid retries
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      throw error;
    }
  });
  
  return client;
};

// Configure Prisma read client (for queries)
const createReadClient = () => {
  const client = new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    }
  });

  // Add query event hooks
  client.$use(async (params, next) => {
    const { model, action } = params;
    // Skip if not a read operation
    if (!['findUnique', 'findFirst', 'findMany', 'count', 'aggregate', 'groupBy'].includes(action)) {
      return next(params);
    }
    
    const start = Date.now();
    
    try {
      const result = await next(params);
      
      // Log slow queries for optimization (over 500ms)
      const duration = Date.now() - start;
      if (duration > 500) {
        console.log(`[READ] Slow query (${duration}ms): ${model}.${action}`);
      }
      
      return result;
    } catch (error: any) {
      // Enhanced error logging and handling for connection issues
      if (error.message && error.message.includes('concurrent connections limit exceeded')) {
        console.error(`[READ] Database connection limit exceeded in ${model}.${action}`);
        // Add a delay before rejecting to help prevent rapid retries
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      throw error;
    }
  });
  
  return client;
};

// Create singleton instances to prevent multiple connections
export const prisma = global.prisma || createWriteClient();
export const prismaRead = global.prismaRead || createReadClient();

// Only set globals in non-production for HMR without connection leaks
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
  global.prismaRead = prismaRead;
}