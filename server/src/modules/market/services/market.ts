import { MarketPrice } from "../models/marketPrice";
import { Market } from "../models/market";
import { Crop } from "../models/crop";
import { PipelineStage, Types } from "mongoose"; // Added this import

export class MarketService {
  async updatePrices(
    marketId: string | undefined,
    updates: any[],
    userId: string
  ) {
    let marketInfo = null;

    // 1. Only look up market if marketId is provided (Admin path)
    if (marketId) {
      marketInfo = await Market.findById(marketId);
      if (!marketInfo) {
        throw new Error("Market not found");
      }
    }

    // 2. Map entries - marketId will be undefined for Merchants
    const priceEntries = updates.map((item: any) => ({
      marketId: marketId || undefined,
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

  async getLatestMarketAnalytics(filters: {
    userId?: string;
    official?: boolean;
  }) {
    const matchStage: any = {};

    // 1. FILTERING
    if (filters.official) {
      // Show only official market updates
      matchStage.marketId = { $exists: true, $ne: null };
    } else if (filters.userId) {
      // Show only records for a specific merchant profile
      matchStage.userId = new Types.ObjectId(filters.userId);
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },

      // Sort so the most recent is at the top
      { $sort: { marketId: 1, userId: 1, cropId: 1, createdAt: -1 } },

      // Group by the "Market-User-Crop" unique trio
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

      // LOOKUPS
      {
        $lookup: {
          from: "markets", // Make sure this matches your MongoDB collection name
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

      // CRITICAL FIX: preserveNullAndEmptyArrays
      // If marketDetails is empty (Merchant price), this keeps the record alive
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
          unit: "$latest.unit",
          updatedAt: "$latest.createdAt",
          previousPrice: { $ifNull: ["$previous.price", null] },

          // Math for price changes
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
      { $sort: { createdAt: 1 } }, // Sort oldest to newest for the chart
      { $limit: 30 }, // Get last 30 days/entries
      {
        $project: {
          _id: 0,
          date: "$createdAt",
          price: "$price",
        },
      },
    ]);
  }
}

export const marketService = new MarketService();
