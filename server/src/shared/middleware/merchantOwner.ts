import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export const merchantOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "merchant") {
    return res.status(403).json({ message: "Merchant only" });
  }

  if (!req.user.merchantId) {
    return res.status(403).json({ message: "Merchant ID missing" });
  }

  next();
};
