import { useEffect, useMemo } from "react";
import { useGetAdminDashboardQuery } from "@/store/slices/adminApi";
import { useGetDisputesQuery } from "@/store/slices/disputeApi";
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
  Legend,
} from "recharts";
import { Link } from "react-router";

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

// --- BEAUTIFUL CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-lg border-t-4 border-t-[#6EAE19]">
        <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-wider">
          {label}
        </p>
        <div className="space-y-2">
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
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {entry.name}
                </p>
              </div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                {entry.value}
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
  const { data: disputeResponse, isLoading: disputesLoading } =
    useGetDisputesQuery(undefined);

  const {
    data: response,
    isLoading: dashboardLoading,
    refetch,
  } = useGetAdminDashboardQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const interval = setInterval(() => refetch(), 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  const chartData = useMemo(() => {
    return (response?.data?.chartData || []).filter((item: any) => item.name);
  }, [response]);

  if (dashboardLoading || disputesLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#6EAE19] border-t-transparent"></div>
        <p className="mt-4 font-bold text-slate-500 animate-pulse uppercase tracking-widest text-xs">
          Syncing Ecosystem Data...
        </p>
      </div>
    );
  }

  const { stats } = response?.data || {};
  const recentDisputes = disputeResponse?.data?.slice(0, 5) || [];

  return (
    <div className="min-h-screen p-4 lg:p-8 space-y-8 animate-in fade-in duration-500">
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            Global ecosystem metrics and user acquisition.
          </p>
        </div>
      </header>

      {/* --- STATS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          label="Active Farmers"
          value={stats?.activeFarmers || 0}
          subtext="Verified agricultural farmers"
          icon={Users}
        />
        <StatCard
          label="Verified Merchants"
          value={stats?.totalMerchants || 0}
          subtext="Authorized buying entities"
          icon={Store}
        />
        <StatCard
          label="Dispute Queue"
          value={recentDisputes.length}
          subtext="Critical resolution required"
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* --- BEAUTIFIED ANALYTICS SECTION --- */}
        <Card className="xl:col-span-2 border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-6">
            <div>
              <CardTitle className="text-xl font-black">
                Network Growth
              </CardTitle>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                Real-time Acquisition
              </p>
            </div>
            <div className="flex gap-4">
              {/* Custom Legend for Chart */}
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-[#6EAE19]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Farmers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-[#3b82f6]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Merchants
                </span>
              </div>
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
                    <linearGradient
                      id="farmerGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#6EAE19" stopOpacity={1} />
                      <stop
                        offset="100%"
                        stopColor="#6EAE19"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                    <linearGradient
                      id="merchantGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                      <stop
                        offset="100%"
                        stopColor="#3b82f6"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
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
                    tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    content={<CustomTooltip />}
                  />

                  {/* Farmer Bar */}
                  <Bar
                    name="Farmers"
                    dataKey="farmers"
                    fill="url(#farmerGradient)"
                    radius={[6, 6, 0, 0]}
                    barSize={18}
                  />

                  {/* Merchant Bar */}
                  <Bar
                    name="Merchants"
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

        {/* --- DISPUTES FEED (Kept original logic) --- */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100">
                Recent Disputes
              </h3>
            </div>
            <Link
              to="/admin/disputes"
              className="group flex items-center gap-1 text-[11px] font-black text-slate-400 hover:text-[#6EAE19] transition-all"
            >
              See All
              <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentDisputes.length > 0 ? (
              recentDisputes.map((dispute: any) => (
                <div
                  key={dispute._id}
                  className="group relative bg-white dark:bg-secondary rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 overflow-hidden"
                >
                  <div
                    className={cn(
                      "absolute left-0 top-0 bottom-0 w-1",
                      dispute.status === "pending"
                        ? "bg-amber-400"
                        : "bg-blue-400",
                    )}
                  />

                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter mb-0.5">
                        Dispute ID
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="font-mono text-[10px] bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 px-1.5 py-0"
                        >
                          #{dispute._id.slice(-8).toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded-full border-none uppercase tracking-widest",
                        dispute.status === "pending"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500",
                      )}
                    >
                      {dispute.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="mt-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-red-50 dark:group-hover:bg-red-500/10 transition-colors">
                      <ShieldAlert className="h-4 w-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-2 leading-snug">
                      {dispute.reason}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span className="text-[10px] font-bold">
                        New Activity
                      </span>
                    </div>

                    <Link
                      to="/admin/disputes"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 text-[10px] font-black hover:bg-[#6EAE19] dark:hover:bg-[#6EAE19] transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none"
                    >
                      RESOLVE CASE <ExternalLink className="h-2.5 w-2.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-4xl p-12 flex flex-col items-center justify-center text-center">
                <Target className="h-10 w-10 text-slate-200 dark:text-slate-800 mb-4" />
                <p className="text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                  Clean Record: No Open Disputes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

interface StatCardProps {
  label: string;
  value: string | number;
  subtext: string;
  icon: any;
  variant?: "default" | "danger";
}

function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  return (
    <Card className="border-none group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default bg-white dark:bg-slate-900">
      <CardContent>
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-3xl font-black tracking-tighter mb-1 group-hover:text-[#6EAE19] transition-colors">
              {value}
            </p>
            <p className="text-[11px] font-bold text-slate-400 leading-tight w-2/3">
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
        <p className="text-[10px] font-black uppercase tracking-wider dark:text-slate-500">
          {label}
        </p>
      </CardContent>
    </Card>
  );
}

export default Dashboard;
