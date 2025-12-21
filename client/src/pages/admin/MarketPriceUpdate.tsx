import React, {
  useState,
  useMemo,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Search,
  //   Save,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Leaf,
  TrendingUp,
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

// Types
interface Crop {
  id: number;
  name: string;
  category: string;
  currentPrice: number;
}

type PriceUpdates = Record<number, string>;

// Mock Data
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
  const [step, setStep] = useState<1 | 2>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdates>({});

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

  const selectedCropsData = CROP_DATA.filter((crop) =>
    selectedIds.includes(crop.id)
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Submitting Price Updates:", priceUpdates);

    // Example: Formatting for an API call
    const payload = Object.entries(priceUpdates).map(([id, price]) => ({
      cropId: Number(id),
      newPrice: parseFloat(price),
    }));

    console.log("Payload for API:", payload);
    alert("Prices updated successfully!");

    // Reset state
    setStep(1);
    setSelectedIds([]);
    setPriceUpdates({});
  };

  return (
    <div className="bg-secondary w-full h-screen overflow-y-scroll p-4 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Market Price Manager
          </h1>
          <p className="text-muted-foreground">
            Dynamically update crop prices for the current market.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            Step {step} of 2
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {selectedIds.length} Selected
          </Badge>
        </div>
      </div>

      {step === 1 ? (
        /* STEP 1: DYNAMIC SELECTION */
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              Select Crops
            </CardTitle>
            <CardDescription>
              Only selected crops will appear in the next update step.
            </CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search crops or categories..."
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
                      : "hover:bg-slate-50 border-transparent bg-slate-50/30"
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
          <CardFooter className="bg-slate-50/50 flex justify-end p-4 border-t">
            <Button
              disabled={selectedIds.length === 0}
              onClick={() => setStep(2)}
              className="px-8 shadow-md"
            >
              Set New Prices <ChevronRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      ) : (
        /* STEP 2: PRICE UPDATE FORM */
        <form onSubmit={handleSubmit}>
          <Card className="border-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Update Market Rates
                </CardTitle>
                <CardDescription>
                  Enter the final prices for the selected items.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setStep(1)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4" /> Change Selection
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="p-4 text-left font-semibold">
                        Crop Detail
                      </th>
                      <th className="p-4 text-left font-semibold">
                        Current Price
                      </th>
                      <th className="p-4 text-left font-semibold w-[180px]">
                        New Market Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedCropsData.map((crop) => (
                      <tr
                        key={crop.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="font-medium text-base">
                            {crop.name}
                          </div>
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase font-bold px-1.5 py-0"
                          >
                            {crop.category}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground font-mono">
                          {crop.currentPrice.toFixed(2)} MMK
                        </td>
                        <td className="p-4">
                          <div className="relative group">
                            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">
                              MMK
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              required
                              placeholder="0.00"
                              className="pl-7 focus-visible:ring-primary font-mono"
                              value={priceUpdates[crop.id] || ""}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
            <CardFooter className="bg-slate-50/50 flex justify-between p-4 border-t">
              <Button
                variant="outline"
                type="button"
                onClick={() => setStep(1)}
              >
                Go Back
              </Button>
              <Button type="submit" className="px-8 bg-primary shadow-md">
                <CheckCircle2 className="w-4 h-4" /> Save All Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
};

export default MarketPriceUpdate;
