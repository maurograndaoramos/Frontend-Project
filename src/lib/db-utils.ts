/**
 * Utility to retry database operations that fail due to connection limits
 * @param operation The database operation to retry
 * @param maxRetries Maximum number of retry attempts
 * @returns The result of the operation
 */
export const retryOnConnectionError = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> => {
  let lastError: any;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Only retry on connection limit errors
      if (
        error?.message?.includes('concurrent connections limit exceeded') ||
        error?.message?.includes('Connection pool timeout exceeded')
      ) {
        console.log(`Database connection limit reached. Retry attempt ${attempt}/${maxRetries}`);
        // Add exponential backoff delay between retries
        await new Promise(resolve => setTimeout(resolve, Math.min(100 * 2 ** attempt, 3000)));
        continue;
      }
      
      // For other errors, don't retry
      throw error;
    }
  }
  
  // If we've exhausted all retries
  throw lastError;
};

/**
 * Type-safe API error handler with specific error messages
 * @param error The error that was caught
 * @returns Object with status code and formatted error response
 */
export const handleApiError = (error: unknown) => {
  console.error("API Error:", error);
  
  // Default error response
  let statusCode = 500;
  let errorMessage = "An unexpected error occurred";
  let errorDetails = error instanceof Error ? error.message : "Unknown error";
  
  // Connection limit errors
  if (
    error instanceof Error && 
    (error.message.includes('concurrent connections limit exceeded') ||
     error.message.includes('Connection pool timeout exceeded'))
  ) {
    statusCode = 503; // Service Unavailable
    errorMessage = "Database service temporarily unavailable";
    errorDetails = "The database is experiencing high traffic. Please try again later.";
  }
  // Not found errors
  else if (error instanceof Error && error.message.includes('not found')) {
    statusCode = 404;
    errorMessage = "Resource not found";
  }
  // Validation errors
  else if (error instanceof Error && error.message.includes('validation')) {
    statusCode = 400;
    errorMessage = "Invalid request data";
  }
  
  return {
    status: statusCode,
    body: { 
      error: errorMessage,
      details: errorDetails,
      stack: process.env.NODE_ENV !== 'production' && error instanceof Error ? error.stack : undefined
    }
  };
};

/**
 * Create a simple in-memory cache for API responses
 */
export class SimpleCache {
  private cache = new Map<string, { data: any, timestamp: number }>();
  private ttl: number;
  private readonly name: string;
  
  constructor(ttlSeconds = 300, name = 'unnamed-cache') { // Default 5 minutes TTL
    this.ttl = ttlSeconds * 1000;
    this.name = name;
  }
  
  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    const isExpired = Date.now() - item.timestamp > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    console.log(`[CACHE HIT] ${this.name}: ${key}`);
    return item.data;
  }
  
  set(key: string, data: any) {
    console.log(`[CACHE SET] ${this.name}: ${key}`);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  invalidate(key: string) {
    console.log(`[CACHE INVALIDATE] ${this.name}: ${key}`);
    this.cache.delete(key);
  }
  
  clear() {
    console.log(`[CACHE CLEAR] ${this.name}`);
    this.cache.clear();
  }
  
  /**
   * Get data from cache or fetch it if not cached
   * @param key Cache key
   * @param fetchFn Function to fetch the data
   * @returns The cached or freshly fetched data
   */
  async getOrFetch<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    // Check cache first
    const cached = this.get(key);
    if (cached) return cached as T;
    
    // Fetch data if not cached
    try {
      const data = await fetchFn();
      this.set(key, data);
      return data;
    } catch (error) {
      console.error(`[CACHE ERROR] ${this.name}: ${key}`, error);
      throw error;
    }
  }
}

// Create global caches for different resources with appropriate TTLs
export const productCache = new SimpleCache(300, 'products'); // 5 minutes
export const productDetailCache = new SimpleCache(600, 'product-details'); // 10 minutes
export const categoryCache = new SimpleCache(1800, 'categories'); // 30 minutes
export const collectionCache = new SimpleCache(1800, 'collections'); // 30 minutes
export const navigationCache = new SimpleCache(1800, 'navigation'); // 30 minutes
export const searchCache = new SimpleCache(180, 'search'); // 3 minutes
export const userSpecificCache = new SimpleCache(60, 'user-data'); // 1 minute 