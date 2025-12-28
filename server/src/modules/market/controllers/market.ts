import { Request, Response } from "express";
import { validationResult } from "express-validator";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import { marketService } from "../services/market";

export const updateMarketPrices = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { marketId, updates } = req.body;

    // call the service
    const { savedRecords, marketInfo } = await marketService.updatePrices(
      marketId,
      updates,
      req.user!._id.toString()
    );

    // emit real-time notification
    const io = req.app.get("io");
    if (io) {
      io.emit("price_updated", {
        marketName: marketInfo.name,
        updateCount: updates.length,
        timestamp: new Date(),
        message: `Market Update: Prices in ${marketInfo.name} have been updated!`,
      });
    }

    res.status(201).json({
      success: true,
      count: savedRecords.length,
    });
  }
);

export const getLatestPrices = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const latest = await marketService.getLatestPrices();
    res.status(200).json(latest);
  }
);

export const getAllCrops = asyncHandler(async (req: Request, res: Response) => {
  const crops = await marketService.getCrops();
  res.status(200).json(crops);
});

export const getAllMarkets = asyncHandler(
  async (req: Request, res: Response) => {
    const markets = await marketService.getMarkets();
    res.status(200).json(markets);
  }
);
