import { IUser, User } from "../models/user";
import { Merchant } from "../models/merchant";
import { uploadSingleImage } from "../../../shared/utils/cloudinary";
import generateToken from "../../../shared/utils/generateToken";
import { AnyKeys } from "mongoose";
import { HydratedDocument } from "mongoose";

export class AuthService {
  // Logic for Admin to use
  async getFarmers() {
    return await User.find({ role: "farmer" }).sort({ createdAt: -1 });
  }

  async findUserAndUpdate(userId: string, updateData: object) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) throw new Error("User not found!");
    return user;
  }

  async getPendingUsers() {
    const user = await User.find({ verificationStatus: "pending" }).sort({
      createdAt: -1,
    });
    if (!user) throw new Error("Verification pending user not found!");
    return user;
  }

  async getMerchantById(merchantId: string) {
    const merchant = await Merchant.findById(merchantId);
    if (!merchant) throw new Error("Merchant info not found.");
    return merchant;
  }

  // Logic for Auth Controllers to use
  async login(email: string, pass: string) {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(pass))) {
      throw new Error("Invalid email or password");
    }

    return {
      token: generateToken(user),
      user: {
        id: user._id,
        role: user.role,
        merchantId: user.merchantId || null,
        verificationStatus: user.verificationStatus,
      },
    };
  }

  // Farmer Registration
  async registerFarmer(body: any) {
    const { name, email, password, homeAddress, division, district, township } =
      body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
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
      return {
        token,
        user: {
          id: newUser._id,
          role: newUser.role,
          verificationStatus: newUser.verificationStatus,
        },
      };
    }
  }

  // Get Profile
  async getUserProfile(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user) throw new Error("User not found");
    return user;
  }

  async registerMerchant(body: any, reqFiles: any) {
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
    } = body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("Email already registered.");
    }

    if (!nrc?.region || !nrc?.township || !nrc?.type || !nrc?.number) {
      throw new Error("NRC information is required");
    }

    const files = reqFiles as {
      nrcFront?: Express.Multer.File[];
      nrcBack?: Express.Multer.File[];
    };

    const frontImage = files.nrcFront?.[0];
    const backImage = files.nrcBack?.[0];

    if (!frontImage || !backImage) {
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

    return {
      token,
      user: {
        id: user._id,
        role: user.role,
        verificationStatus: user.verificationStatus,
        merchantId: merchant._id,
      },
    };
  }

  async getAllUsers() {
    return await User.find({}, "_id");
  }
}

export const authService = new AuthService();
