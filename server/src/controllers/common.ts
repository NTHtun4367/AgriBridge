import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { User } from "../models/user";
import { AuthRequest } from "../middlewares/authMiddleware";
import generateToken from "../utils/generateToken";

// @route POST | api/v1/login
// @desc Login to registered account
// @access Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = generateToken(user);

  res.status(200).json({
    token,
    user: {
      id: user._id,
      role: user.role,
      merchantId: user.merchantId || null,
    },
  });
});

// @route GET | api/v1/me
// @desc Get login user's information
// @access Private
export const getUserInfo = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user } = req;

    const userDoc = await User.findById(user?._id).select("-password");

    res.status(200).json(userDoc);
  }
);
