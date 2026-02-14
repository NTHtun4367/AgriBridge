import Groq from "groq-sdk";
import crypto from "crypto";
import dotenv from "dotenv";
import { Translation } from "../../modules/cache/models/translation";

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

const DIRECT_MAP: Record<string, string> = {
  MMK: "ကျပ်",
  Bag: "အိတ်",
  Bags: "အိတ်",
  Rainy: "မိုးရာသီ",
  Summer: "နွေရာသီ",
  Winter: "ဆောင်ရာသီ",
  "Rainy Season": "မိုးရာသီ",
  "Summer Season": "နွေရာသီ",
  "Winter Season": "ဆောင်ရာသီ",
  Matpe: "မတ်ပဲ",
  Seeds: "မျိုးစေ့များ",
  Fertilizer: "ဓာတ်မြေဩဇာ",
  Crops: "သီးနှံများ",
  merchant_preorders: "ကြိုတင်မှာယူမှုများ",
  merchant_disputes: "အငြင်းပွားမှုများ",
};

const toMyanmarNumerals = (text: string | number): string => {
  const myanmarDigits = ["၀", "၁", "၂", "၃", "၄", "၅", "၆", "၇", "၈", "၉"];
  return text.toString().replace(/\d/g, (d) => myanmarDigits[parseInt(d)]);
};

const SYSTEM_PROMPT = `You are a Senior Burmese Agricultural Localization Expert. Translate to Myanmar Unicode. Convert all numbers to Myanmar numerals. Output ONLY the translated text.
Glossary: merchant_preorders=ကြိုတင်မှာယူမှုများ, merchant_disputes=အငြင်းပွားမှုများ, MMK=ကျပ်, Bag=အိတ်.`;

async function callAI(text: string): Promise<string> {
  if (!text || text.length < 2) return text;
  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
    });
    return response.choices[0]?.message?.content?.trim() || text;
  } catch {
    return text;
  }
}

/**
 * Recursive function to translate everything including nested objects and arrays
 */
export const autoTranslate = async (
  data: any,
  isAiEnabled: boolean = true,
  contentIdOverride?: string,
): Promise<any> => {
  if (!isAiEnabled || !data) return data;

  // 1. Handle Arrays
  if (Array.isArray(data)) {
    return await Promise.all(
      data.map((item) => autoTranslate(item, isAiEnabled, contentIdOverride)),
    );
  }

  // 2. Handle Objects
  if (typeof data === "object" && data !== null) {
    // MongoDB Date object သို့မဟုတ် ID ဖြစ်နေလျှင် မထိပါ
    if (data instanceof Date || data._bsontype === "ObjectID") return data;

    const result = { ...data };
    const contentId =
      contentIdOverride || (data._id ? data._id.toString() : "static_content");

    for (const key in result) {
      const value = result[key];

      // Skip internal MongoDB fields
      if (key === "_id" || key === "__v" || key === "id") continue;

      if (typeof value === "object") {
        // Nested Object သို့မဟုတ် Array ဖြစ်နေလျှင် Recursive ပြန်ခေါ်မည်
        result[key] = await autoTranslate(value, isAiEnabled, contentId);
      } else if (typeof value === "number") {
        // Numbers
        result[key] = toMyanmarNumerals(value.toLocaleString());
      } else if (typeof value === "string") {
        // Strings
        const trimmed = value.trim();
        if (!trimmed || /^[0-9a-fA-F]{24}$/.test(trimmed)) continue; // Skip empty and IDs

        if (DIRECT_MAP[trimmed]) {
          result[key] = DIRECT_MAP[trimmed];
        } else {
          const hash = crypto.createHash("md5").update(trimmed).digest("hex");
          try {
            const cached = await Translation.findOne({
              contentId,
              field: key,
              hash,
            });
            if (cached) {
              result[key] = cached.myanmarText;
            } else {
              const translated = await callAI(trimmed);
              const final = toMyanmarNumerals(translated);

              await Translation.findOneAndUpdate(
                { contentId, field: key, hash },
                {
                  contentId,
                  field: key,
                  sourceText: trimmed,
                  myanmarText: final,
                  hash,
                },
                { upsert: true, new: true },
              );
              result[key] = final;
            }
          } catch (e) {
            console.error("Cache Error:", e);
          }
        }
      }
    }
    return result;
  }

  return data;
};
