// backend/src/modules/agriculture/routes/report.ts
import express, { Request, Response } from "express";
import { Types } from "mongoose";
import Groq from "groq-sdk";
import { Entry } from "../models/entry";
import { FarmerCrop } from "../../farmer/models/crop";
import { marketService } from "../../market/services/market";
import { ENV } from "../../../shared/utils/env";
import asyncHandler from "../../../shared/utils/asyncHandler";

const router = express.Router();
const groq = new Groq({ apiKey: ENV.GROQ_API_KEY! });

/**
 * AI-powered Farm Analysis: Categorical ROI & Regional Market Intelligence
 */
(router.post("/ai-analyze", async (req: Request, res: Response) => {
  const { userId, season } = req.body;

  if (!userId || !season) {
    return res.status(400).json({ message: "UserId and Season are required" });
  }

  // 1️⃣ Parallel Data Fetching for performance
  const [entries, farmerCrops, allMarketData] = await Promise.all([
    Entry.find({ userId: new Types.ObjectId(userId), season }),
    FarmerCrop.find({ userId: new Types.ObjectId(userId) }),
    marketService.getLatestMarketAnalytics({ official: true }),
  ]);

  if (!entries.length && !farmerCrops.length) {
    return res.json({
      advice:
        "ခွဲခြမ်းစိတ်ဖြာရန် ဒေတာမလုံလောက်သေးပါ။ ဘဏ္ဍာရေးမှတ်တမ်းနှင့် စိုက်ပျိုးသီးနှံအချက်အလက်များ ထည့်သွင်းပါ။",
    });
  }

  // 2️⃣ Categorical Financial Processing
  // Groups income/expense by category (e.g., Grains, Pulses, Oilseeds)
  const categoryStats: Record<
    string,
    { income: number; expense: number; acres: number; crops: string[] }
  > = {};

  farmerCrops.forEach((crop) => {
    const cat = crop.variety || "General";
    if (!categoryStats[cat]) {
      categoryStats[cat] = { income: 0, expense: 0, acres: 0, crops: [] };
    }
    categoryStats[cat].acres += crop.areaSize || 0;
    if (!categoryStats[cat].crops.includes(crop.cropName)) {
      categoryStats[cat].crops.push(crop.cropName);
    }
  });

  entries.forEach((entry) => {
    const cat = entry.category || "General";
    if (!categoryStats[cat]) {
      categoryStats[cat] = { income: 0, expense: 0, acres: 0, crops: [] };
    }
    if (entry.type === "income") categoryStats[cat].income += entry.value;
    else categoryStats[cat].expense += entry.value;
  });

  // 3️⃣ Regional Hub Comparison (Filtering and grouping market data)
  const userCropNames = farmerCrops.map((c) => c.cropName.toLowerCase());
  const hubComparison: Record<string, string[]> = {};

  (allMarketData || []).forEach((m: any) => {
    const hubName = m.marketName || "အထွေထွေဈေးကွက်";
    if (userCropNames.includes(m.cropName.toLowerCase())) {
      if (!hubComparison[hubName]) hubComparison[hubName] = [];
      hubComparison[hubName].push(
        `- ${m.cropName}: ${m.currentPrice.toLocaleString()} MMK (${m.priceChangePercent}% ${m.priceChangePercent > 0 ? "📈" : "📉"})`,
      );
    }
  });

  // Format strings for the AI prompt
  const financialText = Object.entries(categoryStats)
    .map(
      ([cat, s]) =>
        `* ${cat} (${s.crops.join(", ")}): ဝင်ငွေ ${s.income.toLocaleString()} / အသုံးစရိတ် ${s.expense.toLocaleString()} (${s.acres} ဧက)`,
    )
    .join("\n");

  const marketText =
    Object.keys(hubComparison).length > 0
      ? Object.entries(hubComparison)
          .map(([hub, prices]) => `📍 ${hub}:\n${prices.join("\n")}`)
          .join("\n\n")
      : "သက်ဆိုင်ရာ ဈေးကွက်ဒေတာ မရှိသေးပါ။";

  const totalAcres = farmerCrops.reduce((s, c) => s + (c.areaSize || 0), 0);
  const totalIncome = entries
    .filter((e) => e.type === "income")
    .reduce((s, e) => s + e.value, 0);
  const totalExpense = entries
    .filter((e) => e.type === "expense")
    .reduce((s, e) => s + e.value, 0);

  // 4️⃣ The Unified Prompt
  const systemPrompt = `
You are an "Advanced Agricultural Advisor" for Myanmar farmers.
Analyze farm finances, crop allocations, and market trends.
Provide responses in **Markdown format** with clear sections and bullet points.
Use Burmese for explanations, but keep numbers in standard digits (MMK for currency, acres for land area).
Focus on actionable advice for the current and next season.
`;

  const userPrompt = `
ရာသီ: ${season}
စုစုပေါင်းစိုက်ဧက: ${totalAcres} ဧက
စုစုပေါင်းဝင်ငွေ: ${totalIncome.toLocaleString()} MMK
စုစုပေါင်းအသုံးစရိတ်: ${totalExpense.toLocaleString()} MMK

## ၁။ အမျိုးအစားအလိုက် ဘဏ္ဍာရေး (Categorical Financials)
${financialText}

## ၂။ သီးနှံအခြေအနေ (Crop Performance)
- ${farmerCrops.map((c) => `${c.cropName} (${c.variety}): ${c.areaSize || 0} ဧက`).join("\n- ")}

## ၃။ ဈေးကွက်ဗျူဟာ (Market Overview by Region)
${marketText}

## ၄။ အကြံပြုချက်များ (Recommendations)
- Financial: အမြတ်အစွန်းတိုးဖို့ လုပ်နိုင်သော အချက်များ
- Crop Strategy: တိုးချဲ့ရန် သို့မဟုတ် လျော့ချရန် အမျိုးအစားများ
- Market Strategy: ဈေးနှုန်းအပေါ် မူတည်၍ ရောင်းချမှု/သိုလှောင်မှု
- Risk Assessment: အန္တရာယ်နှုန်း (1–10)
`;

  // 5️⃣ AI Request
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  res.json({
    advice:
      completion.choices[0]?.message?.content ||
      "ခွဲခြမ်းစိတ်ဖြာမှု မပြုလုပ်နိုင်ပါ။",
    isTailored: Object.keys(hubComparison).length > 0,
    stats: { totalIncome, totalExpense, totalAcres, categoryStats },
  });
}),
  /**
   * Seasonal Dashboard Summary API
   */
  router.get(
    "/seasonal-summary/:userId",
    asyncHandler(async (req: Request, res: Response) => {
      const { userId } = req.params;

      const report = await Entry.aggregate([
        { $match: { userId: new Types.ObjectId(userId) } },
        {
          $group: {
            _id: "$season",
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
            season: { $ifNull: ["$_id", "Unknown Season"] },
            totalIncome: 1,
            totalExpense: 1,
            netProfit: { $subtract: ["$totalIncome", "$totalExpense"] },
            _id: 0,
          },
        },
        { $sort: { season: -1 } },
      ]);

      res.json(report);
    }),
  ));

export default router;
