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

  async getVerifiedMerchants() {
    const verifiedUsers = await User.find({
      role: "merchant",
      verificationStatus: "verified",
      status: "active", // Optional: only get active (non-banned) verified merchants
    })
      .populate("merchantId") // This fetches the IMerchant document
      .select("-password")
      .sort({ createdAt: -1 });

    return verifiedUsers;
  }

  async getMerchants(filter: any) {
    return await User.find(filter)
      .populate({
        path: "merchantId",
        // Hide the NRC fields inside the populated merchant object
        select:
          "-nrcRegion -nrcTownship -nrcType -nrcNumber -nrcBackImage -nrcFrontImage",
      })
      // This select only hides fields directly on the User (like password)
      .select("-password")
      .sort({ createdAt: -1 });
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

  // for admin
  async getMerchantInfo(merchantId: string) {
    const merchant = await Merchant.findById(merchantId);
    if (!merchant) throw new Error("Merchant info not found.");
    return merchant;
  }

  // for farmer
  async getMerchantById(userId: string) {
    return await User.findById(userId)
      .populate({
        path: "merchantId",
        // Hide the NRC fields inside the populated merchant object
        select:
          "-nrcRegion -nrcTownship -nrcType -nrcNumber -nrcBackImage -nrcFrontImage",
      })
      // This select only hides fields directly on the User (like password)
      .select("-password")
      .sort({ createdAt: -1 });
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
        "base64",
      )}`,
      "/agribridge/nrc",
    );

    const uploadedBack = await uploadSingleImage(
      `data:${backImage.mimetype};base64,${backImage.buffer.toString(
        "base64",
      )}`,
      "/agribridge/nrc",
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

  async getAllUsersByRole(role: any) {
    return await User.find({ role }, "_id");
  }

  async getUserDashboardStats() {
    // Get counts for different roles
    const activeFarmers = await User.countDocuments({
      role: "farmer",
      status: "active",
    });
    const totalMerchants = await User.countDocuments({
      role: "merchant",
      status: "active",
    });

    // Aggregate user growth for Chart (Last 6 months)
    const growthData = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ]);

    // Format data for Recharts: { name: "Jan", users: 400 }
    const formattedGrowth = growthData.map((item) => {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return {
        name: monthNames[item._id.month - 1],
        users: item.count,
      };
    });

    return { activeFarmers, totalMerchants, formattedGrowth };
  }
}

export const authService = new AuthService();
