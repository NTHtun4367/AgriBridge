import { Types } from "mongoose";
import { Entry } from "../../entry/models/entry";

export class FinanceService {
  async calculateFinance(userId: string, season?: string) {
    // Build the match query dynamically
    const matchQuery: any = { userId: new Types.ObjectId(userId) };

    // If a specific season is requested, add it to the filter
    if (season && season !== "all") {
      matchQuery.season = season;
    }

    const stats = await Entry.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$value", 0] },
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$value", 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpense: 1,
          profit: { $subtract: ["$totalIncome", "$totalExpense"] },
        },
      },
    ]);

    return stats[0] || { totalIncome: 0, totalExpense: 0, profit: 0 };
  }
}

export const financeService = new FinanceService();
