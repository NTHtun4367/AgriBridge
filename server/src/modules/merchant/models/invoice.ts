import { Schema, model, Document, Types } from "mongoose";

export interface IInvoice extends Document {
  invoiceId: string;
  farmerId: Types.ObjectId;
  merchantId: Types.ObjectId;
  preorderId?: Types.ObjectId;
  // Metadata fields to save from input
  farmerName: string;
  farmerPhone: string;
  farmerAddress: string;
  farmerNRC: string;
  items: {
    cropName: string;
    quantity: number;
    unit: string;
    price: number;
  }[];
  totalAmount: number;
  notes?: string;
  status: "pending" | "paid";
}

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceId: { type: String, required: true, unique: true },
    farmerId: { type: Schema.Types.ObjectId, required: true },
    merchantId: { type: Schema.Types.ObjectId, required: true },
    preorderId: { type: Schema.Types.ObjectId },
    farmerName: { type: String, required: true },
    farmerPhone: { type: String, required: true },
    farmerAddress: { type: String },
    farmerNRC: { type: String },
    items: [
      {
        cropName: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    notes: String,
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
  },
  { timestamps: true }
);

export const Invoice = model<IInvoice>("Invoice", invoiceSchema);
