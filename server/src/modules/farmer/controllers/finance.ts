import { Response } from "express";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import { financeService } from "../services/finance";
import asyncHandler from "../../../shared/utils/asyncHandler";

export const getStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    // Get season from query parameters
    const season = req.query.season as string | undefined;

    const data = await financeService.calculateFinance(
      userId?.toString()!,
      season,
    );

    res.status(200).json(data);
  },
);
