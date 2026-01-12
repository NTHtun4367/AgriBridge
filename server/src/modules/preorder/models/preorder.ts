import { Schema, Document, model, Types } from "mongoose";

export interface IPreorder extends Document {
  farmerId: Types.ObjectId;
  merchantId: Types.ObjectId;
  fullName: string;
  phone: string;
  address: string; // Added field
  nrc: {
    region: string;
    township: string;
    type: string;
    number: string;
  };
  items: {
    cropName: string;
    quantity: number;
    price: number;
    unit: string;
  }[];
  notes?: string;
  deliveryTimeline: {
    count: number;
    unit: "days" | "months";
  };
  status: "pending" | "confirmed" | "delivered" | "cancelled";
}

const PreorderSchema = new Schema<IPreorder>(
  {
    farmerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    merchantId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }, // Added field
    nrc: {
      region: { type: String, required: true },
      township: { type: String, required: true },
      type: { type: String, required: true },
      number: { type: String, required: true },
    },
    items: [
      {
        cropName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        unit: { type: String, required: true },
      },
    ],
    notes: { type: String },
    deliveryTimeline: {
      count: { type: Number, required: true },
      unit: { type: String, enum: ["days", "months"], required: true },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Preorder = model<IPreorder>("Preorder", PreorderSchema);
