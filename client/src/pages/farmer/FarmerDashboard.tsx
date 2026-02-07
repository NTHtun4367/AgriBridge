import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Filter,
  AlertCircle,
  TrendingUp as MarketIcon,
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Sprout,
} from "lucide-react";
import { format } from "date-fns";

import StatusCard from "@/common/StatusCard";
import AddEntryDialog from "@/components/farmer/AddEntryDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAllEntriesQuery,
  useGetFinancialOverviewQuery,
} from "@/store/slices/entryApi";
import { useCurrentUserQuery } from "@/store/slices/userApi";

// Consistent with AgricultureManager
const SEASONS = [
  "Summer 2026",
  "Rainy 2026",
  "Winter 2026",
  "Summer 2027",
  "Rainy 2027",
  "Winter 2027",
];

function FarmerDashboard() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUserQuery();
  const [selectedSeason, setSelectedSeason] = useState<string>("all");

  const { data: response } = useGetFinancialOverviewQuery({
    season: selectedSeason === "all" ? undefined : selectedSeason,
  });

  const finance = response?.overall;
  const { data: entries, isLoading: entriesLoading } = useGetAllEntriesQuery();

  const recentEntries = useMemo(() => {
    if (!entries) return [];
    const baseList =
      selectedSeason === "all"
        ? entries
        : entries.filter((en: any) => en.season === selectedSeason);
    return baseList.slice(0, 8); // Showing top 8 for dashboard view
  }, [entries, selectedSeason]);

  return (
    <div className="w-full min-h-screen p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
            Farm Dashboard
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Real-time monitoring of your agricultural enterprise
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* AGRIMANAGER BUTTON */}
          <Button
            onClick={() => navigate("/farmer/agri-manager")}
            variant="outline"
            className="border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-bold"
          >
            <Sprout className="w-4 h-4" />
            AgriManager
          </Button>

          <AddEntryDialog />

          {/* SEASON SELECTOR - Updated to match AgriManager Style */}
          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger className="w-48 h-14 border-slate-200 bg-white dark:bg-slate-950 font-bold">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <SelectValue placeholder="Select Cycle" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all" value="all">
                All Seasons
              </SelectItem>
              {SEASONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* FINANCE OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          title="Total Revenue"
          bgColor="bg-emerald-500/10"
          value={finance?.income || 0}
          icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
        />
        <StatusCard
          title="Total Cost"
          bgColor="bg-red-500/10"
          value={finance?.expense || 0}
          icon={<TrendingDown className="w-6 h-6 text-red-600" />}
        />
        <StatusCard
          title="Net Profit"
          bgColor="bg-primary/10"
          value={finance?.profit || 0}
          icon={<DollarSign className="w-6 h-6 text-primary" />}
        />
      </div>

      {/* RECENT RECORDS TABLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="text-primary w-5 h-5" />
            Recent Ledger Entries
          </h3>
          <Button
            variant="link"
            className="text-primary font-bold"
            onClick={() => navigate("/farmer/records")}
          >
            See Full Ledger
          </Button>
        </div>

        <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900/50 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                <TableRow className="border-slate-100 dark:border-slate-800">
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="hidden md:table-cell font-bold">
                    Season
                  </TableHead>
                  <TableHead className="font-bold">Type</TableHead>
                  <TableHead className="text-right font-bold">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entriesLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-40 text-center animate-pulse"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : recentEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center">
                      <div className="flex flex-col items-center text-slate-400">
                        <AlertCircle className="mb-2 opacity-20" />
                        <p className="font-medium">
                          No records for this selection
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentEntries.map((en: any) => {
                    const isIncome = en.type === "income";
                    return (
                      <TableRow
                        key={en._id}
                        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border-slate-50 dark:border-slate-800"
                        onClick={() =>
                          navigate(`/${user?.role}/records/${en._id}`)
                        }
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 dark:text-slate-200">
                              {format(new Date(en.date), "dd MMM")}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {format(new Date(en.date), "yyyy")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold capitalize">
                              {en.category}
                            </span>
                            <span className="text-xs text-slate-400 line-clamp-1">
                              {en.notes || "No notes"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                            {en.season}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div
                            className={`flex items-center gap-1 text-[10px] font-black uppercase ${isIncome ? "text-emerald-600" : "text-red-500"}`}
                          >
                            {isIncome ? (
                              <ArrowUpRight size={14} />
                            ) : (
                              <ArrowDownLeft size={14} />
                            )}
                            {en.type}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`font-black ${isIncome ? "text-emerald-600" : "text-destructive"}`}
                          >
                            {isIncome ? "+" : "-"} {en.value.toLocaleString()}
                          </span>
                          <span className="block text-[8px] text-slate-400 font-bold">
                            MMK
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* BOTTOM ACTION SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 rounded-xl">
              <MarketIcon size={20} />
            </div>
            <h4 className="font-black text-slate-900 dark:text-slate-100">
              Market Trends
            </h4>
          </div>
          <Button
            className="w-full bg-white hover:bg-slate-50 text-slate-900 border-none shadow-sm font-bold h-11 rounded-xl"
            onClick={() => navigate("/farmer/markets")}
          >
            Check Live Prices
          </Button>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <Calendar size={14} />
            Cloud Sync Active
          </div>
          <p className="mt-4 text-sm font-medium text-slate-300">
            All your farm records are securely backed up to your agricultural
            cloud storage.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FarmerDashboard;
