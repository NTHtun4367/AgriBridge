import StatusCard from "@/common/StatusCard";
import { AddEntryDialog } from "@/components/farmer/AddEntryDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

function FarmerDashboard() {
  return (
    <div className="bg-secondary w-full h-screen p-4 animate-in slide-in-from-bottom-4 duration-500">
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
      <Card>
        <CardTitle>
          <div className="flex items-center justify-between mx-6">
            <h2>Recent Activity</h2>
            <AddEntryDialog />
          </div>
        </CardTitle>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <ActivityTile
              title="Fertilizer Purchase"
              cat="Expenses"
              amount="85,000"
              date="2h ago"
              type="expense"
            />
            <ActivityTile
              title="Paddy Wholesale"
              cat="Income"
              amount="420,000"
              date="5h ago"
              type="income"
            />
            <ActivityTile
              title="Worker Wages"
              cat="Labor"
              amount="30,000"
              date="Yesterday"
              type="expense"
            />
            <ActivityTile
              title="Equipment Rental"
              cat="Logistics"
              amount="15,000"
              date="Yesterday"
              type="expense"
            />
          </div>
          <div className="flex items-center justify-end">
            <Button variant={"outline"} className="mt-2">
              See All
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border-2 border-slate-200 rounded-xl my-3 p-6 bg-white shadow-none">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl"></div>
          <div>
            <h4 className="font-bold">Market Alert</h4>
            <p className="text-xs text-slate-500 font-medium">
              Paddy prices are up 5% today in your region.
            </p>
          </div>
        </div>
        <Button className="w-full rounded-xl py-6 font-bold">
          Check Live Prices
        </Button>
      </Card>
    </div>
  );
}

export default FarmerDashboard;

function ActivityTile({ title, cat, amount, date, type }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-primar transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-xl ${
            type === "income"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-100 text-destructive"
          }`}
        >
          {type === "income" ? (
            <ArrowUpRight size={20} />
          ) : (
            <ArrowDownRight size={20} />
          )}
        </div>
        <div>
          <p className="font-bold text-sm text-slate-800">{title}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            {cat} • {date}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-black ${
            type === "income" ? "text-primary" : "text-destructive/70"
          }`}
        >
          {type === "income" ? "+" : "-"}
          {amount} MMK
        </p>
      </div>
    </div>
  );
}
