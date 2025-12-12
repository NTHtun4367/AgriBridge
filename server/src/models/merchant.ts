import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUserBase } from "./userBase";

export interface IMerchant extends IUserBase {
  status: "merchant";

  // Step 3
  businessName: string;
  phone: string;

  // Step 4
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
}

const merchantSchema = new Schema<IMerchant>(
  {
    status: {
      type: String,
      enum: ["farmer", "merchant"],
      default: "merchant",
    },

    // Step 1
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    // Step 2
    homeAddress: { type: String, required: true },
    division: { type: String, required: true },
    district: { type: String, required: true },
    township: { type: String, required: true },

    // Step 3 -> Merchant only
    businessName: { type: String, required: true },
    phone: { type: String, required: true },

    // Step 4
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
  },
  { timestamps: true }
);

// HASH PASSWORD
merchantSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

merchantSchema.methods.matchPassword = async function (
  enteredPassword: string
) {
  return bcrypt.compare(enteredPassword, this.password);
};

export const Merchant = model<IMerchant>("Merchant", merchantSchema);
