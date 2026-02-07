import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import { authService } from "../services/auth";

/**
 * AuthController manages the interaction between HTTP requests
 * and the AuthService business logic.
 */

// --- REGISTRATION ---

export const registerFarmer = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.registerFarmer(req.body);
    res.status(201).json(result);
  },
);

export const registerMerchant = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.registerMerchant(req.body, req.files);
    res.status(201).json(result);
  },
);

// --- LOGIN & VERIFICATION ---

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    res.status(400);
    throw new Error("Identifier and password are required");
  }
  const result = await authService.login(identifier, password);
  res.status(200).json(result);
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, otp } = req.body;
  if (!identifier || !otp) {
    res.status(400);
    throw new Error("Identifier and OTP are required");
  }
  const result = await authService.verifyOtp(identifier, otp);
  res.status(200).json(result);
});

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = req.body;
  if (!identifier) {
    res.status(400);
    throw new Error("Identifier is required to resend OTP");
  }
  const result = await authService.resendOtp(identifier);
  res.status(200).json(result);
});

// --- PROFILE MANAGEMENT ---

export const getUserInfo = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await authService.getUserProfile(req.user?._id as string);
    res.status(200).json(result);
  },
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await authService.updateProfile(
      req.user?._id as string,
      req.body,
    );
    res.status(200).json(result);
  },
);

export const updateAvatar = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      res.status(400);
      throw new Error("Avatar image is required");
    }
    const result = await authService.updateAvatar(
      req.user?._id as string,
      req.file,
    );
    res.status(200).json(result);
  },
);

// --- ACCOUNT SECURITY ---

export const requestEmailChange = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { newEmail } = req.body;
    if (!newEmail) {
      res.status(400);
      throw new Error("New email address is required");
    }
    const result = await authService.requestEmailChange(
      req.user?._id as string,
      newEmail,
    );
    res.status(200).json(result);
  },
);

export const confirmEmailChange = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { otp } = req.body;
    if (!otp) {
      res.status(400);
      throw new Error("OTP is required");
    }
    const result = await authService.confirmEmailChange(
      req.user?._id as string,
      otp,
    );
    res.status(200).json(result);
  },
);

// --- MERCHANT SPECIFIC ---

export const updateMerchantDocs = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400);
      throw new Error("Document files are required");
    }
    const result = await authService.updateMerchantDocs(
      req.user?._id as string,
      req.files,
    );
    res.status(200).json(result);
  },
);

export const getVerifiedMerchants = asyncHandler(
  async (req: Request, res: Response) => {
    const { division, district, township } = req.query;

    // Base filter: only verified active merchants with a linked profile
    const filter: any = {
      role: "merchant",
      verificationStatus: "verified",
      status: "active",
      merchantId: { $exists: true },
    };

    // Add location filters only if they are provided in the query
    if (division && division !== "undefined") filter.division = division;
    if (district && district !== "undefined") filter.district = district;
    if (township && township !== "undefined") filter.township = township;

    const merchants = await authService.getMerchants(filter);

    res.status(200).json(merchants);
  },
);

export const getMerchantInfoById = asyncHandler(
  async (req: Request, res: Response) => {
    const merchant = await authService.getMerchantById(req.params.userId);
    res.status(200).json(merchant);
  },
);

// --- PASSWORD & ACCOUNT MANAGEMENT ---

export const changePassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error("Current password and new password are required");
    }

    const result = await authService.changePassword(
      req.user?._id as string,
      currentPassword,
      newPassword,
    );

    res.status(200).json(result);
  },
);

export const deleteAccount = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await authService.deleteAccount(req.user?._id as string);

    res.status(200).json(result);
  },
);
