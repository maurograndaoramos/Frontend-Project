// src/lib/services/recommendationService.ts
import { Product } from "@/types/product";
import { getProducts } from "./productService";

// Maximum number of products to store in viewing history
const MAX_HISTORY_ITEMS = 10;

// Maximum number of recommendations to return
const MAX_RECOMMENDATIONS = 4;

// Local storage key for viewing history
const VIEWING_HISTORY_KEY = 'viewing_history';

// Get viewing history from local storage
export function getViewingHistory(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const history = localStorage.getItem(VIEWING_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error retrieving viewing history:', error);
    return [];
  }
}

// Add product to viewing history
export function addToViewingHistory(productId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getViewingHistory();
    
    // Remove if exists (to move to front)
    const filteredHistory = history.filter(id => id !== productId);
    
    // Add to beginning of array
    const newHistory = [productId, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
    
    // Save to local storage
    localStorage.setItem(VIEWING_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error adding to viewing history:', error);
  }
}

// Get recommended products based on viewing history and category
export async function getRecommendedProducts(
  currentProductId?: string, 
  category?: string
): Promise<Product[]> {
  try {
    const history = getViewingHistory();
    
    // Set initial filters - prioritize same category if available
    let filters: any = { limit: MAX_RECOMMENDATIONS };
    if (category) {
      filters.category = category;
    }
    
    // Get products from same category
    const { data: recommendedProducts } = await getProducts(filters);
    
    // Filter out current product if provided
    let filteredRecommendations = currentProductId 
      ? recommendedProducts.filter(p => p.id !== currentProductId)
      : recommendedProducts;
    
    // If we don't have enough recommendations, get more products
    if (filteredRecommendations.length < MAX_RECOMMENDATIONS) {
      // Try getting featured products
      const { data: featuredProducts } = await getProducts({ 
        limit: MAX_RECOMMENDATIONS,
        sort: 'featured',
      });
      
      // Combine and remove duplicates
      const existingIds = new Set(filteredRecommendations.map(p => p.id));
      const additionalProducts = featuredProducts.filter(p => 
        !existingIds.has(p.id) && p.id !== currentProductId
      );
      
      filteredRecommendations = [
        ...filteredRecommendations,
        ...additionalProducts
      ].slice(0, MAX_RECOMMENDATIONS);
    }
    
    return filteredRecommendations;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
}