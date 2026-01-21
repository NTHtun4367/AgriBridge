import { useMemo } from "react";
import { useGetAdminDashboardQuery } from "@/store/slices/adminApi";
import { useGetDisputesQuery } from "@/store/slices/disputeApi";
import {
  AlertTriangle,
  Users,
  BarChart3,
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
  Cell,
  Tooltip,
} from "recharts";
import { Link } from "react-router";

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

// --- BEAUTIFUL CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl animate-in zoom-in-95 duration-200">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {payload[0].payload.name}
        </p>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#6EAE19]" />
          <p className="text-sm font-bold">
            {payload[0].value.toLocaleString()}
            <span className="text-slate-400 font-medium">Users</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { data: response, isLoading: dashboardLoading } =
    useGetAdminDashboardQuery();
  const { data: disputeResponse, isLoading: disputesLoading } =
    useGetDisputesQuery(undefined);

  const formattedChartData = useMemo(() => {
    if (!response?.data?.chartData) return [];
    return [...response.data.chartData].map((item: any) => ({
      ...item,
      users: Number(item.users),
      displayMonth: item.name?.substring(0, 3).toUpperCase(),
    }));
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
        {/* --- ANALYTICS SECTION --- */}
        <div className="xl:col-span-2 space-y-8">
          <Card className="border-none p-2">
            <CardHeader className="flex flex-row items-center justify-between pt-4 px-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-primary">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">
                    User Acquisition Trends
                  </CardTitle>
                  <p className="text-xs text-slate-400 font-medium">
                    Monthly onboarding volume across the network
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black">+1</p>
                <p className="text-[9px] font-bold text-primary uppercase tracking-tighter">
                  Growth this month
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={formattedChartData}
                    margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="displayMonth"
                      axisLine={false}
                      tickLine={false}
                      angle={-90}
                      textAnchor="end"
                      dy={10}
                      tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                      label={{
                        value: "TOTAL USERS",
                        angle: -90,
                        position: "insideLeft",
                        offset: -20,
                        style: {
                          textAnchor: "middle",
                          fontSize: "10px",
                          fontWeight: "900",
                          fill: "#94a3b8",
                          letterSpacing: "0.1em",
                        },
                      }}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "#F8FAFC", radius: 8 }}
                    />
                    <Bar dataKey="users" radius={[8, 8, 8, 8]} barSize={28}>
                      {formattedChartData.map((_entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            index === formattedChartData.length - 1
                              ? "#6EAE19"
                              : "#E2E8F0"
                          }
                          className="transition-all duration-300 hover:opacity-80"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- REDESIGNED DISPUTES FEED --- */}
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
                  {/* Status Indicator Bar */}
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
    <Card className="border-none group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default  ">
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
