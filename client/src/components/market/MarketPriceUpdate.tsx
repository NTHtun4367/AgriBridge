import React, { useState, useMemo, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Leaf,
  TrendingUp,
  Store,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllCropsQuery,
  useGetAllMarketsQuery,
  useUpdateMarketPricesMutation,
} from "@/store/slices/marketApi";
import { toast } from "sonner";

type PriceUpdates = Record<string, string>;
type UnitUpdates = Record<string, string>;
type AmountUpdates = Record<string, string>;

// Map keys to translation paths
export const UNIT_OPTIONS = [
  { labelKey: "viss", value: "Viss (1.63kg)" },
  { labelKey: "bag", value: "Bag" },
  { labelKey: "tin", value: "Tin" },
  { labelKey: "basket", value: "Basket" },
  { labelKey: "ton", value: "Metric Ton" },
  { labelKey: "lb", value: "Pound (lb)" },
];

interface MarketPriceUpdateProps {
  role: "admin" | "merchant";
}

const MarketPriceUpdate: React.FC<MarketPriceUpdateProps> = ({ role }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2 | 3>(role === "merchant" ? 2 : 1);
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdates>({});
  const [unitUpdates, setUnitUpdates] = useState<UnitUpdates>({});
  const [amountUpdates, setAmountUpdates] = useState<AmountUpdates>({});

  const { data: CROP_DATA, isLoading: isLoadingCrops } =
    useGetAllCropsQuery(undefined);
  const { data: MARKETS, isLoading: isLoadingMarkets } = useGetAllMarketsQuery(
    undefined,
    { skip: role === "merchant" },
  );
  const [updateMarketPrices, { isLoading: isUpdating }] =
    useUpdateMarketPricesMutation();

  const filteredCrops = useMemo(() => {
    return (CROP_DATA || []).filter(
      (crop) =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.category.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, CROP_DATA]);

  const toggleCrop = (_id: string): void => {
    setSelectedIds((prev) =>
      prev.includes(_id) ? prev.filter((i) => i !== _id) : [...prev, _id],
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    let payload: any = {
      updates: (CROP_DATA || [])
        .filter((c) => selectedIds.includes(c._id))
        .map((crop) => ({
          cropId: crop._id,
          price: parseFloat(priceUpdates[crop._id]),
          amount: amountUpdates[crop._id]
            ? parseFloat(amountUpdates[crop._id])
            : undefined,
          unit: unitUpdates[crop._id],
        })),
    };

    if (role === "admin") {
      const market = MARKETS?.find((m) => m.name === selectedMarket);
      if (!market) {
        toast.warning("Please select a valid market");
        return;
      }
      payload.marketId = market._id;
    }

    try {
      await updateMarketPrices(payload).unwrap();
      toast.success(t("price_update.finalize_card.toast_success"));
      setStep(role === "merchant" ? 2 : 1);
      setSelectedIds([]);
      setSelectedMarket("");
      setPriceUpdates({});
      setUnitUpdates({});
      setAmountUpdates({});
    } catch (error) {
      toast.error(t("price_update.finalize_card.toast_error"));
    }
  };

  if (isLoadingCrops || (role === "admin" && isLoadingMarkets)) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const currentStepDisplay = role === "merchant" ? step - 1 : step;
  const totalStepsDisplay = role === "merchant" ? 2 : 3;

  return (
    <div className="w-full h-screen p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mm:leading-loose">
            {role === "admin"
              ? t("price_update.title_admin")
              : t("price_update.title_merchant")}
          </h1>
          <p className="text-muted-foreground mm:leading-loose">
            {t(`price_update.steps.step${step}`)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            {t("price_update.steps.label", {
              current: currentStepDisplay,
              total: totalStepsDisplay,
            })}
          </Badge>
          {role === "admin" && selectedMarket && (
            <Badge className="bg-blue-600">{selectedMarket}</Badge>
          )}
        </div>
      </div>

      {step === 1 && role === "admin" && (
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 mm:leading-loose">
              <Store className="w-5 h-5 text-primary" />{" "}
              {t("price_update.market_card.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(MARKETS || []).map((market) => (
              <Button
                key={market._id}
                variant={selectedMarket === market.name ? "default" : "outline"}
                className="h-20 text-lg font-semibold"
                onClick={() => setSelectedMarket(market.name)}
              >
                {market.name}
              </Button>
            ))}
          </CardContent>
          <CardFooter className="justify-end border-t p-4">
            <Button disabled={!selectedMarket} onClick={() => setStep(2)}>
              {t("price_update.market_card.continue")}{" "}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />{" "}
              {t("price_update.crop_card.title")}
            </CardTitle>
            <CardDescription>
              {t("price_update.crop_card.description")}
            </CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("price_update.crop_card.search_placeholder")}
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredCrops.map((crop) => (
                <div
                  key={crop._id}
                  onClick={() => toggleCrop(crop._id)}
                  className="flex items-center space-x-3 rounded-xl p-4 cursor-pointer border border-primary hover:bg-primary/10"
                >
                  <Checkbox
                    checked={selectedIds.includes(crop._id)}
                    onCheckedChange={() => toggleCrop(crop._id)}
                  />
                  <div className="flex-1 mm:-mb-6 mm:space-y-3">
                    <Label className="font-semibold cursor-pointer">
                      {crop.name}
                    </Label>
                    <p className="text-xs text-muted-foreground uppercase">
                      {crop.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            {role === "admin" ? (
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4" />{" "}
                {t("price_update.crop_card.back")}
              </Button>
            ) : (
              <div />
            )}
            <Button
              disabled={selectedIds.length === 0}
              onClick={() => setStep(3)}
            >
              {t("price_update.crop_card.next")}{" "}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />{" "}
                {t("price_update.finalize_card.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary border-b">
                    <tr>
                      <th className="p-4 text-left">
                        {t("price_update.finalize_card.col_crop")}
                      </th>
                      <th className="p-4 text-left">
                        {t("price_update.finalize_card.col_qty")}
                      </th>
                      <th className="p-4 text-left">
                        {t("price_update.finalize_card.col_unit")}
                      </th>
                      <th className="p-4 text-left w-[180px]">
                        {t("price_update.finalize_card.col_price")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(CROP_DATA || [])
                      .filter((c) => selectedIds.includes(c._id))
                      .map((crop) => (
                        <tr key={crop._id}>
                          <td className="p-4 font-medium">{crop.name}</td>
                          <td className="p-4">
                            <Input
                              type="number"
                              placeholder="Qty"
                              value={amountUpdates[crop._id] || ""}
                              onChange={(e) =>
                                setAmountUpdates((prev) => ({
                                  ...prev,
                                  [crop._id]: e.target.value,
                                }))
                              }
                              className="w-24"
                            />
                          </td>
                          <td className="p-4">
                            <Select
                              onValueChange={(v) =>
                                setUnitUpdates((prev) => ({
                                  ...prev,
                                  [crop._id]: v,
                                }))
                              }
                              required
                            >
                              <SelectTrigger className="w-36">
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                {UNIT_OPTIONS.map((u) => (
                                  <SelectItem key={u.value} value={u.value}>
                                    {t(`price_update.units.${u.labelKey}`)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-4">
                            <Input
                              type="number"
                              required
                              placeholder="0.00"
                              value={priceUpdates[crop._id] || ""}
                              onChange={(e) =>
                                setPriceUpdates((prev) => ({
                                  ...prev,
                                  [crop._id]: e.target.value,
                                }))
                              }
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setStep(2)}
              >
                <ArrowLeft className="w-4 h-4" />{" "}
                {t("price_update.finalize_card.back")}
              </Button>
              <Button type="submit" disabled={isUpdating}>
                <CheckCircle2 className="w-4 h-4" />{" "}
                {t("price_update.finalize_card.publish")}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
};

export default MarketPriceUpdate;
