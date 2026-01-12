import { Request, Response } from "express";
import { preorderService } from "../services/preorder";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";

export const createPreorder = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await preorderService.createPreorder(req.body);
    res.status(201).json(result);
  }
);

export const getMyPreorders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const farmerId = req.user?._id;

    if (!farmerId) {
      throw new Error("Unauthorized: No user found");
    }

    // Filter specifically by the logged-in farmer's ID
    const result = await preorderService.getAllPreorders({ farmerId });
    res.status(200).json(result);
  }
);

export const getMerchantPreorders = asyncHandler(
  async (req: Request, res: Response) => {
    const { merchantId } = req.query;

    if (!merchantId) {
      throw new Error("Merchant ID is required");
    }

    const result = await preorderService.getMerchantPreorders(
      merchantId as string
    );
    res.status(200).json(result);
  }
);

export const updatePreorderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw new Error("Status is required");
    }

    const result = await preorderService.updatePreorderStatus(id, status);

    if (!result) {
      throw new Error("Preorder not found");
    }

    res.status(200).json(result);
  }
);
