import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { Crop } from "../models/crop";

export const getAllCrops = asyncHandler(async (req: Request, res: Response) => {
  const crops = await Crop.find().sort({ category: 1, name: 1 });
  res.status(200).json(crops);
});
