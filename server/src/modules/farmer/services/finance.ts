import { Types } from "mongoose";
import { Entry } from "../models/entry";

export class FinanceService {
  async calculateFinance(userId: string) {
    const stats = await Entry.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
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
