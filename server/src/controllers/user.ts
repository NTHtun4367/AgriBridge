import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { User } from "../models/user";

// @route POST | api/v1/register
// @desc Register new user
// @access Public
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, homeAddress, division, district, township } =
      req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error("User already exist with this email address.");
    }

    const newUser = await User.create({
      name,
      email,
      password,
      homeAddress,
      division,
      district,
      township,
    });

    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        homeAddress: newUser.homeAddress,
        division: newUser.division,
        district: newUser.district,
        township: newUser.township,
      });
    }
  }
);
