import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Filter,
  AlertCircle,
} from "lucide-react";

import StatusCard from "@/common/StatusCard";
import ActivityTitle from "@/components/farmer/ActivityTitle";
import AddEntryDialog from "@/components/farmer/AddEntryDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllEntriesQuery,
  useGetFinanceStatsQuery,
} from "@/store/slices/farmerApi";

// Logic to generate matching seasons
const generateFilterSeasons = () => {
  const currentYear = new Date().getFullYear();
  const names = ["Summer", "Monsoon", "Winter"];
  const years = [currentYear - 1, currentYear, currentYear + 1];
  const options: string[] = [];
  years.forEach((y) => names.forEach((n) => options.push(`${n} ${y}`)));
  return options;
};

function FarmerDashboard() {
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState<string>("all");

  // RTK Query: Passing the season automatically triggers a re-fetch when it changes
  const { data: finance } = useGetFinanceStatsQuery(selectedSeason);
  const { data: entries, isLoading: entriesLoading } = useGetAllEntriesQuery();

  const seasonOptions = useMemo(() => generateFilterSeasons(), []);

  // Filter the activity list based on selected season
  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    if (selectedSeason === "all") return entries.slice(0, 6);
    return entries
      .filter((en: any) => en.season === selectedSeason)
      .slice(0, 6);
  }, [entries, selectedSeason]);

  return (
    <div className="w-full min-h-screen p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Overview</h2>
          <p className="text-slate-500 text-sm font-medium">
            Tracking your farm's performance
          </p>
        </div>
        {/* SEASON SELECTOR */}
        <div className="group relative flex items-center gap-2 bg-white/80 dark:bg-slate-950/50 backdrop-blur-md p-1.5 pl-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300">
          {/* Icon with subtle background wrapper */}
          <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 p-2 rounded-xl group-hover:text-primary transition-colors">
            <Filter className="w-4 h-4" />
          </div>

          <div className="flex flex-col pr-2">
            {/* Subtle Label */}
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 dark:text-slate-500 ml-3 -mb-1">
              Season
            </span>

            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="w-40 border-none shadow-none focus:ring-0 font-bold text-slate-700 dark:text-slate-200 h-8 bg-transparent">
                <SelectValue placeholder="Select Season" />
              </SelectTrigger>

              <SelectContent className="rounded-2xl border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <SelectItem
                  value="all"
                  className="rounded-xl focus:bg-primary/10 focus:text-primary dark:focus:bg-primary/20 font-semibold cursor-pointer"
                >
                  All Time
                </SelectItem>

                {seasonOptions.map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    className="rounded-xl focus:bg-primary/10 focus:text-primary dark:focus:bg-primary/20 font-semibold cursor-pointer"
                  >
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subtle indicator ring on hover */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-primary/10 transition-all pointer-events-none" />
        </div>{" "}
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

      {/* RECENT ACTIVITY TABLE */}
      <Card>
        <CardTitle className="p-6 border-b border-slate-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">
              Recent Activity
            </h2>
            <AddEntryDialog />
          </div>
        </CardTitle>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {entriesLoading ? (
              <div className="col-span-full py-10 text-center text-slate-400">
                Loading entries...
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center bg-secondary rounded-2xl border-2 border-dashed border-slate-200">
                <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-slate-400 font-medium">
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

          <div className="flex items-center justify-center mt-6">
            <Button
              variant="ghost"
              className="text-primary font-bold hover:bg-primary/5 rounded-xl px-10 h-11"
              onClick={() => navigate("/farmer/records")}
            >
              See All Records
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* MARKET ALERT SECTION */}
      <Card className="rounded-xl my-3 p-6 shadow-none">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl"></div>
          <div>
            <h4 className="font-bold">Market Alert</h4>
            <p className="text-xs text-slate-500 font-medium">
              Paddy prices are up 5% today in your region.
            </p>
          </div>
        </div>
        <Button
          className="w-full font-bold"
          onClick={() => navigate("/farmer/markets")}
        >
          Check Live Prices
        </Button>
      </Card>
    </div>
  );
}

export default FarmerDashboard;
