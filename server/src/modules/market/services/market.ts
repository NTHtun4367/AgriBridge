import { MarketPrice } from "../models/marketPrice";
import { Market } from "../models/market";
import { Crop } from "../models/crop";
import { PipelineStage, Types } from "mongoose";

export class MarketService {
  // --- CROP CRUD ---
  async getCrops() {
    return await Crop.find().sort({ category: 1, name: 1 });
  }

  async createCrop(data: { name: string; category: "rice" | "beans" }) {
    return await Crop.create(data);
  }

  async updateCrop(
    id: string,
    data: Partial<{ name: string; category: "rice" | "beans" }>,
  ) {
    const crop = await Crop.findByIdAndUpdate(id, data, { new: true });
    if (!crop) throw new Error("Crop not found");
    return crop;
  }

  async deleteCrop(id: string) {
    const inUse = await MarketPrice.findOne({ cropId: id });
    if (inUse) throw new Error("Cannot delete crop that has price history");
    return await Crop.findByIdAndDelete(id);
  }

  // --- MARKET CRUD ---
  async getMarkets() {
    return await Market.find().sort({ name: 1 });
  }

  async createMarket(data: {
    name: string;
    region: string;
    isActive?: boolean;
  }) {
    return await Market.create(data);
  }

  async updateMarket(id: string, data: any) {
    const market = await Market.findByIdAndUpdate(id, data, { new: true });
    if (!market) throw new Error("Market not found");
    return market;
  }

  async deleteMarket(id: string) {
    return await Market.findByIdAndDelete(id);
  }

  async updatePrices(
    marketId: string | undefined,
    updates: any[],
    userId: string,
  ) {
    let marketInfo = null;

    if (marketId) {
      marketInfo = await Market.findById(marketId);
      if (!marketInfo) {
        throw new Error("Market not found");
      }
    }

    const priceEntries = updates.map((item: any) => ({
      marketId: marketId || undefined,
      cropId: item.cropId,
      price: item.price,
      amount: item.amount, // Added amount
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

  async getLatestMarketAnalytics(filters: {
    userId?: string;
    official?: boolean;
    marketId?: string;
  }) {
    const matchStage: any = {};

    if (filters.official) {
      matchStage.marketId = { $exists: true, $ne: null };
    } else if (filters.userId) {
      matchStage.userId = new Types.ObjectId(filters.userId);
    }

    if (filters.marketId && filters.marketId !== "all") {
      matchStage.marketId = new Types.ObjectId(filters.marketId);
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      { $sort: { marketId: 1, userId: 1, cropId: 1, createdAt: -1 } },
      {
        $group: {
          _id: {
            marketId: "$marketId",
            userId: "$userId",
            cropId: "$cropId",
          },
          records: {
            $push: {
              price: "$price",
              amount: "$amount", // Added to grouping
              unit: "$unit",
              createdAt: "$createdAt",
            },
          },
        },
      },
      {
        $project: {
          latest: { $arrayElemAt: ["$records", 0] },
          previous: { $arrayElemAt: ["$records", 1] },
        },
      },
      {
        $lookup: {
          from: "markets",
          localField: "_id.marketId",
          foreignField: "_id",
          as: "marketDetails",
        },
      },
      {
        $lookup: {
          from: "crops",
          localField: "_id.cropId",
          foreignField: "_id",
          as: "cropDetails",
        },
      },
      { $unwind: { path: "$marketDetails", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$cropDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          marketId: { $ifNull: ["$_id.marketId", "personal"] },
          marketName: { $ifNull: ["$marketDetails.name", "Private Inventory"] },
          cropId: "$_id.cropId",
          cropName: "$cropDetails.name",
          category: "$cropDetails.category",
          currentPrice: "$latest.price",
          amount: "$latest.amount", // Added to final projection
          unit: "$latest.unit",
          updatedAt: "$latest.createdAt",
          previousPrice: { $ifNull: ["$previous.price", null] },
          priceChange: {
            $cond: [
              { $gt: ["$previous.price", null] },
              { $subtract: ["$latest.price", "$previous.price"] },
              0,
            ],
          },
          priceChangePercent: {
            $cond: [
              {
                $and: [
                  { $gt: ["$previous.price", 0] },
                  { $ne: ["$previous.price", null] },
                ],
              },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $subtract: ["$latest.price", "$previous.price"] },
                          "$previous.price",
                        ],
                      },
                      100,
                    ],
                  },
                  2,
                ],
              },
              0,
            ],
          },
        },
      },
      { $sort: { updatedAt: -1 } },
    ];

    return await MarketPrice.aggregate(pipeline);
  }

  async getCropPriceHistory(cropId: string, marketId: string) {
    return await MarketPrice.aggregate([
      {
        $match: {
          cropId: new Types.ObjectId(cropId),
          marketId: new Types.ObjectId(marketId),
        },
      },
      { $sort: { createdAt: 1 } },
      { $limit: 30 },
      {
        $project: {
          _id: 0,
          date: "$createdAt",
          price: "$price",
          amount: "$amount", // Added to history for tooltip data
        },
      },
    ]);
  }
}

export const marketService = new MarketService();
