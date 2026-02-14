import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User as UserModel } from "../../modules/auth/models/user";
import { Types } from "mongoose";
import { ENV } from "../utils/env";

interface UserPayload {
  _id: any;
  role: "farmer" | "merchant" | "admin";
  merchantId?: any;
  settings?: {
    aiEnabled: boolean;
  };
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, ENV.JWT_SECRET!) as any;

    const userAccount = await UserModel.findById(decoded._id)
      .select("role merchantId settings")
      .lean(); // lean() သုံးခြင်းက POJO (Plain Object) ရစေပြီး type error လျော့နည်းစေသည်

    if (!userAccount) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = {
      _id: userAccount._id,
      role: userAccount.role as "farmer" | "merchant" | "admin",
      merchantId: userAccount.merchantId,
      settings: userAccount.settings as { aiEnabled: boolean } | undefined,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
