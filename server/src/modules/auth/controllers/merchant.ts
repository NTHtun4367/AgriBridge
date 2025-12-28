import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { authService } from "../services/auth";

// @route POST | api/v1/register/merchant
// @desc Register new merchant
// @access Public
export const registerMerchant = asyncHandler(
  async (req: Request, res: Response) => {
    // Pass everything to the service
    const result = await authService.registerMerchant(req.body, req.files);

    res.status(201).json(result);
  }
);
