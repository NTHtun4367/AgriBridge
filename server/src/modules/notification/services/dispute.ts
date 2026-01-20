import { authService } from "../../auth/services/auth";
import { Dispute, IDispute } from "../models/dispute";
import { notificationService } from "./notification";
import { Types } from "mongoose";

export class DisputeService {
  async createDispute(disputeData: Partial<IDispute>): Promise<IDispute> {
    const dispute = new Dispute(disputeData);
    const savedDispute = await dispute.save();

    try {
      const admins = await authService.getAllUsersByRole("admin");
      const adminIds = admins.map((u) => u._id.toString());

      if (adminIds.length) {
        await notificationService.createNotification(
          "New Dispute Raised",
          `Farmer filed a dispute: ${savedDispute.reason}`,
          adminIds,
          "admin",
        );
      }
    } catch (err) {
      console.error("Admin notification failed:", err);
    }

    return savedDispute;
  }

  async getDisputesByFarmerId(farmerId: string): Promise<any[]> {
    const disputes = await Dispute.find({
      farmerId: new Types.ObjectId(farmerId),
    })
      .sort({ createdAt: -1 })
      .lean();

    return Promise.all(
      disputes.map(async (d) => {
        try {
          const merchantUser = await authService.getMerchantById(
            d.merchantId.toString(),
          );

          return {
            ...d,
            merchantId: {
              _id: merchantUser?._id,
              name: merchantUser?.name,
              email: merchantUser?.email,
              // phoneNumber: merchantUser?.phone, // Added for frontend
              merchantId: merchantUser?.merchantId,
              merchantAddress: `${merchantUser?.division},${merchantUser?.district},${merchantUser?.township},${merchantUser?.homeAddress}`,
            },
          };
        } catch {
          return {
            ...d,
            merchantId: { name: "Unknown Merchant", email: "N/A" },
          };
        }
      }),
    );
  }

  /** ✅ ADMIN - Populates farmerId and merchantId manually */
  async getAllDisputes() {
    const disputes = await Dispute.find().sort({ createdAt: -1 }).lean();

    return Promise.all(
      disputes.map(async (d) => {
        try {
          const farmer = await authService.getUserProfile(
            d.farmerId.toString(),
          );
          const merchantUser = await authService.getMerchantById(
            d.merchantId.toString(),
          );

          return {
            ...d,
            // Rename keys to match frontend's "merchantId.name" / "farmerId.name"
            farmerId: {
              _id: farmer._id,
              name: farmer.name,
              email: farmer.email,
            },
            merchantId: {
              _id: merchantUser?._id,
              name: merchantUser?.name,
              email: merchantUser?.email,
              // Pass business info so frontend can use merchantId.merchantId.businessName
              merchantId: merchantUser?.merchantId,
            },
          };
        } catch {
          return {
            ...d,
            farmerId: { name: "Deleted User", email: "N/A" },
            merchantId: { name: "Deleted User", email: "N/A" },
          };
        }
      }),
    );
  }

  async updateStatus(id: string, status: string) {
    return Dispute.findByIdAndUpdate(id, { status }, { new: true });
  }
}

export const disputeService = new DisputeService();
