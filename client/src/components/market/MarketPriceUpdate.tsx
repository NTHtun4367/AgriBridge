import React, {
  useState,
  useMemo,
  type FormEvent,
  type ChangeEvent,
} from "react";
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

const UNITS = ["Bag (108lb)", "Viss (1.6kg)", "Basket", "Metric Ton"];

interface MarketPriceUpdateProps {
  role: "admin" | "merchant";
}

const MarketPriceUpdate: React.FC<MarketPriceUpdateProps> = ({ role }) => {
  // If merchant, start at step 2 (Select Crops)
  const [step, setStep] = useState<1 | 2 | 3>(role === "merchant" ? 2 : 1);
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdates>({});
  const [unitUpdates, setUnitUpdates] = useState<UnitUpdates>({});

  // RTK Query hooks
  const { data: CROP_DATA, isLoading: isLoadingCrops } =
    useGetAllCropsQuery(undefined);

  // Only fetch markets if the user is an admin
  const { data: MARKETS, isLoading: isLoadingMarkets } = useGetAllMarketsQuery(
    undefined,
    {
      skip: role === "merchant",
    }
  );

  const [updateMarketPrices, { isLoading: isUpdating }] =
    useUpdateMarketPricesMutation();

  // filter crops for search
  const filteredCrops = useMemo(() => {
    return (CROP_DATA || []).filter(
      (crop) =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, CROP_DATA]);

  const toggleCrop = (_id: string): void => {
    setSelectedIds((prev) =>
      prev.includes(_id) ? prev.filter((i) => i !== _id) : [...prev, _id]
    );
  };

  const handlePriceChange = (_id: string, value: string): void => {
    setPriceUpdates((prev) => ({ ...prev, [_id]: value }));
  };

  const handleUnitChange = (_id: string, value: string): void => {
    setUnitUpdates((prev) => ({ ...prev, [_id]: value }));
  };

  const selectedCropsData = (CROP_DATA || []).filter((crop) =>
    selectedIds.includes(crop._id)
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    let payload: any = {
      updates: selectedCropsData.map((crop) => ({
        cropId: crop._id,
        price: parseFloat(priceUpdates[crop._id]),
        unit: unitUpdates[crop._id],
      })),
    };

    // If Admin, add the marketId to the payload
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
      toast.success("Prices updated successfully!");

      // Reset
      setStep(role === "merchant" ? 2 : 1);
      setSelectedIds([]);
      setSelectedMarket("");
      setPriceUpdates({});
      setUnitUpdates({});
    } catch (error) {
      toast.error("Failed to update prices.");
    }
  };

  if (isLoadingCrops || (role === "admin" && isLoadingMarkets)) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-secondary w-full h-screen overflow-y-scroll p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {role === "admin"
              ? "Market Price Manager"
              : "Inventory Price Update"}
          </h1>
          <p className="text-muted-foreground">
            {step === 1 && "Start by choosing a marketplace."}
            {step === 2 && "Select the crops you want to update."}
            {step === 3 && "Assign current rates and units."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            {/* Adjust step count for Merchant UI */}
            Step {role === "merchant" ? step - 1 : step} of{" "}
            {role === "merchant" ? 2 : 3}
          </Badge>
          {role === "admin" && selectedMarket && (
            <Badge className="bg-blue-600">{selectedMarket}</Badge>
          )}
        </div>
      </div>

      {/* STEP 1: SELECT MARKETPLACE (ADMIN ONLY) */}
      {step === 1 && role === "admin" && (
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" /> Select Marketplace
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
              Continue to Crops <ChevronRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 2: SELECT CROPS (SHARED) */}
      {step === 2 && (
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" /> Select Crops
            </CardTitle>
            <CardDescription>
              Only selected crops will appear in the next step.
            </CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search crops..."
                className="pl-9"
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
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
                    id={`crop-${crop._id}`}
                    checked={selectedIds.includes(crop._id)}
                    onCheckedChange={() => toggleCrop(crop._id)}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={`crop-${crop._id}`}
                      className="font-semibold cursor-pointer"
                    >
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
                <ArrowLeft className="w-4 h-4" /> Back to Market
              </Button>
            ) : (
              <div />
            )}
            <Button
              disabled={selectedIds.length === 0}
              onClick={() => setStep(3)}
            >
              Set Prices & Units <ChevronRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 3: PRICE & UNIT UPDATE (SHARED) */}
      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> Finalize Prices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary border-b">
                    <tr>
                      <th className="p-4 text-left">Crop</th>
                      <th className="p-4 text-left">Unit Type</th>
                      <th className="p-4 text-left w-[200px]">
                        New Price (MMK)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedCropsData.map((crop) => (
                      <tr key={crop._id}>
                        <td className="p-4 font-medium">{crop.name}</td>
                        <td className="p-4">
                          <Select
                            onValueChange={(val) =>
                              handleUnitChange(crop._id, val)
                            }
                            required
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {UNITS.map((u) => (
                                <SelectItem key={u} value={u}>
                                  {u}
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
                              handlePriceChange(crop._id, e.target.value)
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
                <ArrowLeft className="w-4 h-4" /> Back to Crops
              </Button>
              <Button type="submit" disabled={isUpdating}>
                <CheckCircle2 className="w-4 h-4" /> Publish Prices
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
};

export default MarketPriceUpdate;
