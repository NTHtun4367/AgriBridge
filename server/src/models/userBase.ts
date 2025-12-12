import { Document } from "mongoose";

export interface IUserBase extends Document {
  status: "farmer" | "merchant";

  // Step 1
  name: string;
  email: string;
  password: string;

  // Step 2
  homeAddress: string;
  division: string;
  district: string;
  township: string;

  matchPassword(enteredPassword: string): Promise<boolean>;
}
