import { MarketPrice } from "../models/marketPrice";
import { Market } from "../models/market";
import { Crop } from "../models/crop";
import { PipelineStage, Types } from "mongoose"; // Added this import

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
      // STAGE 1: Sort documents so latest ones are on top
      // This utilizes your compound index for maximum speed
      { $sort: { marketId: 1, cropId: 1, createdAt: -1 } },

      // STAGE 2: Group by Market and Crop
      // We push records into an array; because of the sort, index 0 is latest
      {
        $group: {
          _id: { marketId: "$marketId", cropId: "$cropId" },
          records: {
            $push: {
              price: "$price",
              unit: "$unit",
              createdAt: "$createdAt",
            },
          },
        },
      },

      // STAGE 3: Extract specific records from the array
      {
        $project: {
          latest: { $arrayElemAt: ["$records", 0] },
          previous: { $arrayElemAt: ["$records", 1] },
        },
      },

      // STAGE 4: Join with Markets collection
      {
        $lookup: {
          from: "markets",
          localField: "_id.marketId",
          foreignField: "_id",
          as: "marketInfo",
        },
      },

      // STAGE 5: Join with Crops collection
      {
        $lookup: {
          from: "crops",
          localField: "_id.cropId",
          foreignField: "_id",
          as: "cropInfo",
        },
      },

      // Flatten the joined arrays
      { $unwind: "$marketInfo" },
      { $unwind: "$cropInfo" },

      // STAGE 6: Final Formatting and Calculations
      {
        $project: {
          _id: 0,
          marketId: "$_id.marketId",
          marketName: "$marketInfo.name",
          cropId: "$_id.cropId",
          cropName: "$cropInfo.name",
          category: "$cropInfo.category",
          currentPrice: "$latest.price",
          unit: "$latest.unit",
          lastUpdated: "$latest.createdAt",
          previousPrice: { $ifNull: ["$previous.price", null] },

          // Calculate raw price difference
          priceChange: {
            $cond: {
              if: { $gt: ["$previous.price", null] }, // Check if previous price exists
              then: { $subtract: ["$latest.price", "$previous.price"] },
              else: 0,
            },
          },

          // Calculate percentage change (with rounding)
          priceChangePercent: {
            $cond: {
              if: { $gt: ["$previous.price", 0] }, // Avoid division by zero
              then: {
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
                  2, // Round to 2 decimal places
                ],
              },
              else: 0,
            },
          },
        },
      },

      // Optional: Sort the final output by market name
      { $sort: { marketName: 1, cropName: 1 } },
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
