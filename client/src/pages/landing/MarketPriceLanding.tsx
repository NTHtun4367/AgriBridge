import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navigation from "@/common/home/Navigation";
import Footer from "@/common/home/Footer";
import { useNavigate } from "react-router";
import { MarketPriceTable } from "@/components/market/MarketPriceTable";
import {
  useGetAllMarketsQuery,
  useGetMarketPricesQuery,
} from "@/store/slices/marketApi";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

function MarketPriceLanding() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMarket, setSelectedMarket] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "cropName",
    direction: "asc",
  });

  // Current Date formatting
  const todayDate = format(new Date(), "dd-MM-yyyy");

  const { data: response } = useGetMarketPricesQuery({
    official: true,
    marketId: selectedMarket === "all" ? undefined : selectedMarket,
  });

  const { data: markets = [] } = useGetAllMarketsQuery(undefined);
  const navigate = useNavigate();
  const rawData = response?.data || [];

  const categoryOptions = useMemo(() => {
    const unique = Array.from(
      new Set(rawData.map((item: any) => item.category)),
    );
    return ["all", ...unique];
  }, [rawData]);

  const processedData = useMemo(() => {
    let filtered = [...rawData];
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.cropName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    if (selectedMarket !== "all") {
      filtered = filtered.filter((item) => item.marketId === selectedMarket);
    }
    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a: any, b: any) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [rawData, searchTerm, selectedCategory, selectedMarket, sortConfig]);

  const groupedData = useMemo(() => {
    if (selectedMarket !== "all") return [];
    return markets
      .map((m: any) => ({
        marketName: m.name,
        marketId: m._id,
        items: processedData.filter((item) => item.marketId === m._id),
      }))
      .filter((group) => group.items.length > 0);
  }, [processedData, selectedMarket, markets]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <header className="relative overflow-hidden pt-32 pb-8 animate-in slide-in-from-bottom-15 duration-1000">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium font-mono tracking-tighter">
              <Calendar className="h-3 w-3" />
              {todayDate}
            </div>
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-primary">
                Today's <br />
                <span className="text-primary">Market Prices</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Real-time updates of the latest market prices from major trading
                centers across the country, all in one place.
              </p>
            </div>
          </div>
          {/* Search & Filters */}
          <div className="relative mt-16 max-w-4xl mx-auto px-6 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search crops..."
                  className="pl-9 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col items-center gap-3">
              <span className="text-sm font-medium text-slate-500">
                FILTER BY MARKET
              </span>
              <div className="flex flex-wrap justify-center items-center gap-2 pb-2">
                <button
                  onClick={() => setSelectedMarket("all")}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
                    selectedMarket === "all"
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-primary/50 hover:bg-slate-50",
                  )}
                >
                  All Markets
                </button>
                {markets.map((m: any) => (
                  <button
                    key={m._id}
                    onClick={() => setSelectedMarket(m._id)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-medium transition-all border whitespace-nowrap",
                      selectedMarket === m._id
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-primary/50 hover:bg-slate-50",
                    )}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-16 px-6">
        {selectedMarket === "all" ? (
          <div className="space-y-20">
            {groupedData.map((group) => (
              <div key={group.marketId} className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-4 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl text-primary font-semibold uppercase tracking-tight">
                        {group.marketName}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Prices for {group.marketName} as of {todayDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 font-medium italic">
                    {group.items.length} crops found
                  </div>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <MarketPriceTable
                      data={group.items}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                      onRowClick={(cropId, marketId) =>
                        navigate(
                          `/crop-price-history?cropId=${cropId}&marketId=${marketId}`,
                        )
                      }
                    />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-4 gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-normal text-slate-800 uppercase tracking-tight">
                    {processedData[0]?.marketName}
                  </h2>
                  <p className="text-[12px] text-slate-500 font-light">
                    Prices for {processedData[0]?.marketName} as of {todayDate}
                  </p>
                </div>
              </div>
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <MarketPriceTable
                  data={processedData}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  onRowClick={(cropId, marketId) =>
                    navigate(
                      `/crop-price-history?cropId=${cropId}&marketId=${marketId}`,
                    )
                  }
                />
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MarketPriceLanding;
