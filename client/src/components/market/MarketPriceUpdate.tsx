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
import { localizeData } from "@/utils/translator";

// Helper to convert numbers to Myanmar Numerals for UI display
const toMyanmarNumerals = (n: string | number): string => {
  const burmeseDigits = ["၀", "၁", "၂", "၃", "၄", "၅", "၆", "၇", "၈", "၉"];
  return String(n).replace(/\d/g, (d) => burmeseDigits[parseInt(d)]);
};

type PriceUpdates = Record<string, string>;
type UnitUpdates = Record<string, string>;
type AmountUpdates = Record<string, string>;

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
  const { t, i18n } = useTranslation();

  const currentLang =
    i18n.language === "my" || i18n.language === "mm" ? "mm" : "en";

  const [step, setStep] = useState<1 | 2 | 3>(role === "merchant" ? 2 : 1);
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdates>({});
  const [unitUpdates, setUnitUpdates] = useState<UnitUpdates>({});
  const [amountUpdates, setAmountUpdates] = useState<AmountUpdates>({});

  const { data: CROP_DATA, isLoading: isLoadingCrops } =
    useGetAllCropsQuery(undefined);
  const { data: MARKETS_DATA, isLoading: isLoadingMarkets } =
    useGetAllMarketsQuery(undefined, { skip: role === "merchant" });
  const [updateMarketPrices, { isLoading: isUpdating }] =
    useUpdateMarketPricesMutation();

  const filteredCrops = useMemo(() => {
    if (!CROP_DATA) return [];
    const localized = localizeData(CROP_DATA, currentLang);
    return localized.filter(
      (crop: any) =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.category.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, CROP_DATA, currentLang]);

  const localizedMarkets = useMemo(() => {
    if (!MARKETS_DATA) return [];
    return localizeData(MARKETS_DATA, currentLang);
  }, [MARKETS_DATA, currentLang]);

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
      const market = localizedMarkets?.find(
        (m: any) => m.name === selectedMarket,
      );
      if (!market) {
        toast.warning(
          t("price_update.market_card.select_warning") ||
            "Please select a market",
        );
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
      <div className="flex h-screen items-center justify-center font-bold">
        {currentLang === "mm" ? "ခေတ္တစောင့်ဆိုင်းပါ..." : "Loading..."}
      </div>
    );
  }

  const currentStepDisplay = role === "merchant" ? step - 1 : step;
  const totalStepsDisplay = role === "merchant" ? 2 : 3;

  // Localized Step String
  const stepLabel =
    currentLang === "mm"
      ? `အဆင့် ${toMyanmarNumerals(currentStepDisplay)} (စုစုပေါင်း ${toMyanmarNumerals(totalStepsDisplay)})`
      : t("price_update.steps.label", {
          current: currentStepDisplay,
          total: totalStepsDisplay,
        });

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
          <Badge variant="secondary" className="px-3 py-1 text-sm">
            {stepLabel}
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
            {localizedMarkets.map((market: any) => (
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
            <CardTitle className="flex items-center gap-2 mm:leading-loose">
              <Leaf className="w-5 h-5 text-primary" />{" "}
              {t("price_update.crop_card.title")}
            </CardTitle>
            <CardDescription className="mm:leading-relaxed">
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
              {filteredCrops.map((crop: any) => (
                <div
                  key={crop._id}
                  onClick={() => toggleCrop(crop._id)}
                  className={`flex items-center space-x-3 rounded-xl p-4 cursor-pointer border transition-colors ${
                    selectedIds.includes(crop._id)
                      ? "border-primary bg-primary/5"
                      : "border-input hover:bg-accent"
                  }`}
                >
                  <Checkbox
                    checked={selectedIds.includes(crop._id)}
                    onCheckedChange={() => toggleCrop(crop._id)}
                  />
                  <div className="flex-1 mm:space-y-1">
                    <Label className="font-semibold cursor-pointer block text-base mm:text-sm">
                      {crop.name}
                    </Label>
                    <p className="text-xs text-muted-foreground uppercase mm:mb-0">
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
                <ArrowLeft className="w-4 h-4 mr-2" />{" "}
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
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 mm:leading-loose">
                <TrendingUp className="w-5 h-5 text-blue-600" />{" "}
                {t("price_update.finalize_card.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50 border-b">
                    <tr>
                      <th className="p-4 text-left font-semibold">
                        {t("price_update.finalize_card.col_crop")}
                      </th>
                      <th className="p-4 text-left font-semibold">
                        {t("price_update.finalize_card.col_qty")}
                      </th>
                      <th className="p-4 text-left font-semibold">
                        {t("price_update.finalize_card.col_unit")}
                      </th>
                      <th className="p-4 text-left font-semibold w-[180px]">
                        {t("price_update.finalize_card.col_price")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredCrops
                      .filter((c: any) => selectedIds.includes(c._id))
                      .map((crop: any) => (
                        <tr
                          key={crop._id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-4 font-medium">{crop.name}</td>
                          <td className="p-4">
                            <Input
                              type="number"
                              placeholder="0"
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
                              value={unitUpdates[crop._id]}
                              onValueChange={(v) =>
                                setUnitUpdates((prev) => ({
                                  ...prev,
                                  [crop._id]: v,
                                }))
                              }
                              required
                            >
                              <SelectTrigger className="w-36 mm:leading-loose">
                                <SelectValue
                                  placeholder={
                                    currentLang === "mm" ? "ယူနစ်" : "Unit"
                                  }
                                />
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
                            <div className="relative">
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
                                className="pr-12"
                              />
                              <span className="absolute right-3 top-2.5 text-muted-foreground text-xs">
                                {t("price_update.mmk")}
                              </span>
                            </div>
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
                <ArrowLeft className="w-4 h-4 mr-2" />{" "}
                {t("price_update.finalize_card.back")}
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-primary hover:bg-primary/90"
              >
                {isUpdating ? (
                  "..."
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />{" "}
                    {t("price_update.finalize_card.publish")}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
};

export default MarketPriceUpdate;
