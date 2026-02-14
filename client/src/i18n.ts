import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  .use(Backend) // JSON ဖိုင်တွေကို လှမ်းဆွဲမည့် backend
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    ns: ["common"],
    defaultNS: "common",
    backend: {
      // public/locales/en/common.json လမ်းကြောင်းသို့ ညွှန်ပြခြင်း
      // Vite မှာ public သည် root ဖြစ်သောကြောင့် /locales ဟု ရေးရုံဖြင့် ရပါသည်
      loadPath: "/locales/{{lng}}/common.json",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
