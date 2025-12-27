import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { Market } from "../models/market";

export const getAllMarkets = asyncHandler(
  async (req: Request, res: Response) => {
    const markets = await Market.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json(markets);
  }
);
