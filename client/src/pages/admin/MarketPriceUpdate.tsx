import React, {
  useState,
  useMemo,
  type ChangeEvent,
  type FormEvent,
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

// Types
interface Crop {
  id: number;
  name: string;
  category: string;
  currentPrice: number;
}

type PriceUpdates = Record<number, string>;
type UnitUpdates = Record<number, string>;

// Mock Data
const MARKETS = [
  "Yangon (Bayintnaung)",
  "Mandalay",
  "Naypyidaw",
  "Monywa",
  "Pathein",
];
const UNITS = ["Bag (108lb)", "Viss (1.6kg)", "Basket", "Metric Ton"];

const CROP_DATA: Crop[] = [
  { id: 1, name: "Pawsanmwe", category: "Rice", currentPrice: 0 },
  { id: 2, name: "Pawsanyin", category: "Rice", currentPrice: 0 },
  { id: 3, name: "Pawsangyi", category: "Rice", currentPrice: 0 },
  { id: 4, name: "Pawsanlat", category: "Rice", currentPrice: 0 },
  { id: 5, name: "Shwepyipawsan", category: "Rice", currentPrice: 0 },
  { id: 6, name: "Sinthuka", category: "Rice", currentPrice: 0 },
  { id: 7, name: "Manothuka", category: "Rice", currentPrice: 0 },
  { id: 8, name: "Yarmying", category: "Rice", currentPrice: 0 },
  { id: 9, name: "Shwewarthun", category: "Rice", currentPrice: 0 },
  { id: 10, name: "Thihtatyin", category: "Rice", currentPrice: 0 },
  { id: 11, name: "Yet 90", category: "Rice", currentPrice: 0 },
  { id: 12, name: "Shwethway", category: "Rice", currentPrice: 0 },
  { id: 13, name: "Pakhanshwewa", category: "Rice", currentPrice: 0 },
  { id: 14, name: "Sanloneshey", category: "Rice", currentPrice: 0 },
  { id: 15, name: "Sanloneto", category: "Rice", currentPrice: 0 },
  { id: 16, name: "Shansan", category: "Rice", currentPrice: 0 },
  { id: 17, name: "Sichosan", category: "Rice", currentPrice: 0 },
  { id: 18, name: "Yadanatoe", category: "Rice", currentPrice: 0 },
  { id: 19, name: "Myopwa", category: "Rice", currentPrice: 0 },
  { id: 20, name: "Meekauk", category: "Rice", currentPrice: 0 },
  { id: 21, name: "Mithisan", category: "Rice", currentPrice: 0 },
  { id: 22, name: "Kauknyinsan", category: "Rice", currentPrice: 0 },
  { id: 23, name: "Lonethwaymwe", category: "Rice", currentPrice: 0 },
  { id: 24, name: "Matpe", category: "Beans", currentPrice: 0 },
  { id: 25, name: "Peditsein", category: "Beans", currentPrice: 0 },
  { id: 26, name: "Padingon", category: "Beans", currentPrice: 0 },
  { id: 27, name: "Peadautpat", category: "Beans", currentPrice: 0 },
  { id: 28, name: "Kalape", category: "Beans", currentPrice: 0 },
  { id: 29, name: "Pegyi", category: "Beans", currentPrice: 0 },
  { id: 30, name: "Boketpe", category: "Beans", currentPrice: 0 },
  { id: 31, name: "Sadawpe", category: "Beans", currentPrice: 0 },
  { id: 32, name: "Penilay", category: "Beans", currentPrice: 0 },
];

const MarketPriceUpdate: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdates>({});
  const [unitUpdates, setUnitUpdates] = useState<UnitUpdates>({});

  // Filter crops based on search
  const filteredCrops = useMemo(() => {
    return CROP_DATA.filter(
      (crop) =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const toggleCrop = (id: number): void => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handlePriceChange = (id: number, value: string): void => {
    setPriceUpdates((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleUnitChange = (id: number, value: string): void => {
    setUnitUpdates((prev) => ({ ...prev, [id]: value }));
  };

  const selectedCropsData = CROP_DATA.filter((crop) =>
    selectedIds.includes(crop.id)
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const payload = selectedCropsData.map((crop) => ({
      market: selectedMarket,
      cropId: crop.id,
      name: crop.name,
      newPrice: parseFloat(priceUpdates[crop.id]),
      unit: unitUpdates[crop.id] || "Standard",
    }));

    console.log("Final Submission Payload:", payload);
    alert("Market prices updated successfully!");

    // Reset
    setStep(1);
    setSelectedIds([]);
    setSelectedMarket("");
  };

  return (
    <div className="bg-secondary w-full h-screen overflow-y-scroll p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Market Price Manager
          </h1>
          <p className="text-muted-foreground">
            {step === 1 && "Start by choosing a marketplace."}
            {step === 2 && "Select the crops available in this market."}
            {step === 3 && "Assign current rates and units."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            Step {step} of 3
          </Badge>
          {selectedMarket && (
            <Badge className="bg-blue-600">{selectedMarket}</Badge>
          )}
        </div>
      </div>

      {/* STEP 1: SELECT MARKETPLACE */}
      {step === 1 && (
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" /> Select Marketplace
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MARKETS.map((market) => (
              <Button
                key={market}
                variant={selectedMarket === market ? "default" : "outline"}
                className="h-20 text-lg font-semibold"
                onClick={() => setSelectedMarket(market)}
              >
                {market}
              </Button>
            ))}
          </CardContent>
          <CardFooter className="justify-end border-t p-4">
            <Button
              disabled={!selectedMarket}
              onClick={() => setStep(2)}
              className="px-8"
            >
              Continue to Crops <ChevronRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 2: SELECT CROPS */}
      {step === 2 && (
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" /> Select Crops
            </CardTitle>
            <CardDescription>
              Only selected crops will appear in the next update step.
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
                  key={crop.id}
                  onClick={() => toggleCrop(crop.id)}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedIds.includes(crop.id)
                      ? "bg-primary/5 border-primary shadow-sm"
                      : "hover:bg-primary/15 border-transparent bg-slate-50/30"
                  }`}
                >
                  <Checkbox
                    id={`crop-${crop.id}`}
                    checked={selectedIds.includes(crop.id)}
                    onCheckedChange={() => toggleCrop(crop.id)}
                    className="data-[state=checked]:bg-primary"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={`crop-${crop.id}`}
                      className="font-semibold cursor-pointer"
                    >
                      {crop.name}
                    </Label>
                    <p className="text-xs text-muted-foreground uppercase font-medium tracking-wider">
                      {crop.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold">
                      {crop.currentPrice} MMK
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="w-4 h-4" /> Back to Market
            </Button>
            <Button
              disabled={selectedIds.length === 0}
              onClick={() => setStep(3)}
            >
              Set Prices & Units <ChevronRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 3: PRICE & UNIT UPDATE */}
      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <Card className="border-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" /> Finalize
                  Market Rates
                </CardTitle>
                <CardDescription>
                  Updating prices for {selectedMarket}
                </CardDescription>
              </div>
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
                      <tr key={crop.id}>
                        <td className="p-4 font-medium">{crop.name}</td>
                        <td className="p-4">
                          <Select
                            onValueChange={(val) =>
                              handleUnitChange(crop.id, val)
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
                          <div className="relative">
                            <Input
                              type="number"
                              required
                              placeholder="0.00"
                              className="font-mono"
                              value={priceUpdates[crop.id] || ""}
                              onChange={(e) =>
                                handlePriceChange(crop.id, e.target.value)
                              }
                            />
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
                <ArrowLeft className="w-4 h-4" />
                Back to Crops
              </Button>
              <Button type="submit">
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
