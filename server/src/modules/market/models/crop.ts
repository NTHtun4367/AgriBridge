import { model, Schema } from "mongoose";

interface ICrop extends Document {
  name: string;
  category: "rice" | "beans";
}

const cropSchema = new Schema<ICrop>({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["rice", "beans"],
    required: true,
  },
});

export const Crop = model<ICrop>("Crop", cropSchema);
