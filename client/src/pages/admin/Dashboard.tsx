import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetAdminDashboardQuery } from "@/store/slices/adminApi";
import {
  AlertTriangle,
  Users,
  Clock,
  Target,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Store,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Link } from "react-router";
import { useGetDisputesQuery } from "@/store/slices/disputeApi";
import {
  formatNumberWithCommas,
  localizeData,
  toMyanmarNumerals,
} from "@/utils/translator";

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

// FIXED: Tooltip now handles localized values and labels
const CustomTooltip = ({ active, payload, label, currentLang }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-lg border-t-4 border-t-[#6EAE19] mm:m-0">
        <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-wider mm:leading-loose">
          {label}
        </p>
        <div className="space-y-2 mm:space-y-0">
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-6"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                />
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mm:leading-loose mm:mb-0">
                  {entry.name}
                </p>
              </div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-100 mm:mb-0">
                {localizeData(entry.value, currentLang)}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language as "en" | "mm") || "en";

  const { data: rawMerchantDisputes, isLoading: disputesLoading } =
    useGetDisputesQuery(undefined);

  const {
    data: rawDashboard,
    isLoading: dashboardLoading,
    refetch,
  } = useGetAdminDashboardQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Localize Dashboard Stats
  const localizedStats = useMemo(() => {
    return localizeData(rawDashboard?.data?.stats, currentLang) || {};
  }, [rawDashboard, currentLang]);

  // Localize merchant_disputes Feed
  const localizedDisputes = useMemo(() => {
    return localizeData(rawMerchantDisputes?.data, currentLang) || [];
  }, [rawMerchantDisputes, currentLang]);

  // FIXED: Explicitly mapping name to localized version for X-Axis Myanmar labels
  const chartData = useMemo(() => {
    const data = rawDashboard?.data?.chartData || [];
    return data.map((item: any) => ({
      // item.name (e.g., "Jan") is passed to localizeData to get "ဇန်နဝါရီ"
      name: currentLang === "mm" ? toMyanmarNumerals(item.name) : item.name,
      farmers: Number(item.farmers) || 0,
      merchants: Number(item.merchants) || 0,
    }));
  }, [rawDashboard, currentLang]);

  useEffect(() => {
    const interval = setInterval(() => refetch(), 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  if (dashboardLoading || disputesLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#6EAE19] border-t-transparent"></div>
        <p className="mt-4 font-bold text-slate-500 animate-pulse uppercase tracking-widest text-xs">
          {t("dashboard.syncing")}
        </p>
      </div>
    );
  }

  const recentDisputes = localizedDisputes.slice(0, 5);

  return (
    <div className="min-h-screen p-4 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight mm:leading-loose">
            {t("dashboard.title")}
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide mm:leading-loose">
            {t("dashboard.subtitle")}
          </p>
        </div>
      </header>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          label={t("dashboard.stats.active_farmers")}
          value={localizeData(localizedStats?.activeFarmers || 0, currentLang)}
          subtext={t("dashboard.stats.farmers_sub")}
          icon={Users}
        />
        <StatCard
          label={t("dashboard.stats.verified_merchants")}
          value={localizeData(localizedStats?.totalMerchants || 0, currentLang)}
          subtext={t("dashboard.stats.merchants_sub")}
          icon={Store}
        />
        <StatCard
          label={t("dashboard.stats.dispute_queue")}
          value={
            currentLang === "mm"
              ? toMyanmarNumerals(rawMerchantDisputes?.data?.length || 0)
              : formatNumberWithCommas(rawMerchantDisputes?.data?.length || 0)
          }
          subtext={t("dashboard.stats.dispute_sub")}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* GROWTH CHART */}
        <Card className="xl:col-span-2 border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-6">
            <div>
              <CardTitle className="text-xl font-black mm:leading-loose">
                {t("dashboard.charts.growth_title")}
              </CardTitle>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1 mm:leading-loose">
                {t("dashboard.charts.growth_sub")}
              </p>
            </div>
            <div className="flex gap-4">
              <LegendItem
                color="#6EAE19"
                label={t("dashboard.charts.farmers")}
              />
              <LegendItem
                color="#3b82f6"
                label={t("dashboard.charts.merchants")}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
                  barGap={8}
                >
                  <defs>
                    <ChartGradient id="farmerGradient" color="#6EAE19" />
                    <ChartGradient id="merchantGradient" color="#3b82f6" />
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 12,
                      fontFamily: "inherit",
                    }}
                    interval={0}
                    className="mm:leading-loose"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 10,
                      fontFamily: "inherit",
                    }}
                    tickFormatter={(value) =>
                      currentLang === "mm"
                        ? toMyanmarNumerals(value)
                        : formatNumberWithCommas(value)
                    }
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc", opacity: 0.1 }}
                    content={<CustomTooltip currentLang={currentLang} />}
                  />
                  <Bar
                    name={t("dashboard.charts.farmers")}
                    dataKey="farmers"
                    fill="url(#farmerGradient)"
                    radius={[6, 6, 0, 0]}
                    barSize={18}
                  />
                  <Bar
                    name={t("dashboard.charts.merchants")}
                    dataKey="merchants"
                    fill="url(#merchantGradient)"
                    radius={[6, 6, 0, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* MERCHANT_DISPUTES FEED */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mm:leading-loose">
                {t("dashboard.disputes_feed.title")}
              </h3>
            </div>
            <Link
              to="/admin/merchant-disputes"
              className="group flex items-center gap-1 text-[11px] font-black text-slate-400 hover:text-[#6EAE19] transition-all mm:leading-loose"
            >
              {t("dashboard.disputes_feed.see_all")}
              <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentDisputes.length > 0 ? (
              recentDisputes.map((dispute: any) => (
                <DisputeItem key={dispute._id} dispute={dispute} t={t} />
              ))
            ) : (
              <EmptyState t={t} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
    <span className="text-[10px] font-bold text-slate-500 uppercase mm:leading-loose">
      {label}
    </span>
  </div>
);

const ChartGradient = ({ id, color }: { id: string; color: string }) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor={color} stopOpacity={1} />
    <stop offset="100%" stopColor={color} stopOpacity={0.6} />
  </linearGradient>
);

const DisputeItem = ({ dispute, t }: any) => (
  <div className="group relative bg-white dark:bg-secondary rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
    <div
      className={cn(
        "absolute left-0 top-0 bottom-0 w-1",
        dispute.status === "pending" ? "bg-amber-400" : "bg-blue-400",
      )}
    />
    <div className="flex justify-between items-start mb-3">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-0.5 mm:leading-loose">
          {t("dashboard.disputes_feed.id_label")}
        </span>
        <Badge
          variant="outline"
          className="font-mono text-[10px] bg-slate-50 dark:bg-slate-800 px-1.5 py-0"
        >
          #{dispute._id.slice(-8).toUpperCase()}
        </Badge>
      </div>
      <Badge
        className={cn(
          "text-[9px] font-black px-2 py-0.5 rounded-full border-none uppercase tracking-widest",
          dispute.status === "pending"
            ? "bg-amber-100 text-amber-700"
            : "bg-blue-100 text-blue-700",
        )}
      >
        {dispute.status}
      </Badge>
    </div>
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-red-50">
        <ShieldAlert className="h-4 w-4 text-slate-400 group-hover:text-red-500" />
      </div>
      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-2 leading-snug mm:leading-loose">
        {dispute.reason}
      </h4>
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
      <div className="flex items-center gap-1.5 text-slate-400">
        <Clock className="h-3 w-3" />
        <span className="text-[10px] font-bold mm:leading-loose">
          {t("dashboard.disputes_feed.activity")}
        </span>
      </div>
      <Link
        to="/admin/merchant-disputes"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-black hover:bg-[#6EAE19] transition-all transform hover:scale-105 shadow-lg mm:leading-loose"
      >
        {t("dashboard.disputes_feed.resolve")}{" "}
        <ExternalLink className="h-2.5 w-2.5" />
      </Link>
    </div>
  </div>
);

const EmptyState = ({ t }: any) => (
  <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
    <Target className="h-10 w-10 text-slate-200 mb-4" />
    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mm:leading-loose">
      {t("dashboard.disputes_feed.empty")}
    </p>
  </div>
);

function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = "default",
}: any) {
  return (
    <Card className="border-none group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-slate-900">
      <CardContent>
        <div className="flex justify-between items-start mb-6 mm:m-0">
          <div>
            <p className="text-3xl font-black tracking-tighter mb-1 mm:mb-0 group-hover:text-[#6EAE19] transition-colors mm:leading-loose">
              {value}
            </p>
            <p className="text-[11px] font-bold text-slate-400 leading-tight w-2/3 mm:leading-loose">
              {subtext}
            </p>
          </div>
          <div
            className={cn(
              "p-2 rounded-xl transition-all duration-300 group-hover:scale-110",
              variant === "danger"
                ? "text-red-500 bg-red-50 dark:bg-red-500/10 group-hover:bg-red-500 group-hover:text-white"
                : "text-[#6EAE19] bg-emerald-50 dark:bg-emerald-500/10 group-hover:bg-[#6EAE19] group-hover:text-white",
            )}
          >
            <Icon size={20} />
          </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-wider dark:text-slate-500 mm:leading-loose">
          {label}
        </p>
      </CardContent>
    </Card>
  );
}

export default Dashboard;
