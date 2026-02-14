import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
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
import { localizeData } from "@/utils/translator";

function PreorderList() {
  const { t, i18n } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data, isLoading } = useGetMyPreordersQuery(user?.id, {
    skip: !user?.id,
  });

  // Apply localization to the fetched data based on current language
  const localizedOrders = useMemo(() => {
    if (!data) return [];
    return localizeData(data, i18n.language as "en" | "mm");
  }, [data, i18n.language]);

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground font-medium">
        {t("farmer_preorders.loading")}
      </div>
    );

  return (
    <div className="space-y-4 p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 mm:leading-loose">
        <Package className="text-primary" /> {t("farmer_preorders.title")}
      </h2>

      {localizedOrders?.map((order: any) => {
        const isExpanded = selectedOrderId === order._id;
        const merchant = order.merchantInfo;

        return (
          <Card
            key={order._id}
            className={`transition-all duration-200 ${
              isExpanded
                ? "ring-2 ring-primary/20 shadow-md"
                : "hover:bg-slate-50"
            }`}
          >
            <CardHeader
              className="pb-2 cursor-pointer"
              onClick={() => setSelectedOrderId(isExpanded ? null : order._id)}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-base font-bold">
                    {merchant?.merchantId?.businessName ||
                      t("farmer_preorders.unknown_store")}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <CalendarClock className="w-3 h-3" />
                    {t("farmer_preorders.ordered_date")}:{" "}
                    {new Date(order.createdAt).toLocaleDateString(
                      i18n.language === "mm" ? "my-MM" : "en-US",
                    )}
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
                  >
                    {/* Assuming status strings like "pending" are in your i18n JSON */}
                    {t(`${order.status}`)}
                  </Badge>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform text-slate-400 ${
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
                        <Package className="w-3 h-3" />{" "}
                        {t("farmer_preorders.items_requested")}
                      </h4>
                      <ul className="text-sm space-y-2">
                        {order.items.map((item: any, idx: number) => (
                          <li
                            key={idx}
                            className="flex justify-between border-b border-dashed border-slate-200 pb-1.5"
                          >
                            <span className="font-medium text-slate-700">
                              {item.cropName || "Crop"}
                            </span>
                            <span className="font-mono font-bold text-primary mm:leading-loose">
                              {item.quantity} {item.unit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{" "}
                        {t("farmer_preorders.pickup_location")}
                      </h4>
                      <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-md border border-slate-100">
                        <p className="font-medium">{merchant?.homeAddress}</p>
                        <p className="text-xs mm:mt-0 mm:mb-0">
                          {merchant?.township}, {merchant?.division}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-3 rounded-lg flex items-start gap-3 border border-primary/10">
                    <Info className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-primary">
                        {t("farmer_preorders.delivery_timeline")}
                      </p>
                      <p className="text-sm text-slate-700">
                        {t("farmer_preorders.expected_within", {
                          count: order.deliveryTimeline.count,
                          unit: t(
                            `farmer_preorders.units.${order.deliveryTimeline.unit}`,
                          ),
                        })}
                      </p>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="text-sm italic text-slate-600 bg-orange-50/50 p-3 rounded border border-orange-100/50">
                      " {order.notes} "
                    </div>
                  )}

                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs font-bold"
                    onClick={() => setSelectedOrderId(null)}
                  >
                    {t("farmer_preorders.close_details")}
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
