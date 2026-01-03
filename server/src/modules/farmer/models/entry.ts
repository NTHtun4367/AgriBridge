import { model, Schema, Types } from "mongoose";

export interface IEntry extends Document {
  userId: Types.ObjectId;
  type: "expense" | "income";
  date: Date;
  category: string;
  quantity?: number;
  unit?: string;
  value: number;
  notes?: string;
  billImageUrl?: string;
}

const entrySchema = new Schema<IEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["expense", "income"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
    },
    unit: {
      type: String,
    },
    value: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    billImageUrl: { type: String },
  },
  { timestamps: true }
);

// Create a compound index for faster reports
entrySchema.index({ userId: 1, type: 1, date: -1 });

export const Entry = model<IEntry>("Entry", entrySchema);
