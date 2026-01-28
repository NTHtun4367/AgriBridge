import { IUser, User } from "../models/user";
import { Merchant } from "../models/merchant";
import {
  deleteImage,
  uploadSingleImage,
} from "../../../shared/utils/cloudinary";
import generateToken from "../../../shared/utils/generateToken";
import { sendOtp } from "../../../shared/utils/message";

// --- HELPERS ---

/**
 * Generates a 6-digit numeric OTP string
 */
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Simple regex helper for email validation
 */
const isEmailFormat = (identifier: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

export class AuthService {
  // --- REGISTRATION (FARMER) ---

  async registerFarmer(body: any) {
    const { identifier, ...rest } = body;
    const cleanId = identifier.trim().toLowerCase();
    const isEmail = cleanId.includes("@");

    const exists = await User.findOne({
      $or: [{ email: cleanId }, { phone: cleanId }],
    });
    if (exists) throw new Error("This email or phone is already registered.");

    const otpCode = generateOtp();
    const userData: any = {
      ...rest,
      role: "farmer",
      [isEmail ? "email" : "phone"]: cleanId,
      // If Email: unverified + needs OTP. If Phone: verified immediately.
      // verificationStatus: isEmail ? "unverified" : "verified",
      verificationStatus: "verified",
      otp: isEmail ? otpCode : undefined,
      otpExpires: isEmail ? new Date(Date.now() + 5 * 60 * 1000) : undefined,
    };

    const user: any = await User.create(userData);

    // if (isEmail) {
    //   await sendOtp(cleanId, otpCode);
    //   return {
    //     message: "OTP sent to your email.",
    //     requiresOtp: true,
    //     identifier: cleanId,
    //   };
    // }

    return {
      message: "Registration successful!",
      requiresOtp: false,
      token: generateToken(user),
      user: {
        id: user._id,
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
    };
  }

  // --- REGISTRATION (MERCHANT) ---

  async registerMerchant(body: any, reqFiles: any) {
    const { identifier, password, ...rest } = body;
    const cleanId = identifier.trim().toLowerCase();
    const isEmail = cleanId.includes("@");

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

    // Upload NRC images to Cloudinary
    const uploadedFront = await uploadSingleImage(
      `data:${files.nrcFront[0].mimetype};base64,${files.nrcFront[0].buffer.toString("base64")}`,
      "/agribridge/nrc",
    );
    const uploadedBack = await uploadSingleImage(
      `data:${files.nrcBack[0].mimetype};base64,${files.nrcBack[0].buffer.toString("base64")}`,
      "/agribridge/nrc",
    );

    // Create Merchant document first to link to User
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
      password,
      role: "merchant",
      merchantId: merchant._id,
      [isEmail ? "email" : "phone"]: cleanId,
      // Email must verify OTP. Phone goes straight to 'pending' for Admin review.
      // verificationStatus: isEmail ? "unverified" : "pending",
      verificationStatus: "pending",
      otp: isEmail ? otpCode : undefined,
      otpExpires: isEmail ? new Date(Date.now() + 5 * 60 * 1000) : undefined,
    };

    const user = await User.create(userData);

    // if (isEmail) {
    //   await sendOtp(cleanId, otpCode);
    //   return {
    //     message: "OTP sent to email.",
    //     requiresOtp: true,
    //     identifier: cleanId,
    //   };
    // }

    return {
      message: "Merchant registered. Pending admin approval.",
      requiresOtp: false,
    };
  }

  // --- AUTH FLOWS ---

  async login(identifier: string, password: string) {
    const cleanId = identifier.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: cleanId }, { phone: cleanId }],
    }).select("+password");

    if (!user || !user.password) throw new Error("Invalid credentials");
    if (!(await user.matchPassword(password)))
      throw new Error("Invalid credentials");

    // Block unverified email users
    if (user.verificationStatus === "unverified" && user.email) {
      throw new Error("Please verify your email via OTP before logging in.");
    }

    return {
      token: generateToken(user),
      user: {
        id: user._id,
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
    };
  }

  async verifyOtp(identifier: string, otp: string) {
    const cleanId = identifier.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: cleanId }, { phone: cleanId }],
    });

    if (!user || !user.otp || !user.otpExpires)
      throw new Error("No active verification session.");
    if (new Date() > user.otpExpires) throw new Error("OTP expired.");
    if (!(await user.matchOtp(otp))) throw new Error("Invalid OTP.");

    user.otp = undefined;
    user.otpExpires = undefined;
    // Farmer becomes verified, Merchant stays pending for NRC review
    user.verificationStatus = user.role === "farmer" ? "verified" : "pending";
    await user.save();

    return {
      token: generateToken(user),
      user: {
        id: user._id,
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
    };
  }

  async resendOtp(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) throw new Error("User with this email not found.");

    const otpCode = generateOtp();
    user.otp = otpCode;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendOtp(cleanEmail, otpCode);
    return { message: "New OTP sent to your email." };
  }

  // --- EMAIL MANAGEMENT ---

  async requestEmailChange(userId: string, newEmail: string) {
    const cleanEmail = newEmail.trim().toLowerCase();
    const taken = await User.findOne({ email: cleanEmail });
    if (taken) throw new Error("This email is already in use.");

    const otpCode = generateOtp();
    await User.findByIdAndUpdate(userId, {
      tempIdentifier: cleanEmail,
      otp: otpCode,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtp(cleanEmail, otpCode);
    return { message: `Verification code sent to ${cleanEmail}.` };
  }

  async confirmEmailChange(userId: string, otp: string) {
    const user = await User.findById(userId);
    if (!user || !user.tempIdentifier)
      throw new Error("No pending email change request.");

    const isMatch = await user.matchOtp(otp);
    if (!isMatch || new Date() > (user.otpExpires as Date))
      throw new Error("Invalid or expired OTP.");

    user.email = user.tempIdentifier;
    user.tempIdentifier = undefined;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return { message: "Email updated successfully." };
  }

  // --- PROFILE & USER QUERIES ---

  async getUserProfile(userId: string) {
    const user = await User.findById(userId)
      .select("-password")
      .populate("merchantId");
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateProfile(userId: string, updateData: Partial<IUser>) {
    const { password, role, merchantId, otp, ...safeData } = updateData as any;
    const user = await User.findByIdAndUpdate(userId, safeData, {
      new: true,
    }).select("-password");
    if (!user) throw new Error("User not found");
    return user;
  }

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

  async findUserAndUpdate(userId: string, updateData: object) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) throw new Error("User not found!");
    return user;
  }

  // --- MERCHANT MANAGEMENT ---

  async updateMerchantDocs(userId: string, reqFiles: any) {
    const user = await User.findById(userId);
    if (!user || user.role !== "merchant")
      throw new Error("Merchant not found");

    const files = reqFiles as {
      nrcFront?: Express.Multer.File[];
      nrcBack?: Express.Multer.File[];
    };
    const updateData: any = {};

    if (files?.nrcFront?.[0]) {
      const uri = `data:${files.nrcFront[0].mimetype};base64,${files.nrcFront[0].buffer.toString("base64")}`;
      const uploaded = await uploadSingleImage(uri, "/agribridge/nrc");
      updateData["nrcFrontImage.url"] = uploaded.image_url;
      updateData["nrcFrontImage.public_alt"] = uploaded.public_alt;
    }

    if (files?.nrcBack?.[0]) {
      const uri = `data:${files.nrcBack[0].mimetype};base64,${files.nrcBack[0].buffer.toString("base64")}`;
      const uploaded = await uploadSingleImage(uri, "/agribridge/nrc");
      updateData["nrcBackImage.url"] = uploaded.image_url;
      updateData["nrcBackImage.public_alt"] = uploaded.public_alt;
    }

    await Merchant.findByIdAndUpdate(user.merchantId, { $set: updateData });
    user.verificationStatus = "pending";
    await user.save();

    return { message: "Documents updated. Verification is now pending." };
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

  async getAllMerchants() {
    return await User.find({ role: "merchant" }).sort({ createdAt: -1 });
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

  // --- GENERAL USER QUERIES ---

  async getFarmers() {
    return await User.find({ role: "farmer" }).sort({ createdAt: -1 });
  }

  async getPendingUsers() {
    return await User.find({ verificationStatus: "pending" }).sort({
      createdAt: -1,
    });
  }

  async getAllUsers() {
    return await User.find({}, "_id");
  }

  async getAllUsersByRole(role: any) {
    return await User.find({ role }, "_id");
  }

  // --- DASHBOARD ANALYTICS ---

  async getUserDashboardStats() {
    const activeFarmers = await User.countDocuments({
      role: "farmer",
      status: "active",
    });
    const totalMerchants = await User.countDocuments({
      role: "merchant",
      status: "active",
    });

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
          farmers: 0,
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

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await User.findById(userId).select("+password");
    if (!user || !user.password) {
      throw new Error("User not found");
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }

    if (newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    user.password = newPassword;
    await user.save();

    return { message: "Password updated successfully" };
  }

  async deleteAccount(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Remove avatar
    if (user.avatarPublicId) {
      await deleteImage(user.avatarPublicId);
    }

    // Merchant cleanup
    if (user.role === "merchant" && user.merchantId) {
      const merchant = await Merchant.findById(user.merchantId);

      if (merchant?.nrcFrontImage?.public_alt) {
        await deleteImage(merchant.nrcFrontImage.public_alt);
      }

      if (merchant?.nrcBackImage?.public_alt) {
        await deleteImage(merchant.nrcBackImage.public_alt);
      }

      await Merchant.findByIdAndDelete(user.merchantId);
    }

    await User.findByIdAndDelete(userId);

    return { message: "Account deleted successfully" };
  }
}

export const authService = new AuthService();
