import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Filter,
  AlertCircle,
  TrendingUp as MarketIcon,
} from "lucide-react";

import StatusCard from "@/common/StatusCard";
import ActivityTitle from "@/components/farmer/ActivityTitle";
import AddEntryDialog from "@/components/farmer/AddEntryDialog";
import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetFinanceStatsQuery } from "@/store/slices/farmerApi";
import { useGetAllEntriesQuery } from "@/store/slices/entryApi";

const generateFilterSeasons = () => {
  const currentYear = new Date().getFullYear();
  const names = ["Summer", "Rainy", "Winter"];
  const years = [currentYear - 1, currentYear, currentYear + 1];
  const options: string[] = [];
  years.forEach((y) => names.forEach((n) => options.push(`${n} ${y}`)));
  return options;
};

function FarmerDashboard() {
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState<string>("all");

  const { data: finance } = useGetFinanceStatsQuery(selectedSeason);
  const { data: entries, isLoading: entriesLoading } = useGetAllEntriesQuery();

  const seasonOptions = useMemo(() => generateFilterSeasons(), []);

  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    const baseList =
      selectedSeason === "all"
        ? entries
        : entries.filter((en: any) => en.season === selectedSeason);
    return baseList.slice(0, 6);
  }, [entries, selectedSeason]);

  return (
    <div className="w-full min-h-screen p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
            Overview
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Tracking your farm's performance
          </p>
        </div>

        {/* SEASON SELECTOR */}
        <div className="group relative flex items-center gap-2 bg-white/80 dark:bg-slate-950/50 backdrop-blur-md p-1.5 pl-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 w-full md:w-auto">
          <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 p-2 rounded-xl">
            <Filter className="w-4 h-4" />
          </div>
          <div className="flex flex-col flex-1 md:pr-2">
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 dark:text-slate-500 ml-3 -mb-1">
              Season
            </span>
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="w-full md:w-40 border-none shadow-none focus:ring-0 font-bold text-slate-700 dark:text-slate-200 h-8 bg-transparent">
                <SelectValue placeholder="Select Season" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 dark:border-slate-800 backdrop-blur-xl">
                <SelectItem value="all" className="rounded-xl font-semibold">
                  All Time
                </SelectItem>
                {seasonOptions.map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    className="rounded-xl font-semibold"
                  >
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* --- FINANCE SECTION --- */}

      {/* MOBILE ONLY: Consolidated Premium Card */}
      <div className="block md:hidden">
        <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-950 rounded-2xl p-8 shadow-2xl shadow-primary/20">
          {/* Abstract background glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="text-primary text-base font-black uppercase tracking-[0.2em] mb-2">
              Net Profit
            </span>
            <h3 className="text-4xl font-black text-white tracking-tight">
              {(finance?.profit || 0).toLocaleString()}
              <span className="text-sm font-bold text-slate-500 ml-2">MMK</span>
            </h3>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
            <div className="flex flex-col items-center border-r border-white/5">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Revenue
                </span>
              </div>
              <p className="text-white font-black">
                {(finance?.totalIncome || 0).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Total Cost
                </span>
              </div>
              <p className="text-white font-black">
                {(finance?.totalExpense || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LAPTOP ONLY: Original 3-Card Design */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        <StatusCard
          title="Total Revenue"
          bgColor="bg-blue-500/10"
          value={finance?.totalIncome || 0}
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
        />
        <StatusCard
          title="Total Cost"
          bgColor="bg-red-500/10"
          value={finance?.totalExpense || 0}
          icon={<TrendingDown className="w-6 h-6 text-red-600" />}
        />
        <StatusCard
          title="Net Profit"
          bgColor="bg-primary/10"
          value={finance?.profit || 0}
          icon={<DollarSign className="w-6 h-6 text-primary" />}
        />
      </div>

      {/* RECENT ACTIVITY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Recent Activity
          </h2>
          <AddEntryDialog />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          {entriesLoading ? (
            <div className="col-span-full py-12 text-center text-slate-400 font-medium animate-pulse">
              Loading transactions...
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-4xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-slate-400 font-bold">
                No records found for this season.
              </p>
            </div>
          ) : (
            filteredEntries.map((en: any) => (
              <ActivityTitle
                key={en._id}
                id={en._id}
                title={en.category}
                amount={en.value}
                type={en.type}
                date={en.date}
                season={en.season}
              />
            ))
          )}
        </div>

        <Button
          variant="ghost"
          className="w-full text-primary font-black hover:bg-primary/5 rounded-2xl h-14 border-2 border-primary/5 md:border-none md:h-auto"
          onClick={() => navigate("/farmer/records")}
        >
          View All Transactions
        </Button>
      </div>

      {/* MARKET ALERT SECTION */}
      <div className="relative overflow-hidden rounded-4xl p-6 border-2 border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3.5 bg-amber-100 dark:bg-amber-900/40 text-amber-600 rounded-2xl shadow-inner">
            <MarketIcon size={24} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 dark:text-slate-100">
              Market Alert
            </h4>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">
              Live price updates available
            </p>
          </div>
        </div>
        <Button
          className="w-full font-black h-12 rounded-xl shadow-lg shadow-primary/10"
          onClick={() => navigate("/farmer/markets")}
        >
          Check Live Prices
        </Button>
      </div>
    </div>
  );
}

export default FarmerDashboard;
