import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", label: "EN" },
    { code: "mm", label: "MM" }, // Changed to MM for symmetry in small size
  ];

  return (
    <div className="flex items-center p-0.5 bg-secondary/40 rounded-full border border-primary/10 w-fit backdrop-blur-sm">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={cn(
            "px-2.5 py-1 text-[10px] font-bold tracking-wider transition-all rounded-full uppercase",
            i18n.language === lang.code
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary",
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
