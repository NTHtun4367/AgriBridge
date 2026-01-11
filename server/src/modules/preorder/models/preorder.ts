import mongoose, { Schema, Document } from "mongoose";

export interface IPreorder extends Document {
  farmerId: mongoose.Types.ObjectId;
  merchantId: mongoose.Types.ObjectId;
  items: {
    cropName: string; // Or mongoose.Types.ObjectId if referencing a Crop model
    quantity: number;
    price: number;
    unit: string;
  }[];
  phone?: string;
  notes?: string;
  deliveryTimeline: {
    count: number;
    unit: "days" | "months";
  };
  status: "pending" | "confirmed" | "delivered" | "cancelled";
}

const PreorderSchema = new Schema<IPreorder>(
  {
    farmerId: { type: Schema.Types.ObjectId, required: true },
    merchantId: { type: Schema.Types.ObjectId, required: true },
    items: [
      {
        cropName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        unit: { type: String, required: true },
      },
    ],
    phone: { type: String },
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

export const Preorder = mongoose.model<IPreorder>("Preorder", PreorderSchema);
