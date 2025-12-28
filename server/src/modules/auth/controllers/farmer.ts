import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { authService } from "../services/auth";

export const registerFarmer = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.registerFarmer(req.body);
    res.status(201).json(result);
  }
);
