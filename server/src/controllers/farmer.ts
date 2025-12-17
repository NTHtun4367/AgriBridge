import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { User } from "../models/user";
import generateToken from "../utils/generateToken";

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

// @route POST | api/v1/login
// @desc Login to registered account
// @access Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = generateToken(user);

  res.status(200).json({
    token,
    user: {
      id: user._id,
      role: user.role,
      merchantId: user.merchantId || null,
    },
  });
});
