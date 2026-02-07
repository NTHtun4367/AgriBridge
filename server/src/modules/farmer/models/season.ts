import { Schema, model, Document, Types } from "mongoose";

export interface ISeason extends Document {
  userId: Types.ObjectId;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

const seasonSchema = new Schema<ISeason>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

seasonSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Season = model<ISeason>("Season", seasonSchema);
