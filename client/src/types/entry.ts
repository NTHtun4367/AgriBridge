export type Category =
  | "seeds"
  | "fertilizer"
  | "pesticide"
  | "labor"
  | "machinery"
  | "transport"
  | "other";

export interface Entry {
  _id?: string;
  date: string | Date;
  category: Category | string;
  quantity?: string;
  unit?: string;
  value: string | number;
  notes?: string;
  billImageUrl?: string;
  createdAt?: string;
}

export interface ApiResponse {
  message: string;
  data?: Entry;
  error?: string;
}

// Unit Mapping Type
export type UnitMapping = Record<Category, string[]>;
