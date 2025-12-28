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

// types/market.ts
export interface MarketPriceData {
  _id: string;
  marketId: { _id: string; name: string }; // Assuming you populate these
  cropId: { _id: string; name: string; image?: string };
  price: number;
  unit: string;
  createdAt: string;
}
