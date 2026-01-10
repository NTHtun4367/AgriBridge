import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calculator, CheckCircle, Package } from "lucide-react";

export function DashboardStats() {
  const stats = [
    { label: "Active Preorders", val: "24", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Pending Value", val: "$12,450", icon: Calculator, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Confirmed Today", val: "8", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
    { label: "Avg. Fulfilment", val: "3 Days", icon: Package, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.val}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}