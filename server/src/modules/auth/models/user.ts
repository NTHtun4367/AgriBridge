import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  role: "farmer" | "merchant" | "admin";
  status: "active" | "ban";
  verificationStatus: "unverified" | "pending" | "verified";
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  homeAddress: string;
  division: string;
  district: string;
  township: string;
  bio: string;
  avatar: string;
  avatarPublicId: string;
  merchantId?: Schema.Types.ObjectId;
  otp?: string;
  otpExpires?: Date;
  // New field for pending identity changes
  tempIdentifier?: string;

  matchPassword(password: string): Promise<boolean>;
  matchOtp(otp: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    role: { type: String, required: true },
    status: { type: String, default: "active" },
    verificationStatus: { type: String, default: "unverified" },
    name: String,
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, select: false },
    homeAddress: String,
    division: String,
    district: String,
    township: String,
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    avatarPublicId: { type: String, default: "" },
    merchantId: { type: Schema.Types.ObjectId, ref: "Merchant" },
    otp: String,
    otpExpires: Date,
    tempIdentifier: String,
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  // Note: Hashing OTP is secure but requires 'await' during comparison
  if (this.isModified("otp") && this.otp) {
    this.otp = await bcrypt.hash(this.otp, 10);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password || "");
};

userSchema.methods.matchOtp = async function (otp: string) {
  if (!this.otp) return false;
  return await bcrypt.compare(otp, this.otp);
};

export const User = model<IUser>("User", userSchema);
