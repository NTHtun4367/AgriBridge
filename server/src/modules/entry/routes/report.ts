import express, { Request, Response } from "express";
import { Types } from "mongoose";
import axios from "axios";
import { Entry } from "../models/entry";

const router = express.Router();

// Updated Hugging Face model (instruction-tuned)
const HF_MODEL =
  "https://router.huggingface.co/models/meta-llama/Llama-3-7b-instruct-hf";

/**
 * 1. Seasonal Summary
 */
router.get("/seasonal-summary/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const report = await Entry.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$season",
          income: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$value", 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$value", 0] },
          },
        },
      },
      {
        $project: {
          season: { $ifNull: ["$_id", "Unknown"] },
          totalIncome: "$income",
          totalExpense: "$expense",
          netProfit: { $subtract: ["$income", "$expense"] },
          _id: 0,
        },
      },
      { $sort: { season: -1 } },
    ]);

    res.json(report);
  } catch (err) {
    console.error("Aggregation Error:", err);
    res.status(500).json({ message: "Failed to generate seasonal report" });
  }
});

/**
 * 2. AI Analysis (Hugging Face Router API)
 */
router.post("/ai-analyze", async (req: Request, res: Response) => {
  const { userId, season } = req.body;

  try {
    if (!userId || !season) {
      return res
        .status(400)
        .json({ message: "UserId and Season are required" });
    }

    const entries = await Entry.find({
      userId: new Types.ObjectId(userId),
      season,
    });

    if (!entries.length) {
      return res.json({
        advice: "No financial records found for this season to analyze.",
      });
    }

    const summary = entries
      .map(
        (e) =>
          `- ${e.type.toUpperCase()}: ${e.category} (${e.value} MMK)${
            e.notes ? ` - ${e.notes}` : ""
          }`,
      )
      .join("\n");

    const prompt = `
You are an AI Agricultural Financial Consultant.

Analyze the following records for the "${season}" season.

DATA:
${summary}

TASKS:
1. Summarize total income vs total expenses.
2. Identify the highest expense category.
3. Give 2 actionable farming tips to improve profit next season.

Respond in Markdown. Be concise, professional, and practical.
`;

    // Call Hugging Face Router API
    const response = await axios.post(
      HF_MODEL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.4,
        },
        options: {
          wait_for_model: true,
          use_cache: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 120_000,
      },
    );

    const advice =
      response.data?.generated_text || "AI could not generate a response.";

    res.json({ advice });
  } catch (error: any) {
    console.error(
      "HF Router API Error:",
      error?.response?.data || error.message,
    );
    res.status(500).json({
      message: "AI Analysis failed to process.",
      details: error?.response?.data || error.message,
    });
  }
});

export default router;
