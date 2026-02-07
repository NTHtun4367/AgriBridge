import { Schema, model, Document, Types } from "mongoose";

export interface IFarmerCrop extends Document {
  seasonId: Types.ObjectId;
  userId: Types.ObjectId;
  cropName: string;
  variety: string;
  areaSize: number;
}

const farmerCropSchema = new Schema<IFarmerCrop>(
  {
    seasonId: { type: Schema.Types.ObjectId, ref: "Season", required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    cropName: { type: String, required: true },
    variety: { type: String },
    areaSize: { type: Number, required: true },
  },
  { timestamps: true },
);

export const FarmerCrop = model<IFarmerCrop>("FarmerCrop", farmerCropSchema);
