export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  inStock: boolean;
  quantity?: number;
  category: string;
  subcategory?: string;
  tags?: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  dimensions?: {
    height?: number;
    width?: number;
    depth?: number;
    unit: 'in' | 'cm';
  };
  weight?: {
    value: number;
    unit: 'lb' | 'kg' | 'g' | 'oz';
  };
  material?: string;
  care?: string[];
  createdAt: Date;
  updatedAt: Date;
  relatedProducts?: string[]; 
}