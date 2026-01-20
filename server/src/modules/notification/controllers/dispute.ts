import { Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import { disputeService } from "../services/dispute";

// --- FARMER ACTIONS ---

export const createDispute = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const farmerId = req.user?._id.toString();
    const { merchantId, reason, description } = req.body;

    const result = await disputeService.createDispute({
      farmerId: farmerId as any,
      merchantId,
      reason,
      description,
    });

    res.status(201).json({ success: true, data: result });
  },
);

export const getMyDisputes = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const farmerId = req.user?._id.toString()!;
    const disputes = await disputeService.getDisputesByFarmerId(farmerId);
    res.status(200).json({ success: true, data: disputes });
  },
);

// --- ADMIN ACTIONS ---

export const getAllDisputes = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const disputes = await disputeService.getAllDisputes();
    res.status(200).json({ success: true, data: disputes });
  },
);

export const updateDisputeStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await disputeService.updateStatus(id, status);
    res.status(200).json({ success: true, data: updated });
  },
);
