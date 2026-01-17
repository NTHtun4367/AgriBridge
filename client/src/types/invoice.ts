export interface IInvoiceItem {
  cropName: string;
  quantity: number;
  unit: string;
  price: number;
}

export interface IInvoiceResponse {
  _id: string;
  invoiceId: string; // The custom ID (e.g., INV-2024-1234)
  farmerId: string;
  merchantId: string;
  preorderId?: string;
  // Saved Metadata
  farmerName: string;
  farmerPhone: string;
  farmerAddress: string;
  farmerNRC: string;
  items: IInvoiceItem[];
  totalAmount: number;
  notes?: string;
  status: "pending" | "paid";
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceRequest {
  invoiceId: string;
  farmerId: string;
  preorderId?: string;
  // Added metadata fields for the request
  farmerName: string;
  farmerPhone: string;
  farmerAddress: string;
  farmerNRC: string;
  items: IInvoiceItem[];
  notes?: string;
}

export interface UpdateStatusRequest {
  id: string;
  status: "pending" | "paid";
}