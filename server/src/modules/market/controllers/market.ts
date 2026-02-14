import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import { marketService } from "../services/market";
import { authService } from "../../auth/services/auth";
import { NotificationModule } from "../../notification";

export const getAllCrops = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const crops = await marketService.getCrops();
    res.status(200).json(crops);
  },
);

export const createCrop = asyncHandler(async (req: Request, res: Response) => {
  const crop = await marketService.createCrop(req.body);
  res.status(201).json({ success: true, data: crop });
});

export const updateCrop = asyncHandler(async (req: Request, res: Response) => {
  const crop = await marketService.updateCrop(req.params.id, req.body);
  res.status(200).json({ success: true, data: crop });
});

export const deleteCrop = asyncHandler(async (req: Request, res: Response) => {
  await marketService.deleteCrop(req.params.id);
  res.status(200).json({ success: true, message: "Crop deleted" });
});

export const getAllMarkets = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const markets = await marketService.getMarkets();
    res.status(200).json(markets);
  },
);

export const createMarket = asyncHandler(
  async (req: Request, res: Response) => {
    const market = await marketService.createMarket(req.body);
    res.status(201).json({ success: true, data: market });
  },
);

export const updateMarket = asyncHandler(
  async (req: Request, res: Response) => {
    const market = await marketService.updateMarket(req.params.id, req.body);
    res.status(200).json({ success: true, data: market });
  },
);

export const deleteMarket = asyncHandler(
  async (req: Request, res: Response) => {
    await marketService.deleteMarket(req.params.id);
    res.status(200).json({ success: true, message: "Market deleted" });
  },
);

export const updateMarketPrices = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { marketId, updates } = req.body;
    const userId = req.user!._id.toString();

    const { savedRecords, marketInfo } = await marketService.updatePrices(
      marketId,
      updates,
      userId,
    );

    if (marketId && marketInfo) {
      const message = `Market Update: Prices in ${marketInfo.name} have been updated!`;
      const title = "New Price Update";
      const allUsers = await authService.getAllUsers();
      const userIds = allUsers.map((u: any) => u._id.toString());
      await NotificationModule.send(title, message, userIds);

      const io = req.app.get("io");
      if (io) {
        io.emit("price_updated", {
          marketName: marketInfo.name,
          updateCount: updates.length,
          timestamp: new Date(),
          message,
        });
      }
    }

    res.status(201).json({
      success: true,
      count: savedRecords.length,
      notified: !!marketId,
    });
  },
);

export const getMarketPrices = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { userId, official, marketId } = req.query;

    const data = await marketService.getLatestMarketAnalytics({
      userId: userId as string,
      official: official === "true",
      marketId: marketId as string,
    });

    res.status(200).json({ success: true, count: data.length, data });
  },
);

export const getLatestPrices = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const latest = await marketService.getLatestPrices();
    res.status(200).json(latest);
  },
);

export const getCropPriceHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const { cropId, marketId } = req.query;
    const prices = await marketService.getCropPriceHistory(
      cropId as string,
      marketId as string,
    );
    res.status(200).json(prices);
  },
);
