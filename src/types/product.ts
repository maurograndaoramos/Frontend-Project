export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  hasDiscount: boolean;
  discountPercent?: number;
  discountStart?: Date;
  discountEnd?: Date;
  images: string[];
  inStock: boolean;
  quantity?: number;
  category: string;
  subcategory?: string;
  tags?: string[];
  isNew?: boolean;
  isFeatured?: boolean;
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
  productType?: ProductType;
  productTypeId?: string;
  collections?: Collection[];
}

export interface ProductType {
  id: string;
  name: string;
  description?: string;
  products?: Product[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  heroImage?: string;
  features: string[];
  isActive: boolean;
  products?: Product[];
  createdAt?: Date;
  updatedAt?: Date;
}