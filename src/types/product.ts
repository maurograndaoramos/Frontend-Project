export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number; // Optional for sale items
    image: string;
    inStock: boolean;
    category: string;
    isNew?: boolean;
    tags?: string[];
    rating?: number;
    createdAt?: Date;
  }