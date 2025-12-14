import { Schema, model, Document } from "mongoose";

export interface IMerchant extends Document {
  businessName: string;
  phone: string;

  nrcRegion: string;
  nrcTownship: string;
  nrcType: string;
  nrcNumber: string;

  nrcFrontImage: {
    url: string;
    public_alt?: string;
  };

  nrcBackImage: {
    url: string;
    public_alt?: string;
  };

  // plan?: "free" | "pro" | "enterprise";
}

const merchantSchema = new Schema<IMerchant>(
  {
    businessName: { type: String, required: true },
    phone: { type: String, required: true },

    nrcRegion: { type: String, required: true },
    nrcTownship: { type: String, required: true },
    nrcType: { type: String, required: true },
    nrcNumber: { type: String, required: true },

    nrcFrontImage: {
      url: { type: String, required: true },
      public_alt: String,
    },
    nrcBackImage: {
      url: { type: String, required: true },
      public_alt: String,
    },

    // plan: { type: String, default: "free" },
  },
  { timestamps: true }
);

export const Merchant = model<IMerchant>("Merchant", merchantSchema);
