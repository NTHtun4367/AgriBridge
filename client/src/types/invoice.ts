export interface IInvoiceItem {
  cropName: string;
  quantity: number;
  unit: string;
  price: number;
}

export interface IInvoiceResponse {
  _id: string;
  farmerId: string;
  merchantId: string;
  items: IInvoiceItem[];
  totalAmount: number;
  notes?: string;
  status: "pending" | "paid";
  createdAt: string;
  updatedAt: string;
}

// Data required to create a new invoice
export interface CreateInvoiceRequest {
  farmerId: string;
  items: IInvoiceItem[];
  notes?: string;
}

// Data required to update status
export interface UpdateStatusRequest {
  id: string;
  status: "pending" | "paid";
}
