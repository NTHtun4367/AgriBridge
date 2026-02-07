import { Response } from "express";
import { farmerService } from "../services/farmer";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";

export const handleGetActiveSeason = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?._id as string;
    const season = await farmerService.getActiveSeason(userId);
    // Returns the active season object or null if none active
    res.json(season);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const handleStartSeason = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id as string;
    const { name } = req.body;
    const season = await farmerService.startSeason(userId, name);
    res.status(200).json(season);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const handleBulkAddCrops = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id as string;
    const { seasonId, crops } = req.body;
    const result = await farmerService.registerCropsBulk(
      userId,
      seasonId,
      crops,
    );
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const handleGetCrops = async (req: AuthRequest, res: Response) => {
  try {
    const { seasonId } = req.query;
    const crops = await farmerService.getCropsBySeason(
      req.user?._id as string,
      seasonId as string,
    );
    res.json(crops);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const handleEndSeason = async (req: AuthRequest, res: Response) => {
  try {
    const result = await farmerService.endSeason(
      req.user?._id as string,
      req.params.id,
    );
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
