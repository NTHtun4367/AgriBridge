import mongoose from "mongoose";
import { ENV } from "../utils/env";
// import { User } from "../../modules/auth/models/user"; // User model ကို မှန်ကန်အောင် import လုပ်ပါ

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URL!);
    console.log("MongoDB connected =>", conn.connection.host);

    // --- Data Migration for Old Users ---
    // settings field လုံးဝမပါသေးသော user များကို ရှာဖွေပြီး update လုပ်မည်
    // const result = await User.updateMany(
    //   { settings: { $exists: false } },
    //   {
    //     $set: {
    //       "settings.aiEnabled": true,
    //     },
    //   },
    // );

    // if (result.modifiedCount > 0) {
    //   console.log(
    //     `✅ AI Settings Migration: Updated ${result.modifiedCount} old users.`,
    //   );
    // } else {
    //   console.log("ℹ️ AI Settings Migration: No old users need update.");
    // }
    // ------------------------------------
  } catch (error) {
    console.error("DB connection error =>", error);
    process.exit(1);
  }
};
