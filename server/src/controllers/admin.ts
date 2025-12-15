import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { User } from "../models/user";

// @route POST | api/v1/farmers/all
// @desc Get all farmers
// @access Private | Admin
export const getAllFarmersInfo = asyncHandler(
  async (req: Request, res: Response) => {
    const farmers = await User.find({ role: "farmer" }).sort({ createdAt: -1 });
    res.status(200).json(farmers);
  }
);

// @route PATCH | api/v1/users/:userId
// @desc Change user status
// @access Private | Admin
export const changeUserStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { status } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found!");
    }

    res.status(200).json(updatedUser);
  }
);
