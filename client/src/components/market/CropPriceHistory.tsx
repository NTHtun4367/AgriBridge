import { useNavigate, useSearchParams } from "react-router";
import { useGetCropPriceHistoryQuery } from "@/store/slices/marketApi";
import CropPriceHistoryChart from "@/components/market/CropPriceHistoryChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Wallet,
} from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

function CropPriceHistory() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cropId = searchParams.get("cropId");
  const marketId = searchParams.get("marketId");

  const { data, isLoading } = useGetCropPriceHistoryQuery(
    { cropId: cropId || "", marketId: marketId || "" },
    { skip: !cropId || !marketId }
  );

  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;
    const prices = data.map((d: any) => d.price);
    return {
      latest: prices[prices.length - 1],
      high: Math.max(...prices),
      low: Math.min(...prices),
      unit: data[0]?.unit || "",
    };
  }, [data]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
      {/* Header Section: Responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-slate-900 whitespace-nowrap">
            Price Analytics
          </h1>
          <span className="text-slate-300">/</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse shrink-0" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Real-Time
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="w-fit shadow-sm h-9"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Market Prices
        </Button>
      </div>

      {/* Main Content Area - Reduced width from max-6xl to max-4xl */}
      <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
        <Card className="shadow-xl shadow-slate-200/50 border-none rounded-2xl overflow-hidden">
          <CardHeader className="border-b bg-white py-4 px-6">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-700">
              Price Trend
              <span className="text-xs font-normal text-slate-400">
                (30 Days)
              </span>
            </CardTitle>
          </CardHeader>

          {/* Reduced padding from p-8 to p-4 or p-6 */}
          <CardContent className="p-4 bg-white">
            {isLoading ? (
              <div className="h-[300px] w-full flex flex-col items-center justify-center">
                <div className="h-8 w-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
                <p className="text-slate-400 text-xs">Loading data...</p>
              </div>
            ) : data && data.length > 0 ? (
              /* Reduced height from h-[450px] to h-[300px] */
              <div className="h-[300px] w-full">
                <CropPriceHistoryChart data={data} />
              </div>
            ) : (
              /* Reduced height for empty state as well */
              <div className="h-[300px] w-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl bg-slate-50/50">
                <Activity className="h-8 w-8 text-slate-200 mb-2" />
                <p className="text-slate-400 text-xs font-medium">
                  No records found.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <p className="mt-4 text-center text-[11px] text-slate-400 leading-relaxed">
          Updated daily based on market closing prices.
        </p>
      </div>

      {/* Stats Grid: Scales from 1 to 3 columns within the 4xl width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <StatCard
          title="Current Price"
          value={stats?.latest}
          unit={stats?.unit}
          type="current"
          icon={<Wallet className="text-white h-5 w-5" />}
          description="Latest market record"
        />
        <StatCard
          title="Highest"
          value={stats?.high}
          unit={stats?.unit}
          type="high"
          icon={<ArrowUpRight className="text-emerald-600 h-5 w-5" />}
          description="30-day peak"
        />
        <StatCard
          title="Lowest"
          value={stats?.low}
          unit={stats?.unit}
          type="low"
          icon={<ArrowDownRight className="text-rose-600 h-5 w-5" />}
          description="30-day floor"
        />
      </div>
    </div>
  );
}

// Updated StatCard with compact responsive design
interface StatCardProps {
  title: string;
  value: number | undefined;
  unit?: string;
  icon: React.ReactNode;
  description: string;
  type: "current" | "high" | "low";
}

function StatCard({
  title,
  value,
  unit,
  icon,
  description,
  type,
}: StatCardProps) {
  const isCurrent = type === "current";
  const styles = {
    current:
      "bg-primary text-white shadow-lg shadow-primary/20 border-transparent",
    high: "bg-white border-slate-100 shadow-sm text-slate-900",
    low: "bg-white border-slate-100 shadow-sm text-slate-900",
  };

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-md ${styles[type]}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-2 rounded-xl ${
            isCurrent ? "bg-white/20" : "bg-slate-50"
          }`}
        >
          {icon}
        </div>
        <span
          className={`text-[9px] font-bold uppercase tracking-widest ${
            isCurrent ? "text-white/40" : "text-slate-300"
          }`}
        >
          {isCurrent ? "Active" : "Static"}
        </span>
      </div>

      <div className="space-y-1">
        <p
          className={`text-xs font-semibold ${
            isCurrent ? "text-white/80" : "text-slate-500"
          }`}
        >
          {title}
        </p>
        <div className="flex items-baseline gap-1 flex-wrap">
          <h4 className="text-2xl font-black tabular-nums tracking-tight">
            {value ? value.toLocaleString() : "---"}
          </h4>
          <span
            className={`text-[10px] font-bold ${
              isCurrent ? "text-white/60" : "text-slate-400"
            }`}
          >
            MMK / {unit || "unit"}
          </span>
        </div>
        <p className={`text-[10px] mt-2 opacity-70`}>{description}</p>
      </div>
    </div>
  );
}

export default CropPriceHistory;
