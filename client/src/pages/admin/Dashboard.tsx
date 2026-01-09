import StatusCard from "@/components/admin/StatusCard";
import { AlertTriangle, Sprout, Users } from "lucide-react";

function Dashboard() {
  return (
    <div className="w-full h-screen p-4">
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
