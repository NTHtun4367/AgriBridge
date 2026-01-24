import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import { authService } from "../services/auth";

export const requestChangeId = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { newIdentifier } = req.body; // Changed from newId to newIdentifier

    if (!newIdentifier) {
      res.status(400);
      throw new Error("New email or phone is required");
    }

    const result = await authService.requestIdentifierChange(
      req.user?._id as string,
      newIdentifier,
    );
    res.status(200).json(result);
  },
);

export const confirmChangeId = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { otp } = req.body;

    if (!otp) {
      res.status(400);
      throw new Error("OTP is required");
    }

    const result = await authService.confirmIdentifierChange(
      req.user?._id as string,
      otp,
    );
    res.status(200).json(result);
  },
);

// --- Registration Controllers ---

export const registerFarmer = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.registerFarmer(req.body);
    res.status(201).json(result);
  },
);

export const registerMerchant = asyncHandler(
  async (req: Request, res: Response) => {
    // Pass req.body and req.files (NRC images) to service
    const result = await authService.registerMerchant(req.body, req.files);
    res.status(201).json(result);
  },
);

// --- OTP Controllers ---

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, otp } = req.body;
  const result = await authService.verifyOtp(identifier, otp);
  res.status(200).json(result);
});

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = req.body;
  const result = await authService.resendOtp(identifier);
  res.status(200).json(result);
});

// --- Login & Profile Controllers ---

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  const result = await authService.login(identifier, password);
  res.json(result);
});

/**
 * Update Text Profile Info
 */
export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await authService.updateProfile(
      req.user?._id as string,
      req.body,
    );
    res.status(200).json(result);
  },
);

/**
 * Update Profile Avatar
 */
export const updateAvatar = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      throw new Error("Avatar image is required");
    }
    const result = await authService.updateAvatar(
      req.user?._id as string,
      req.file,
    );
    res.status(200).json(result);
  },
);

/**
 * Update Merchant NRC Docs
 */
export const updateMerchantDocs = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // req.files contains nrcFront and nrcBack from Multer
    const result = await authService.updateMerchantDocs(
      req.user?._id as string,
      req.files,
    );
    res.status(200).json(result);
  },
);

// --- Existing getUserInfo ---
export const getUserInfo = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await authService.getUserProfile(req.user?._id as string);
    res.status(200).json(result);
  },
);
