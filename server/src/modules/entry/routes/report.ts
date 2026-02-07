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
 * AI-powered Farm Analysis with Filtered Market Context
 */
(router.post("/ai-analyze", async (req: Request, res: Response) => {
  const { userId, season } = req.body;

  if (!userId || !season) {
    return res.status(400).json({ message: "UserId and Season are required" });
  }

  // 1️⃣ Fetch Financials, Crop Allocations, and Market Prices
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

  // 2️⃣ Financial Processing
  const totalExpense = entries
    .filter((e) => e.type === "expense")
    .reduce((s, e) => s + e.value, 0);
  const totalIncome = entries
    .filter((e) => e.type === "income")
    .reduce((s, e) => s + e.value, 0);

  // 3️⃣ Crop Allocation Processing
  const totalAcres = farmerCrops.reduce((s, c) => s + (c.areaSize || 0), 0);
  const userCropNames = farmerCrops.map((c) => c.cropName.toLowerCase());

  const cropSummary = farmerCrops
    .map((c) => `- ${c.cropName} (${c.variety}): ${c.areaSize || 0} ဧက`)
    .join("\n");

  // 4️⃣ Filter Market Prices to match User's Crops
  // We filter market analytics to only show prices for what the farmer is currently growing
  const relevantMarket = (allMarketData || []).filter((m: any) =>
    userCropNames.includes(m.cropName.toLowerCase()),
  );

  // Fallback: If no direct matches, show top 5 general market trends
  const marketDisplayList =
    relevantMarket.length > 0
      ? relevantMarket
      : (allMarketData || []).slice(0, 5);

  const marketText = marketDisplayList
    .map(
      (m: any) =>
        `- ${m.cropName}: ${m.currentPrice.toLocaleString()} MMK (${m.priceChangePercent > 0 ? "📈 တက်" : "📉 ကျ"} ${m.priceChangePercent}%)`,
    )
    .join("\n");

  // 5️⃣ Prompts
  const systemPrompt = `
You are an "Advanced Agricultural and Financial Advisor" for Myanmar farmers. 
Analyze farm data and provide actionable advice in Burmese (Unicode). 
Be concise, professional, and encouraging. Use Markdown for structure.
`;

  const userPrompt = `
ရာသီ: ${season}
စိုက်ပျိုးထားသော သီးနှံများ:
${cropSummary}
စုစုပေါင်းဧက: ${totalAcres} ဧက

ဘဏ္ဍာရေးအခြေအနေ:
- စုစုပေါင်းဝင်ငွေ: ${totalIncome.toLocaleString()} MMK
- စုစုပေါင်းအသုံးစရိတ်: ${totalExpense.toLocaleString()} MMK
- တစ်ဧက ပျှမ်းမျှကုန်ကျစရိတ်: ${totalAcres > 0 ? Math.round(totalExpense / totalAcres).toLocaleString() : 0} MMK

သက်ဆိုင်ရာ ဈေးကွက်ပေါက်ဈေးများ:
${marketText}

အောက်ပါခေါင်းစဉ်များဖြင့် Markdown format သုံးပြီး အကြံပြုပေးပါ:

## 1. Financial Health (စီးပွားရေးအခြေအနေ)
- လက်ရှိအသုံးစရိတ်နှင့် ဝင်ငွေအပေါ်မူတည်၍ အမြတ်အစွန်းတွက်ချက်မှု။
- ကုန်ကျစရိတ်လျှော့ချနိုင်မည့် နည်းလမ်းများ။

## 2. Market Strategy (ဈေးကွက်ဗျူဟာ)
- စိုက်ပျိုးထားသော သီးနှံများ၏ လက်ရှိဈေးကွက်လားရာအပေါ် သုံးသပ်ချက်။
- ရောင်းချသင့်သည့် အချိန် သို့မဟုတ် သိုလှောင်သင့်သည့် အကြံပြုချက်။

## 3. Strategic Recommendations (နောင်ရာသီအတွက် ပြင်ဆင်ချက်)
- သီးနှံအလှည့်ကျစိုက်ပျိုးခြင်း သို့မဟုတ် ဧကတိုးချဲ့သင့်သည့် သီးနှံများ။
`;

  // 6️⃣ AI Request
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  res.json({
    advice:
      completion.choices[0]?.message?.content ||
      "AI advice currently unavailable.",
    isTailored: relevantMarket.length > 0,
  });
}),
  /**
   * Seasonal Dashboard Summary
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
            season: { $ifNull: ["$_id", "အမည်မသိရာသီ"] },
            totalIncome: "$income",
            totalExpense: "$expense",
            netProfit: { $subtract: ["$income", "$expense"] },
            _id: 0,
          },
        },
        { $sort: { season: -1 } },
      ]);

      res.json(report);
    }),
  ));

export default router;
