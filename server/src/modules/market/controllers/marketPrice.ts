import { Request, Response } from "express";
import { MarketPrice } from "../models/marketPrice";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import { Market } from "../models/market";

export const updateMarketPrices = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { marketId, updates } = req.body; // updates: Array of {cropId, price, unit}

    // if (!Array.isArray(prices) || prices.length === 0) {
    //   res.status(400);
    //   throw new Error("Invalid data format");
    // }

    const priceEntries = updates.map((item: any) => ({
      marketId,
      cropId: item.cropId,
      price: item.price,
      unit: item.unit,
      userId: req.user!._id,
    }));

    const savedRecords = await MarketPrice.insertMany(priceEntries);

    // fetch market and crop details to send meaningful notification
    const marketInfo = await Market.findById(marketId);

    // emit real-time notification via socket.io
    const io = req.app.get("io");
    io.emit("price_updated", {
      marketName: marketInfo?.name,
      updateCount: updates.length,
      timestamp: new Date(),
      message: `Market Update: Prices in ${marketInfo?.name} have been updated!`,
    });

    res.status(201).json({ success: true, count: savedRecords.length });
  }
);

export const getLatestPrices = asyncHandler(
  async (req: Request, res: Response) => {
    const latest = await MarketPrice.find().sort({ createdAt: -1 });
    res.status(200).json(latest);
  }
);
