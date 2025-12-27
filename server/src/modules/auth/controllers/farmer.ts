import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { User } from "../models/user";
import generateToken from "../../../shared/utils/generateToken";

// @route POST | api/v1/register/farmer
// @desc Register new user
// @access Public
export const registerFarmer = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, homeAddress, division, district, township } =
      req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error("Email already registered.");
    }

    const newUser = await User.create({
      role: "farmer",
      name,
      email,
      password,
      homeAddress,
      division,
      district,
      township,

      verificationStatus: "verified",
    });

    const token = generateToken(newUser);

    if (newUser) {
      res.status(201).json({
        token,
        user: {
          id: newUser._id,
          role: newUser.role,
          verificationStatus: newUser.verificationStatus,
        },
      });
    }
  }
);
