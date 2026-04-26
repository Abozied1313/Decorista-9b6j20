export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  color: string;
  dimensions: string;
  tiers: number;
  inStock: boolean;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
