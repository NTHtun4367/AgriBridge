export interface Entry {
  _id?: string;
  date: string | Date;
  category: string;
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
