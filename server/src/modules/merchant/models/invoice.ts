import { Schema, model, Document, Types } from "mongoose";

export interface IInvoice extends Document {
  farmerId: Types.ObjectId;
  merchantId: Types.ObjectId;
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
    farmerId: {
      type: Schema.Types.ObjectId,
      //  ref: "User",
      required: true,
    },
    merchantId: {
      type: Schema.Types.ObjectId,
      //   ref: "Merchant",
      required: true,
    },
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
    status: { type: String, enum: ["pending", "paid"] },
  },
  { timestamps: true }
);

export const Invoice = model<IInvoice>("Invoice", invoiceSchema);
