// <KpiCard title="Total Revenue" value="$45,231.89" icon={DollarSign} trend="+20.1%" description="from last month" />
// <KpiCard title="Active Farmers" value="+2,350" icon={Sprout} trend="+180" description="new this month" />
// <KpiCard title="Total Buyers" value="+12,234" icon={Users} trend="+19%" description="active buyers" />
// <KpiCard title="Pending Disputes" value="7" icon={AlertTriangle} description="requires attention" />

import StatusCard from "@/components/admin/StatusCard";
import { AlertTriangle, Sprout, Users } from "lucide-react";

function Dashboard() {
  return (
    <div className="bg-secondary w-full h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-3 gap-4">
        <StatusCard
          title="Active Farmers"
          value="+2,350"
          icon={<Sprout />}
          trend="+180"
          description="new this month"
        />
        <StatusCard
          title="Total Merchants"
          value="+12,234"
          icon={<Users />}
          trend="+19%"
          description="active merchants"
        />
        <StatusCard
          title="Pending Disputes"
          value="7"
          icon={<AlertTriangle />}
          description="requires attention"
        />
      </div>
    </div>
  );
}

export default Dashboard;
