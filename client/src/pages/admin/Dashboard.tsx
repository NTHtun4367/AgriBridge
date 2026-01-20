import { useMemo } from "react";
import { useGetAdminDashboardQuery } from "@/store/slices/adminApi";
import { useGetDisputesQuery } from "@/store/slices/disputeApi";
import {
  AlertTriangle,
  Sprout,
  Users,
  BarChart3,
  Clock,
  Target,
  Scale,
  ExternalLink,
  // Zap,
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
      <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-3 rounded-xl shadow-xl animate-in zoom-in-95 duration-200">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {payload[0].payload.name}
        </p>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#6EAE19]" />
          <p className="text-sm font-bold">
            {payload[0].value.toLocaleString()}{" "}
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
          {/* <div className="inline-flex items-center gap-2 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
              <Zap className="h-3 w-3 text-emerald-500 fill-emerald-500" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">
                Infrastructure Live
              </span>
            </div> */}
          <h1 className="text-4xl font-bold tracking-tight">
            {/* Admin <span className="text-[#6EAE19]">Intelligence</span> */}
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            Global ecosystem metrics and user acquisition.
          </p>
        </div>

        {/* <div className="hidden md:flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Network Latency
              </p>
              <p className="text-sm font-black text-emerald-500">
                24ms{" "}
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
          </div> */}
      </header>

      {/* --- STATS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          label="Active Farmers"
          value={stats?.activeFarmers || 0}
          subtext="Verified agricultural producers"
          icon={Sprout}
        />
        <StatCard
          label="Verified Merchants"
          value={stats?.totalMerchants || 0}
          subtext="Authorized buying entities"
          icon={Users}
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
                <div className="p-2 bg-slate-50 rounded-lg text-emerald-500">
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
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">
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

        {/* --- DISPUTES FEED --- */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-[#6EAE19]" />
              <h3 className="font-bold">Recent Disputes</h3>
            </div>
            <Link
              to="/admin/disputes"
              className="text-[11px] font-bold text-slate-400 hover:text-[#6EAE19] transition-colors"
            >
              VIEW FEED
            </Link>
          </div>

          <div className="space-y-4">
            {recentDisputes.length > 0 ? (
              recentDisputes.map((dispute: any) => (
                <Card
                  key={dispute._id}
                  className="group relative border-none shadow-sm p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
                >
                  <div className="flex justify-between items-center">
                    <Badge
                      className={cn(
                        "text-[9px] font-black px-2 rounded-md border-none uppercase tracking-tighter",
                        dispute.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700",
                      )}
                    >
                      {dispute.status}
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Just Now
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-relaxed">
                    {dispute.reason}
                  </h4>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Users className="h-3 w-3 text-slate-400" />
                      </div>
                      <span className="text-[10px] font-black text-slate-400">
                        #TRX-{dispute._id.slice(-4).toUpperCase()}
                      </span>
                    </div>

                    <Link
                      to="/admin/disputes"
                      className="inline-flex items-center gap-1 text-[11px] font-black text-[#6EAE19] group-hover:gap-2 transition-all"
                    >
                      RESOLVE <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </Card>
              ))
            ) : (
              <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-4xl p-12 flex flex-col items-center justify-center text-center">
                <Target className="h-10 w-10 text-slate-200 mb-4" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Everything is clear
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
    <Card className="border-none group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
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
                ? "text-red-500 bg-red-50 group-hover:bg-red-500 group-hover:text-white"
                : "text-[#6EAE19] bg-emerald-50 group-hover:bg-[#6EAE19] group-hover:text-white",
            )}
          >
            <Icon size={20} />
          </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-wider">
          {label}
        </p>
      </CardContent>
    </Card>
  );
}

export default Dashboard;
