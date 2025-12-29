import { MarketPrice } from "../models/marketPrice";
import { Market } from "../models/market";
import { Crop } from "../models/crop";
import { PipelineStage } from "mongoose"; // Added this import

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

  /**
   * Returns analytics comparing the latest price
   * to the previous entry for every crop in every market.
   */
  async getLatestMarketAnalytics() {
    const pipeline: PipelineStage[] = [
      // 1. Sort by newest first
      { $sort: { createdAt: -1 } },

      // 2. Group by Market and Crop
      {
        $group: {
          _id: { marketId: "$marketId", cropId: "$cropId" },
          recentRecords: {
            $push: {
              price: "$price",
              unit: "$unit",
              createdAt: "$createdAt",
            },
          },
        },
      },

      // 3. Keep only the first 2 items (Latest and Previous)
      {
        $project: {
          latest: { $arrayElemAt: ["$recentRecords", 0] },
          previous: { $arrayElemAt: ["$recentRecords", 1] },
        },
      },

      // 4. Populate Market Details
      {
        $lookup: {
          from: "markets", // MongoDB collection name
          localField: "_id.marketId",
          foreignField: "_id",
          as: "marketInfo",
        },
      },

      // 5. Populate Crop Details
      {
        $lookup: {
          from: "crops", // MongoDB collection name
          localField: "_id.cropId",
          foreignField: "_id",
          as: "cropInfo",
        },
      },

      { $unwind: "$marketInfo" },
      { $unwind: "$cropInfo" },

      // 6. Calculate Change and Final Format
      {
        $project: {
          _id: 0,
          marketId: "$_id.marketId",
          marketName: "$marketInfo.name",
          cropId: "$_id.cropId",
          cropName: "$cropInfo.name",
          category: "$cropInfo.category",
          price: "$latest.price",
          unit: "$latest.unit",
          updatedAt: "$latest.createdAt",
          previousPrice: "$previous.price",
          priceChange: {
            $cond: {
              if: { $ifNull: ["$previous.price", false] },
              then: { $subtract: ["$latest.price", "$previous.price"] },
              else: 0,
            },
          },
          priceChangePercent: {
            $cond: {
              if: { $ifNull: ["$previous.price", false] },
              then: {
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
              else: 0,
            },
          },
        },
      },
    ];

    return await MarketPrice.aggregate(pipeline);
  }
}

export const marketService = new MarketService();
