import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { authService } from "../../auth/services/auth";
// import { farmerService } from "../services/farmer";

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
  }
);

export const getMerchantInfoById = asyncHandler(
  async (req: Request, res: Response) => {
    const merchant = await authService.getMerchantById(req.params.userId);
    res.status(200).json(merchant);
  }
);
