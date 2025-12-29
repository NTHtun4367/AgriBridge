import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import { marketService } from "../services/market";
import { authService } from "../../auth/services/auth";
import { NotificationModule } from "../../notification";

export const updateMarketPrices = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { marketId, updates } = req.body;

    // 1. Save the market prices
    const { savedRecords, marketInfo } = await marketService.updatePrices(
      marketId,
      updates,
      req.user!._id.toString()
    );

    const message = `Market Update: Prices in ${marketInfo.name} have been updated!`;
    const title = "New Price Update";

    // 2. Persist Notification in DB for future reference/microservices
    // For "all" users, we fetch all user IDs.
    // Optimization: In a real microservice, this would be a background job.
    const allUsers = await authService.getAllUsers();
    const userIds = allUsers.map((u: any) => u._id.toString());

    await NotificationModule.send(title, message, userIds);

    // 3. Emit real-time notification
    const io = req.app.get("io");
    if (io) {
      io.emit("price_updated", {
        marketName: marketInfo.name,
        updateCount: updates.length,
        timestamp: new Date(),
        message: message,
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

export const getMarketPrices = async (req: Request, res: Response) => {
  try {
    const data = await marketService.getLatestMarketAnalytics();

    // Optional: Add logic here if you strictly want to filter out data
    // that wasn't updated "today".
    // However, usually, it's better to return the "last known price"
    // and let the frontend decide if it's stale (e.g., check `updatedAt`).

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Error fetching market prices:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
