import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { User } from "../models/user";
import { Merchant } from "../models/merchant";

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

// @route PATCH | api/v1/users/verification
// @desc Get all verification pending users
// @access Private | Admin
export const getAllVerificationPendingUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const pendingUsers = await User.find({
      verificationStatus: "pending",
    }).sort({ createdAt: -1 });
    res.status(200).json(pendingUsers);
  }
);

// @route PATCH | api/v1/users/verification/:userId
// @desc Change user verification status
// @access Private | Admin
export const updateUserVerificationStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { status } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { verificationStatus: status },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found.");
    }

    res.status(200).json(updatedUser);
  }
);

// @route GET | api/v1/users/:merchantId
// @desc Get merchant info details
// @access Private | Admin
export const getMerchantInfoWithMerchantId = asyncHandler(
  async (req: Request, res: Response) => {
    const { merchantId } = req.params;

    const merchantInfo = await Merchant.findOne({ _id: merchantId });

    if (!merchantInfo) {
      throw new Error("Merchant info not found.");
    }

    res.status(200).json(merchantInfo);
  }
);
