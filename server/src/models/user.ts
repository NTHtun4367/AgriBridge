import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUserBase } from "./userBase";

export interface IUser extends IUserBase {
  status: "farmer";
}

const userSchema = new Schema<IUser>(
  {
    status: {
      type: String,
      enum: ["farmer", "merchant"],
      default: "farmer",
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
  },
  { timestamps: true }
);

// HASH PASSWORD
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

export const Farmer = model<IUser>("Farmer", userSchema);
