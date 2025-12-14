import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

// Define the base interface for the User Document
export interface IUser extends Document {
  role: "farmer" | "merchant" | "admin";

  name: string;
  email: string;
  password: string;

  homeAddress: string;
  division: string;
  district: string;
  township: string;

  // The merchantId is a reference to the Merchant document
  merchantId?: Schema.Types.ObjectId;

  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      enum: ["farmer", "merchant", "admin"],
      required: true,
    },

    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    homeAddress: { type: String, required: true },
    division: { type: String, required: true },
    district: { type: String, required: true },
    township: { type: String, required: true },

    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "Merchant",
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Export the model
export const User = model<IUser>("User", userSchema);
