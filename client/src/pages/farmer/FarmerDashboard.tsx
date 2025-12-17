import StatusCard from "@/common/StatusCard";
import { AddEntryDialog } from "@/components/farmer/AddEntryDialog";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

function FarmerDashboard() {
  return (
    <div className="bg-secondary w-full h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Overview</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatusCard
          title="Total Revenue"
          bgColor="bg-blue-500/15"
          value={123.4}
          icon={<TrendingUp className="w-6 h-6 text-blue-500" />}
        />
        <StatusCard
          title="Total Cost"
          bgColor="bg-red-500/15"
          value={123.4}
          icon={<TrendingDown className="w-6 h-6 text-red-500" />}
        />
        <StatusCard
          title="Net Profit"
          bgColor="bg-primary/15"
          value={123.4}
          icon={<DollarSign className="w-6 h-6 text-primary" />}
        />
      </div>
      <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
      <AddEntryDialog />
    </div>
  );
}

export default FarmerDashboard;
