import { Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import { disputeService } from "../services/dispute";

export const createDispute = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const farmerId = req.user?._id.toString();
    const result = await disputeService.createDispute({
      farmerId: farmerId as any,
      merchantId: req.body.merchantId,
      reason: req.body.reason,
      description: req.body.description,
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

export const getAllDisputes = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const disputes = await disputeService.getAllDisputes();
    res.status(200).json({ success: true, data: disputes });
  },
);

export const updateDisputeStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const updated = await disputeService.updateStatus(
      req.params.id,
      req.body.status,
    );
    res.status(200).json({ success: true, data: updated });
  },
);
