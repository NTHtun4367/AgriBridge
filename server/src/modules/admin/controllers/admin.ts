import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { authService } from "../../auth/services/auth";
import { disputeService } from "../../notification/services/dispute";

export const getAllFarmersInfo = asyncHandler(
  async (req: Request, res: Response) => {
    const farmers = await authService.getFarmers();
    res.status(200).json(farmers);
  },
);

export const getAllMerchants = asyncHandler(
  async (req: Request, res: Response) => {
    const merchants = await authService.getAllMerchants();
    res.status(200).json(merchants);
  },
);

export const getVerifiedMerchants = asyncHandler(
  async (req: Request, res: Response) => {
    const merchants = await authService.getVerifiedMerchants();

    if (!merchants || merchants.length === 0) {
      throw new Error("No verified merchants found");
    }

    res.status(200).json(merchants);
  },
);

export const changeUserStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { status } = req.body;
    const updatedUser = await authService.findUserAndUpdate(userId, { status });
    res.status(200).json(updatedUser);
  },
);

export const getAllVerificationPendingUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const pendingUsers = await authService.getPendingUsers();
    res.status(200).json(pendingUsers);
  },
);

export const updateUserVerificationStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { status } = req.body;
    const updatedUser = await authService.findUserAndUpdate(userId, {
      verificationStatus: status,
    });
    res.status(200).json(updatedUser);
  },
);

export const getMerchantInfoWithMerchantId = asyncHandler(
  async (req: Request, res: Response) => {
    const merchant = await authService.getMerchantInfo(req.params.merchantId);
    res.status(200).json(merchant);
  },
);

export const getAdminOverview = asyncHandler(
  async (req: Request, res: Response) => {
    const userStats = await authService.getUserDashboardStats();
    const disputeStats = await disputeService.getDisputeDashboardStats();

    res.status(200).json({
      success: true,
      data: {
        stats: {
          activeFarmers: userStats.activeFarmers,
          totalMerchants: userStats.totalMerchants,
          pendingDisputes: disputeStats.pendingDisputes,
        },
        chartData: userStats.formattedGrowth,
        recentActivity: disputeStats.recentActivity,
      },
    });
  },
);
