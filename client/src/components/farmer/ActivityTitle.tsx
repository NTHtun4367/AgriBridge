import { useCurrentUserQuery } from "@/store/slices/userApi";
import { formatDistanceToNow } from "date-fns";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
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

  return (
    <div
      className="flex items-center justify-between p-3 md:p-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl hover:border-primary dark:hover:border-primary transition-all cursor-pointer group bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 w-full"
      onClick={() => navigate(`/${user?.role}/records/${id}`)}
    >
      {/* Left Section: Icon and Labels */}
      <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
        {/* Status Icon Container - Fixed size to prevent shrinking */}
        <div
          className={`p-2.5 md:p-3 rounded-xl transition-colors shrink-0 ${
            type === "income"
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-red-100 text-destructive dark:bg-red-500/10 dark:text-red-400"
          }`}
        >
          {type === "income" ? (
            <ArrowUpRight size={18} className="md:w-5 md:h-5" />
          ) : (
            <ArrowDownRight size={18} className="md:w-5 md:h-5" />
          )}
        </div>

        {/* Text Information - min-w-0 allows truncation to work */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-bold text-xs md:text-sm capitalize text-slate-900 dark:text-slate-100 truncate">
              {title}
            </p>
            {/* Season Tag - shrink-0 ensures tag stays visible */}
            <span className="shrink-0 text-[8px] md:text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-bold uppercase border dark:border-slate-700">
              {season}
            </span>
          </div>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight truncate">
            {cat} • {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Right Section: Amount */}
      <div className="text-right shrink-0 ml-3">
        <p
          className={`font-black text-sm md:text-base whitespace-nowrap ${
            type === "income"
              ? "text-primary dark:text-primary-light"
              : "text-destructive/80 dark:text-red-400"
          }`}
        >
          {type === "income" ? "+" : "-"}
          {amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}{" "}
          <span className="text-[9px] md:text-[10px] font-bold">MMK</span>
        </p>
      </div>
    </div>
  );
}

export default ActivityTitle;
