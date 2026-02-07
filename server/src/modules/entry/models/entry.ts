import { model, Schema, Types, Document } from "mongoose";

export interface IEntry extends Document {
  userId: Types.ObjectId;
  cropId?: Types.ObjectId; // Link to specific crop
  type: "expense" | "income";
  date: Date;
  category: string;
  season?: string;
  quantity?: number;
  unit?: string;
  value: number;
  notes?: string;
  billImageUrl?: string;
}

const entrySchema = new Schema<IEntry>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    cropId: { type: Schema.Types.ObjectId, index: true }, // Fast lookup for per-crop stats
    type: { type: String, enum: ["expense", "income"], required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    season: { type: String, index: true },
    quantity: { type: Number },
    unit: { type: String },
    value: { type: Number, required: true },
    notes: { type: String },
    billImageUrl: { type: String },
  },
  { timestamps: true },
);

// Optimize for dashboard: filter by user/season, sort by date
entrySchema.index({ userId: 1, season: 1, type: 1, date: -1 });

export const Entry = model<IEntry>("Entry", entrySchema);
