import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { setLanguage } from "@/store/slices/settings";
import { type RootState } from "@/store";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  // Redux မှ lang ကို ယူသည်
  const currentLang = useSelector((state: RootState) => state.settings.lang);

  // Sync Logic: Redux State နှင့် i18n ကို အမြဲတမ်း ကိုက်ညီနေအောင် လုပ်ပေးသည်
  useEffect(() => {
    const syncLanguage = async () => {
      // i18n initialized ဖြစ်ပြီးမှ changeLanguage ကို ခေါ်မည်
      if (i18n.isInitialized && i18n.language !== currentLang) {
        await i18n.changeLanguage(currentLang);
      }
    };
    syncLanguage();
  }, [currentLang, i18n]);

  const languages = [
    { code: "en", label: "EN" },
    { code: "mm", label: "MM" },
  ] as const;

  return (
    <div className="flex items-center p-0.5 bg-secondary/40 rounded-full border border-primary/10 w-fit backdrop-blur-sm shadow-inner">
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => dispatch(setLanguage(lang.code))}
          className={cn(
            "px-2.5 py-1 text-[10px] font-bold tracking-wider transition-all duration-300 rounded-full uppercase cursor-pointer",
            currentLang === lang.code
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
