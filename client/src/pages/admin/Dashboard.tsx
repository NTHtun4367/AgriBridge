import StatusCard from "@/components/admin/StatusCard";
import { AlertTriangle, Sprout, Users } from "lucide-react";

function Dashboard() {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here is what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatusCard
          title="Active Farmers"
          value="+2,350"
          icon={<Sprout className="text-primary" />}
          trend="+180"
          description="new this month"
        />
        <StatusCard
          title="Total Merchants"
          value="+12,234"
          icon={<Users className="text-primary" />}
          trend="+19%"
          description="active merchants"
        />
        <StatusCard
          title="Pending Disputes"
          value="7"
          icon={<AlertTriangle className="text-destructive" />}
          description="requires attention"
        />
      </div>
      
      {/* Example for more content background compatibility */}
      <div className="w-full h-64 rounded-xl border border-border bg-card p-6 shadow-sm flex items-center justify-center text-muted-foreground">
        Analytics Chart Placeholder (Auto-compatible with Dark Mode)
      </div>
    </div>
  );
}

export default Dashboard;