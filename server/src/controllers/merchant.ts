import { Request, Response } from "express";
import { AnyKeys, HydratedDocument } from "mongoose"; // <-- NEW: Import HydratedDocument
import { Merchant } from "../models/merchant";
import { User, IUser } from "../models/user"; // <-- Import IUser for typing
import asyncHandler from "../utils/asyncHandler";
import generateToken from "../utils/generateToken";
import { uploadSingleImage } from "../utils/cloudinary";

// @route POST | api/v1/register/merchant
// @desc Register new user
// @access Public
export const registerMerchant = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      email,
      password,
      homeAddress,
      division,
      district,
      township,
      businessName,
      phone,
      nrc,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error("Email already registered.");
    }

    if (!nrc?.region || !nrc?.township || !nrc?.type || !nrc?.number) {
      res.status(400);
      throw new Error("NRC information is required");
    }

    const files = req.files as {
      nrcFront?: Express.Multer.File[];
      nrcBack?: Express.Multer.File[];
    };

    const frontImage = files.nrcFront?.[0];
    const backImage = files.nrcBack?.[0];

    if (!frontImage || !backImage) {
      res.status(400);
      throw new Error("NRC front and back images are required");
    }

    const uploadedFront = await uploadSingleImage(
      `data:${frontImage.mimetype};base64,${frontImage.buffer.toString(
        "base64"
      )}`,
      "/agribridge/nrc"
    );

    const uploadedBack = await uploadSingleImage(
      `data:${backImage.mimetype};base64,${backImage.buffer.toString(
        "base64"
      )}`,
      "/agribridge/nrc"
    );

    const merchant = await Merchant.create({
      businessName,
      phone,
      nrcRegion: nrc.region,
      nrcTownship: nrc.township,
      nrcType: nrc.type,
      nrcNumber: nrc.number,
      nrcFrontImage: {
        url: uploadedFront.image_url,
        public_alt: uploadedFront.public_alt,
      },
      nrcBackImage: {
        url: uploadedBack.image_url,
        public_alt: uploadedBack.public_alt,
      },
    });

    const userData: AnyKeys<IUser> = {
      role: "merchant",
      name,
      email,
      password,
      homeAddress,
      division,
      district,
      township,
      merchantId: merchant._id,
      verificationStatus: "pending",
    };

    const user: HydratedDocument<IUser> = await User.create(userData);

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        role: user.role,
        merchantId: merchant._id,
      },
    });
  }
);
