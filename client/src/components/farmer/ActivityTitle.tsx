import { formatDistanceToNow } from "date-fns";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router";

function ActivityTitle({ id, title, cat, amount, date, type }: any) {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-between p-4 border-2 border-slate-100 rounded-2xl hover:border-primary transition-colors cursor-pointer group"
      onClick={() => navigate(`/farmer/records/${id}`)}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-xl ${
            type === "income"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-100 text-destructive"
          }`}
        >
          {type === "income" ? (
            <ArrowUpRight size={20} />
          ) : (
            <ArrowDownRight size={20} />
          )}
        </div>
        <div>
          <p className="font-bold text-sm capitalize">{title}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            {cat} • {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-black ${
            type === "income" ? "text-primary" : "text-destructive/70"
          }`}
        >
          {type === "income" ? "+" : "-"}
          {amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}{" "}
          MMK
        </p>
      </div>
    </div>
  );
}

export default ActivityTitle;
