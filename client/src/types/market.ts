export interface Crop {
  _id: string;
  name: string;
  category: "rice" | "beans";
}

export interface Market {
  _id: string;
  name: string;
  region: string;
  isActive: boolean;
}

export interface MarketPrice {
  userId: string;
  marketId?: string;
  cropId: string;
  price: number;
  unit: string;
}

export interface MarketPriceData {
  marketId: string;
  marketName: string;
  cropId: string;
  cropName: string;
  category?: string; // If you added category in aggregation
  currentPrice: number;
  unit: string;
  updatedAt: string;
  previousPrice?: number;
  priceChange: number;
  priceChangePercent: number;
}

export interface MarketPriceResponse {
  success: boolean;
  count: number;
  data: MarketPriceData[];
}
