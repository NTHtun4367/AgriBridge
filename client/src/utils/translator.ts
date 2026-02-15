import { GLOSSARY } from "./glossary";

const formatNumberWithCommas = (val: string | number): string => {
  const stringVal = val.toString().replace(/,/g, "");
  const num = Number(stringVal);
  if (isNaN(num) || stringVal === "") return stringVal;
  // Preserve years like 2026 without commas
  if (num >= 1000 && num <= 2100 && stringVal.length === 4) return stringVal;
  return num.toLocaleString("en-US");
};

/**
 * Escapes special characters so they can be used safely in a RegExp
 */
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const toMyanmarNumerals = (val: string | number | any): string => {
  if (val === null || val === undefined) return "";

  let stringVal =
    typeof val === "number" ? formatNumberWithCommas(val) : val.toString();

  // Sort by length descending so that "Yangon (Bayintnaung)" is replaced
  // before "Yangon" is caught individually.
  const sortedKeys = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);

  sortedKeys.forEach((key) => {
    const regex = new RegExp(escapeRegExp(key), "gi");
    stringVal = stringVal.replace(regex, GLOSSARY[key]);
  });

  const digits: Record<string, string> = {
    "0": "၀",
    "1": "၁",
    "2": "၂",
    "3": "၃",
    "4": "၄",
    "5": "၅",
    "6": "၆",
    "7": "၇",
    "8": "၈",
    "9": "၉",
  };

  return stringVal.replace(/\d/g, (d: string) => digits[d] || d);
};

export const localizeData = (data: any, lang: "en" | "mm" = "en"): any => {
  if (!data) return data;
  if (Array.isArray(data)) return data.map((item) => localizeData(item, lang));

  if (typeof data === "object") {
    if (data instanceof Date || data.$oid) return data;
    const output = { ...data };

    for (const key in output) {
      const val = output[key];
      const lowerKey = key.toLowerCase();

      // Skip actual IDs and Technical fields
      const isActualIdValue =
        typeof val !== "object" &&
        (lowerKey.endsWith("id") || /^(id|_id|__v)$/i.test(key));

      // Skip Date and Time fields
      const isDateKey =
        lowerKey.includes("date") ||
        lowerKey.includes("time") ||
        (lowerKey.endsWith("at") && lowerKey !== "unit");

      // NEW: Skip Email fields to prevent numerals from being converted
      const isEmailKey = lowerKey.includes("email");

      if (isActualIdValue || isDateKey || isEmailKey) continue;

      if (typeof val === "string") {
        let text = val.trim();
        if (lang === "mm") {
          output[key] = toMyanmarNumerals(text);
        } else {
          // English formatting: Add commas to numbers found in strings
          if (!isNaN(Number(text.replace(/,/g, ""))) && text !== "") {
            output[key] = formatNumberWithCommas(text);
          }
        }
      } else if (typeof val === "number") {
        output[key] =
          lang === "mm" ? toMyanmarNumerals(val) : formatNumberWithCommas(val);
      } else if (typeof val === "object" && val !== null) {
        output[key] = localizeData(val, lang);
      }
    }
    return output;
  }
  return data;
};
