export interface Entry {
  _id?: string;
  date: string | Date;
  type: "expense" | "income";
  category: string;
  season: string;
  quantity?: string;
  unit?: string;
  value: string | number;
  notes?: string;
  billImageUrl?: string;
  createdAt?: string;
}
