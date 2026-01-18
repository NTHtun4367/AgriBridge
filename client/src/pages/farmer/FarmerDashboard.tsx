import StatusCard from "@/common/StatusCard";
import ActivityTitle from "@/components/farmer/ActivityTitle";
import AddEntryDialog from "@/components/farmer/AddEntryDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useGetAllEntriesQuery,
  useGetFinanceStatsQuery,
} from "@/store/slices/farmerApi";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router";

function FarmerDashboard() {
  const navigate = useNavigate();
  const { data: finance } = useGetFinanceStatsQuery();
  const { data: entries } = useGetAllEntriesQuery();

  return (
    <div className="w-full h-screen p-4 animate-in slide-in-from-bottom-4 duration-500">
      {/* <ProfileUploadDialog /> */}
      <h2 className="text-2xl font-bold mb-6">Overview</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatusCard
          title="Total Revenue"
          bgColor="bg-blue-500/15"
          value={finance?.totalIncome!}
          icon={<TrendingUp className="w-6 h-6 text-blue-500" />}
        />
        <StatusCard
          title="Total Cost"
          bgColor="bg-red-500/15"
          value={finance?.totalExpense!}
          icon={<TrendingDown className="w-6 h-6 text-red-500" />}
        />
        <StatusCard
          title="Net Profit"
          bgColor="bg-primary/15"
          value={finance?.profit!}
          icon={<DollarSign className="w-6 h-6 text-primary" />}
        />
      </div>
      <Card>
        <CardTitle>
          <div className="flex items-center justify-between mx-6">
            <h2>Recent Activity</h2>
            <AddEntryDialog />
          </div>
        </CardTitle>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {entries && entries.length === 0 ? (
              <div>
                No recent entries.
              </div>
            ) : (
              // We slice the array from index 0 to 6 before mapping
              entries
                ?.slice(0, 6)
                .map((en) => (
                  <ActivityTitle
                    key={en._id}
                    id={en._id}
                    title={en.category}
                    cat={en.type}
                    amount={en.value}
                    type={en.type}
                    date={en.createdAt}
                  />
                ))
            )}
          </div>
          <div className="flex items-center justify-end">
            <Button
              variant={"outline"}
              className="mt-2"
              onClick={() => navigate("/farmer/records")}
            >
              See All
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border-2 border-slate-200 rounded-xl my-3 p-6 shadow-none">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl"></div>
          <div>
            <h4 className="font-bold">Market Alert</h4>
            <p className="text-xs text-slate-500 font-medium">
              Paddy prices are up 5% today in your region.
            </p>
          </div>
        </div>
        <Button
          className="w-full font-bold"
          onClick={() => navigate("/farmer/markets")}
        >
          Check Live Prices
        </Button>
      </Card>
    </div>
  );
}

export default FarmerDashboard;
