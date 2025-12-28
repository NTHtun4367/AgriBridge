import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import { authService } from "../services/auth";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json(result);
});

export const getUserInfo = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await authService.getUserProfile(req.user?._id as string);
    res.status(200).json(result);
  }
);
