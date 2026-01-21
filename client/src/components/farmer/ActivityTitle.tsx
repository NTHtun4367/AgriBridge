import { formatDistanceToNow } from "date-fns";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router";

function ActivityTitle({ id, title, cat, amount, date, type, season }: any) {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-between p-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl hover:border-primary dark:hover:border-primary transition-all cursor-pointer group bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
      onClick={() => navigate(`/farmer/records/${id}`)}
    >
      <div className="flex items-center gap-4">
        {/* Status Icon Container */}
        <div
          className={`p-3 rounded-xl transition-colors ${
            type === "income"
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-red-100 text-destructive dark:bg-red-500/10 dark:text-red-400"
          }`}
        >
          {type === "income" ? (
            <ArrowUpRight size={20} />
          ) : (
            <ArrowDownRight size={20} />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm capitalize text-slate-900 dark:text-slate-100">
              {title}
            </p>
            {/* Season Tag */}
            <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase border dark:border-slate-700">
              {season}
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
            {cat} • {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p
          className={`font-black text-sm md:text-base ${
            type === "income"
              ? "text-primary dark:text-primary-light"
              : "text-destructive/80 dark:text-red-400"
          }`}
        >
          {type === "income" ? "+" : "-"}
          {amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}{" "}
          <span className="text-[10px] font-bold">MMK</span>
        </p>
      </div>
    </div>
  );
}

export default ActivityTitle;
