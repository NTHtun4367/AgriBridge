import mongoose from "mongoose";
import { ENV } from "../utils/env";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URL!);
    console.log("MongoDB connected =>", conn.connection.host);
  } catch (error) {
    console.error("DB connection error =>", error);
    process.exit(1);
  }
};
