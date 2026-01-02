import { model, Schema } from "mongoose";

export interface IEntry extends Document {
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

export const Entry = model<IEntry>("Entry", entrySchema);
