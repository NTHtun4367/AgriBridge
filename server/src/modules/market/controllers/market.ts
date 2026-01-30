import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import { marketService } from "../services/market";
import { authService } from "../../auth/services/auth";
import { NotificationModule } from "../../notification";

// --- CROP CONTROLLERS ---
export const createCrop = asyncHandler(async (req: Request, res: Response) => {
  const crop = await marketService.createCrop(req.body);
  res.status(201).json({ success: true, data: crop });
});

export const getAllCrops = asyncHandler(async (req: Request, res: Response) => {
  const crops = await marketService.getCrops();
  res.status(200).json(crops);
});

export const updateCrop = asyncHandler(async (req: Request, res: Response) => {
  const crop = await marketService.updateCrop(req.params.id, req.body);
  res.status(200).json({ success: true, data: crop });
});

export const deleteCrop = asyncHandler(async (req: Request, res: Response) => {
  await marketService.deleteCrop(req.params.id);
  res.status(200).json({ success: true, message: "Crop deleted" });
});

// --- MARKET CONTROLLERS ---
export const createMarket = asyncHandler(
  async (req: Request, res: Response) => {
    const market = await marketService.createMarket(req.body);
    res.status(201).json({ success: true, data: market });
  },
);

export const getAllMarkets = asyncHandler(
  async (req: Request, res: Response) => {
    const markets = await marketService.getMarkets();
    res.status(200).json(markets);
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
    const { marketId, updates } = req.body; // marketId is optional here
    const userId = req.user!._id.toString();

    // 1. Save records via service
    const { savedRecords, marketInfo } = await marketService.updatePrices(
      marketId,
      updates,
      userId,
    );

    // 2. Notification: ONLY if marketId was provided (Official Update)
    if (marketId && marketInfo) {
      const message = `Market Update: Prices in ${marketInfo.name} have been updated!`;
      const title = "New Price Update";

      // Fetch users and send notifications
      const allUsers = await authService.getAllUsers();
      const userIds = allUsers.map((u: any) => u._id.toString());
      await NotificationModule.send(title, message, userIds);

      // Emit real-time socket event
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

    // 3. Final Response
    res.status(201).json({
      success: true,
      count: savedRecords.length,
      notified: !!marketId, // Helper flag for frontend if needed
    });
  },
);

export const getLatestPrices = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const latest = await marketService.getLatestPrices();
    res.status(200).json(latest);
  },
);

export const getMarketPrices = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, official, marketId } = req.query; // Added marketId

    const data = await marketService.getLatestMarketAnalytics({
      userId: userId as string,
      official: official === "true",
      marketId: marketId as string, // Pass it to the service
    });

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
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
