import { model, Schema } from "mongoose";

interface IMarket extends Document {
  name: string;
  region: string;
  isActive: boolean;
}

const marketSchema = new Schema<IMarket>({
  name: {
    type: String,
    required: true,
  },
  region: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const Market = model<IMarket>("Market", marketSchema);
