import type React from "react";
import { useTranslation } from "react-i18next";

interface StatusCardProps {
  title: string;
  bgColor: string;
  value: number;
  icon: React.ReactNode;
}

function StatusCard({ title, bgColor, value, icon }: StatusCardProps) {
  const { t, i18n } = useTranslation();
  const isMyanmar = i18n.language === "my";

  // Ensuring Burmese descenders aren't cut off and titles are legible
  const mmLeading = isMyanmar ? "leading-[1.8] mb-4" : "leading-normal mb-6";

  return (
    <div
      className={`p-6 rounded-2xl shadow-sm ${bgColor} transition-transform hover:scale-105 duration-300 border border-white/20`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className={`text-sm font-semibold opacity-80 ${mmLeading}`}>
            {title}
          </p>
          <h3
            className={`text-2xl font-bold tabular-nums tracking-tight ${
              value < 0 ? "text-destructive" : ""
            }`}
          >
            {value?.toLocaleString(i18n.language, {
              minimumFractionDigits: value % 1 !== 0 ? 2 : 0, // Show decimals only if they exist
            })}
            <span
              className={`ml-1.5 text-sm font-bold ${isMyanmar ? "text-base" : "text-xs"}`}
            >
              {t("statusCards.currency")}
            </span>
          </h3>
        </div>
        <div className="p-3 bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-xl shadow-inner">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatusCard;
