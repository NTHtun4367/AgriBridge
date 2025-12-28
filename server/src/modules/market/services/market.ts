import { MarketPrice } from "../models/marketPrice";
import { Market } from "../models/market";
import { Crop } from "../models/crop";

export class MarketService {
  async updatePrices(marketId: string, updates: any[], userId: string) {
    const marketInfo = await Market.findById(marketId);
    if (!marketInfo) {
      throw new Error("Market not found");
    }

    const priceEntries = updates.map((item: any) => ({
      marketId,
      cropId: item.cropId,
      price: item.price,
      unit: item.unit,
      userId,
    }));

    const savedRecords = await MarketPrice.insertMany(priceEntries);

    return { savedRecords, marketInfo };
  }

  async getLatestPrices() {
    return await MarketPrice.find()
      .populate("marketId", "name")
      .populate("cropId", "name")
      .sort({ createdAt: -1 });
  }

  async getCrops() {
    return await Crop.find().sort({ category: 1, name: 1 });
  }

  async getMarkets() {
    return await Market.find({ isActive: true }).sort({ name: 1 });
  }
}

export const marketService = new MarketService();
