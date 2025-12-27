import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../modules/auth/models/user";
import { Types } from "mongoose";
import { ENV } from "../utils/env";

interface User {
  _id: Types.ObjectId | string;
  role: "farmer" | "merchant" | "admin";
  merchantId?: Types.ObjectId | string;
}

export interface AuthRequest extends Request {
  user?: User;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, ENV.JWT_SECRET!) as any;

    req.user = {
      _id: decoded._id,
      role: decoded.role,
      merchantId: decoded.merchantId,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
