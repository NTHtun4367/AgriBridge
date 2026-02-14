import { FarmerCrop } from "../models/crop";
import { Season } from "../models/season";
import { autoTranslate } from "../../../shared/utils/ai";

export class FarmerService {
  async getActiveSeason(userId: string) {
    const season = await Season.findOne({ userId, isActive: true }).lean();

    return season;
  }

  async startSeason(userId: string, name: string) {
    await Season.updateMany({ userId, isActive: true }, { isActive: false });

    let season = await Season.findOne({ userId, name });

    if (!season) {
      season = await Season.create({
        userId,
        name,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)),
      });
    } else {
      season.isActive = true;
      await season.save();
    }
    return season;
  }

  async registerCropsBulk(userId: string, seasonId: string, crops: any[]) {
    const season = await Season.findOne({
      _id: seasonId,
      userId,
      isActive: true,
    });
    if (!season) throw new Error("Season not active or not found");

    const formattedCrops = crops.map((crop) => ({
      cropName: crop.cropName,
      variety: crop.variety,
      areaSize: Number(crop.areaSize),
      userId,
      seasonId,
    }));

    return await FarmerCrop.insertMany(formattedCrops);
  }

  async getCropsBySeason(userId: string, seasonId: string) {
    const crops = await FarmerCrop.find({ userId, seasonId }).lean();

    return crops;
  }

  async endSeason(userId: string, seasonId: string) {
    return await Season.findOneAndUpdate(
      { _id: seasonId, userId },
      { isActive: false },
      { new: true },
    );
  }
}

export const farmerService = new FarmerService();
