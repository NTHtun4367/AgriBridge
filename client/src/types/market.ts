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
