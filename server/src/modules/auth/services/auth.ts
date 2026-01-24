import { IUser, User } from "../models/user";
import { Merchant } from "../models/merchant";
import {
  deleteImage,
  uploadSingleImage,
} from "../../../shared/utils/cloudinary";
import generateToken from "../../../shared/utils/generateToken";
import { sendOtp, sendWelcome } from "../../../shared/utils/message";

// Helper to generate a 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export class AuthService {
  // --- OTP VERIFICATION & WELCOME ---
  async verifyOtp(identifier: string, otp: string) {
    const cleanId = identifier.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: cleanId }, { phone: cleanId }],
    });

    if (!user || !user.otp || !user.otpExpires)
      throw new Error("No active session found for this user.");

    if (new Date() > user.otpExpires)
      throw new Error("OTP has expired. Please request a new one.");

    const isMatch = await user.matchOtp(otp);
    if (!isMatch) throw new Error("Invalid OTP code.");

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;

    // LOGIC FIX:
    // Farmers are auto-verified upon OTP success.
    // Merchants remain 'unverified' or 'pending' until Admin approves NRC.
    if (user.role === "farmer") {
      user.verificationStatus = "verified";
    } else if (user.role === "merchant") {
      user.verificationStatus = "pending";
    }

    await user.save();

    // sendWelcome(user.email ? user.email : user.phone,user.name)
    return {
      token: generateToken(user),
      user: {
        id: user._id,
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
    };
  }

  // --- REGISTRATION (FARMER) ---
  async registerFarmer(body: any) {
    const { identifier, ...rest } = body;
    const cleanId = identifier.trim().toLowerCase();

    const exists = await User.findOne({
      $or: [{ email: cleanId }, { phone: cleanId }],
    });
    if (exists) throw new Error("This email or phone is already registered.");

    const otpCode = generateOtp();
    const userData: any = {
      ...rest,
      role: "farmer",
      [cleanId.includes("@") ? "email" : "phone"]: cleanId,
      otp: otpCode,
      otpExpires: new Date(Date.now() + 1 * 60 * 1000),
    };

    await User.create(userData);
    await sendOtp(cleanId, otpCode);

    return {
      message: `OTP sent to your ${cleanId.includes("@") ? "email" : "phone"}`,
    };
  }

  // --- REGISTRATION (MERCHANT) ---
  async registerMerchant(body: any, reqFiles: any) {
    const { identifier, password, ...rest } = body;
    const cleanId = identifier.trim().toLowerCase();

    const existingUser = await User.findOne({
      $or: [{ email: cleanId }, { phone: cleanId }],
    });
    if (existingUser)
      throw new Error("User with this phone or email already exists.");

    const files = reqFiles as {
      nrcFront?: Express.Multer.File[];
      nrcBack?: Express.Multer.File[];
    };
    if (!files?.nrcFront?.[0] || !files?.nrcBack?.[0])
      throw new Error("NRC images required.");

    const uploadedFront = await uploadSingleImage(
      `data:${files.nrcFront[0].mimetype};base64,${files.nrcFront[0].buffer.toString("base64")}`,
      "/agribridge/nrc",
    );
    const uploadedBack = await uploadSingleImage(
      `data:${files.nrcBack[0].mimetype};base64,${files.nrcBack[0].buffer.toString("base64")}`,
      "/agribridge/nrc",
    );

    const merchant: any = await Merchant.create({
      ...rest,
      nrcFrontImage: {
        url: uploadedFront.image_url,
        public_alt: uploadedFront.public_alt,
      },
      nrcBackImage: {
        url: uploadedBack.image_url,
        public_alt: uploadedBack.public_alt,
      },
    });

    const otpCode = generateOtp();
    const userData: any = {
      ...rest,
      role: "merchant",
      password,
      merchantId: merchant._id,
      verificationStatus: "unverified",
      otp: otpCode,
      otpExpires: new Date(Date.now() + 1 * 60 * 1000),
      [cleanId.includes("@") ? "email" : "phone"]: cleanId,
    };

    const user = await User.create(userData);
    await sendOtp(cleanId, otpCode);

    return { message: "Merchant registration initiated. OTP sent." };
  }

  // --- CHANGE EMAIL OR PHONE ---
  async requestIdentifierChange(userId: string, newIdentifier: string) {
    const cleanId = newIdentifier.trim().toLowerCase();

    const taken = await User.findOne({
      $or: [{ email: cleanId }, { phone: cleanId }],
    });
    if (taken) throw new Error("This email or phone is already in use.");

    const otpCode = generateOtp();

    // Store NEW identifier in temp field until verified
    await User.findByIdAndUpdate(userId, {
      tempIdentifier: cleanId,
      otp: otpCode,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtp(cleanId, otpCode);
    return { message: `Verification code sent to ${cleanId}.` };
  }

  async confirmIdentifierChange(userId: string, otp: string) {
    const user = await User.findById(userId);
    if (!user || !user.tempIdentifier)
      throw new Error("No pending change request.");

    const isMatch = await user.matchOtp(otp);
    if (!isMatch || new Date() > (user.otpExpires as Date))
      throw new Error("Invalid or expired OTP.");

    const isEmail = user.tempIdentifier.includes("@");

    // Move tempIdentifier to the actual field
    if (isEmail) {
      user.email = user.tempIdentifier;
    } else {
      user.phone = user.tempIdentifier;
    }

    user.tempIdentifier = undefined;
    user.otp = undefined;
    await user.save();

    return { message: "Contact information updated successfully." };
  }

  // --- LOGIN ---
  async login(identifier: string, password: string) {
    const cleanId = identifier.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: cleanId }, { phone: cleanId }],
    }).select("+password");

    if (!user) throw new Error("Invalid credentials");
    if (!user.password)
      throw new Error("Account error. Please reset your password.");

    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw new Error("Invalid credentials");

    return {
      token: generateToken(user),
      user: {
        id: user._id,
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
    };
  }

  // --- PROFILE UPDATES ---
  async updateAvatar(userId: string, file: Express.Multer.File) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.avatarPublicId) await deleteImage(user.avatarPublicId);

    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const uploaded = await uploadSingleImage(dataUri, "/agribridge/avatars");

    user.avatar = uploaded.image_url;
    user.avatarPublicId = uploaded.public_alt;
    await user.save();

    return { avatar: user.avatar };
  }

  async getFarmers() {
    return await User.find({ role: "farmer" }).sort({ createdAt: -1 });
  }

  async getAllMerchants() {
    return await User.find({ role: "merchant" }).sort({ createdAt: -1 });
  }

  async getVerifiedMerchants() {
    return await User.find({
      role: "merchant",
      verificationStatus: "verified",
      status: "active",
    })
      .populate("merchantId")
      .select("-password")
      .sort({ createdAt: -1 });
  }

  async getMerchants(filter: any) {
    return await User.find(filter)
      .populate({
        path: "merchantId",
        select:
          "-nrcRegion -nrcTownship -nrcType -nrcNumber -nrcBackImage -nrcFrontImage",
      })
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
    return await User.find({ verificationStatus: "pending" }).sort({
      createdAt: -1,
    });
  }

  async getMerchantInfo(merchantId: string) {
    const merchant = await Merchant.findById(merchantId);
    if (!merchant) throw new Error("Merchant info not found.");
    return merchant;
  }

  async getMerchantById(userId: string) {
    return await User.findById(userId)
      .populate({
        path: "merchantId",
        select:
          "-nrcRegion -nrcTownship -nrcType -nrcNumber -nrcBackImage -nrcFrontImage",
      })
      .select("-password");
  }

  async resendOtp(identifier: string) {
    const cleanId = identifier.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: cleanId }, { phone: cleanId }],
    });
    if (!user) throw new Error("User not found");

    const otpCode = generateOtp();
    user.otp = otpCode;
    user.otpExpires = new Date(Date.now() + 1 * 60 * 1000);
    await user.save();

    await sendOtp(cleanId, otpCode);
    return { message: "New OTP sent." };
  }

  async getUserProfile(userId: string) {
    const user = await User.findById(userId)
      .select("-password")
      .populate("merchantId");
    if (!user) throw new Error("User not found");
    return user;
  }

  async getAllUsers() {
    return await User.find({}, "_id");
  }

  async getAllUsersByRole(role: any) {
    return await User.find({ role }, "_id");
  }

  /**
   * Update Basic Profile Text Fields
   */
  async updateProfile(userId: string, updateData: Partial<IUser>) {
    // Prevent sensitive fields from being updated via this method
    const { password, role, merchantId, otp, ...safeData } = updateData as any;

    const user = await User.findByIdAndUpdate(userId, safeData, {
      new: true,
    }).select("-password");
    if (!user) throw new Error("User not found");
    return user;
  }

  /**
   * Update Merchant NRC Documents
   */
  async updateMerchantDocs(userId: string, reqFiles: any) {
    const user = await User.findById(userId);
    if (!user || user.role !== "merchant")
      throw new Error("Merchant not found");

    const files = reqFiles as {
      nrcFront?: Express.Multer.File[];
      nrcBack?: Express.Multer.File[];
    };

    const updateData: any = {};

    // Upload Front NRC if provided
    if (files?.nrcFront?.[0]) {
      const frontUri = `data:${files.nrcFront[0].mimetype};base64,${files.nrcFront[0].buffer.toString("base64")}`;
      const uploaded = await uploadSingleImage(frontUri, "/agribridge/nrc");
      updateData["nrcFrontImage.url"] = uploaded.image_url;
      updateData["nrcFrontImage.public_alt"] = uploaded.public_alt;
    }

    // Upload Back NRC if provided
    if (files?.nrcBack?.[0]) {
      const backUri = `data:${files.nrcBack[0].mimetype};base64,${files.nrcBack[0].buffer.toString("base64")}`;
      const uploaded = await uploadSingleImage(backUri, "/agribridge/nrc");
      updateData["nrcBackImage.url"] = uploaded.image_url;
      updateData["nrcBackImage.public_alt"] = uploaded.public_alt;
    }

    // Update the Merchant document
    await Merchant.findByIdAndUpdate(user.merchantId, { $set: updateData });

    // Set User status to pending for re-verification
    user.verificationStatus = "pending";
    await user.save();

    return { message: "Documents updated. Verification is now pending." };
  }

  async getUserDashboardStats() {
    // 1. Get Totals
    const activeFarmers = await User.countDocuments({
      role: "farmer",
      status: "active",
    });
    const totalMerchants = await User.countDocuments({
      role: "merchant",
      status: "active",
    });

    // 2. Aggregate Growth Data for both roles
    const growthData = await User.aggregate([
      { $match: { createdAt: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            role: "$role",
          },
          count: { $sum: 1 },
        },
      },
    ]);

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
    const chartMap = new Map();

    growthData.forEach((item) => {
      const monthKey = `${item._id.year}-${item._id.month}`;
      if (!chartMap.has(monthKey)) {
        chartMap.set(monthKey, {
          name: monthNames[item._id.month - 1],
          farmers: 0, // Initialize both
          merchants: 0,
          sortKey: item._id.year * 100 + item._id.month,
        });
      }
      const current = chartMap.get(monthKey);
      if (item._id.role === "farmer") current.farmers = item.count;
      if (item._id.role === "merchant") current.merchants = item.count;
    });

    const formattedGrowth = Array.from(chartMap.values())
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ sortKey, ...rest }) => rest);

    return { activeFarmers, totalMerchants, formattedGrowth };
  }
}

export const authService = new AuthService();
