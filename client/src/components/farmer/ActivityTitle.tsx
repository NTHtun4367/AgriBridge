import { useCurrentUserQuery } from "@/store/slices/userApi";
import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router";

interface ActivityTitleProps {
  id: string | number;
  title: string;
  cat?: string;
  amount: number;
  date: string | Date;
  type: "income" | "expense";
  season?: string;
}

function ActivityTitle({
  id,
  title,
  cat,
  amount,
  date,
  type,
  season,
}: ActivityTitleProps) {
  const { data: user } = useCurrentUserQuery();
  const navigate = useNavigate();

  const isIncome = type === "income";

  return (
    <div
      onClick={() => navigate(`/${user?.role}/records/${id}`)}
      className="group relative flex items-center justify-between p-4 mb-3 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary/50 hover:shadow-md transition-all cursor-pointer overflow-hidden"
    >
      {/* Visual Accent for Record Type */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${isIncome ? "bg-emerald-500" : "bg-red-500"}`}
      />

      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Icon Badge */}
        <div
          className={`shrink-0 p-3 rounded-xl ${
            isIncome
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
          }`}
        >
          {isIncome ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
        </div>

        {/* Content */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate">
              {title}
            </h4>
            {season && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider">
                {season}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            <span>{cat}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <CalendarDays size={12} />
              {format(new Date(date), "MMM dd, yyyy")}
            </div>
          </div>
        </div>
      </div>

      {/* Amount Section */}
      <div className="text-right ml-4">
        <p
          className={`text-lg font-black tracking-tight ${
            isIncome
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {isIncome ? "+" : "-"}
          {amount.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          <span className="ml-1 text-[10px] opacity-70">MMK</span>
        </p>
      </div>
    </div>
  );
}

export default ActivityTitle;
