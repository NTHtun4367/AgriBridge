import { model, Schema, Types } from "mongoose";

interface IMarketPrice extends Document {
  userId: Types.ObjectId;
  marketId?: Types.ObjectId;
  cropId: Types.ObjectId;
  price: number;
  amount?: number;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
}

const marketPriceSchema = new Schema<IMarketPrice>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    marketId: {
      type: Schema.Types.ObjectId,
      ref: "Market",
    },
    cropId: {
      type: Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },
    amount: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Optimization for Admin (Market lookups)
marketPriceSchema.index({ marketId: 1, cropId: 1, createdAt: -1 });
// Optimization for Merchant (User lookups)
marketPriceSchema.index({ userId: 1, cropId: 1, createdAt: -1 });

export const MarketPrice = model<IMarketPrice>(
  "MarketPrice",
  marketPriceSchema,
);
