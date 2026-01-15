import { useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarClock,
  Package,
  ChevronRight,
  MapPin,
  Info,
} from "lucide-react";
import { useGetMyPreordersQuery } from "@/store/slices/preorderApi";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/store";

function PreorderList() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data, isLoading } = useGetMyPreordersQuery(user?.id, {
    skip: !user?.id,
  });

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="space-y-4 p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <Package className="text-primary" /> My Preorder Requests
      </h2>

      {data?.map((order: any) => {
        const isExpanded = selectedOrderId === order._id;
        const merchant = order.merchantInfo;

        return (
          <Card
            key={order._id}
            className={`transition-all duration-200 ${
              isExpanded ? "ring-2 ring-primary/20" : "hover:bg-slate-50"
            }`}
          >
            <CardHeader
              className="pb-2 cursor-pointer"
              onClick={() => setSelectedOrderId(isExpanded ? null : order._id)}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-base font-bold">
                    {merchant?.merchantId?.businessName || "Unknown Store"}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CalendarClock className="w-3 h-3" />
                    Ordered: {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={
                      order.status === "pending"
                        ? "bg-amber-600"
                        : order.status === "cancelled"
                        ? "bg-red-400"
                        : "bg-green-500"
                    }
                    // variant={order.status === "pending" ? "secondary" : "default"}
                  >
                    {order.status}
                  </Badge>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Summary View */}
              {!isExpanded && (
                <p className="text-sm text-slate-600 truncate">
                  {order.items
                    .map((i: any) => `${i.quantity} ${i.unit}`)
                    .join(", ")}
                </p>
              )}

              {/* Detailed View */}
              {isExpanded && (
                <div className="mt-4 space-y-4 border-t pt-4 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
                        <Package className="w-3 h-3" /> Items Requested
                      </h4>
                      <ul className="text-sm space-y-1">
                        {order.items.map((item: any, idx: number) => (
                          <li
                            key={idx}
                            className="flex justify-between border-b border-dashed pb-1"
                          >
                            <span>{item.cropName || "Crop"}</span>
                            <span className="font-mono font-medium">
                              {item.quantity} {item.unit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Pickup Location
                      </h4>
                      <div className="text-sm text-slate-600">
                        <p>{merchant?.homeAddress}</p>
                        <p>
                          {merchant?.township}, {merchant?.division}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary p-3 rounded-lg flex items-start gap-3">
                    <Info className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs font-bold">Delivery Timeline</p>
                      <p className="text-sm text-slate-600">
                        Expected within {order.deliveryTimeline.count}{" "}
                        {order.deliveryTimeline.unit}
                      </p>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="text-sm italic text-slate-500 bg-orange-50/50 p-2 rounded">
                      " {order.notes} "
                    </div>
                  )}

                  <Button
                    // variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setSelectedOrderId(null)}
                  >
                    Close Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default PreorderList;
