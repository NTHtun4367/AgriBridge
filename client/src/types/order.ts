export interface InvoiceItem {
  cropName: string;
  quantity: string;
  unit: string;
  price: string;
}

export interface Preorder {
  id: string;
  farmerName: string;
  email: string;
  phone: string;
  address: string;
  items: InvoiceItem[];
  expectedDelivery: string;
  status: "pending" | "confirmed";
}

export const MOCK_PREORDERS: Preorder[] = [
  {
    id: "PO-1001",
    farmerName: "John Doe",
    email: "john@greenvalley.com",
    phone: "+1 234-567-890",
    address: "Green Valley Farm, Sector 4, CA",
    items: [
      { cropName: "Tomatoes", quantity: "50", unit: "kg", price: "20" },
      { cropName: "Carrots", quantity: "30", unit: "kg", price: "15" },
    ],
    expectedDelivery: "15 Jan 2026",
    status: "pending",
  },
  {
    id: "PO-1002",
    farmerName: "Sarah Smith",
    email: "sarah@northhill.com",
    phone: "+1 987-654-321",
    address: "North Hill Orchards, Block B, NY",
    items: [{ cropName: "Onions", quantity: "100", unit: "kg", price: "10" }],
    expectedDelivery: "20 Jan 2026",
    status: "pending",
  },
];
