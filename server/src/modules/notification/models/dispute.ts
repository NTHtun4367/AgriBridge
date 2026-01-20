import { Schema, model, Document, Types } from "mongoose";

export interface IDispute extends Document {
  merchantId: Types.ObjectId;
  farmerId: Types.ObjectId;
  reason: string;
  description: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: Date;
}

const disputeSchema = new Schema<IDispute>(
  {
    merchantId: { type: Schema.Types.ObjectId, required: true },
    farmerId: { type: Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Dispute = model<IDispute>("Dispute", disputeSchema);
