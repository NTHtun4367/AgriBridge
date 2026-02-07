import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Calendar } from "lucide-react"; // Added Calendar icon
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router";
import { MarketPriceTable } from "@/components/market/MarketPriceTable";
import {
  useGetMarketPricesQuery,
  useGetAllMarketsQuery,
} from "@/store/slices/marketApi";
import { useCurrentUserQuery } from "@/store/slices/userApi";
import { cn } from "@/lib/utils";
import { format } from "date-fns"; // Import format for date handling

function MarketDashboard() {
  const { data: user } = useCurrentUserQuery();

  // --- Search, Filter & Sort States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMarket, setSelectedMarket] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "cropName", // Default sort
    direction: "asc",
  });

  // --- API Calls ---
  const { data: markets = [] } = useGetAllMarketsQuery(undefined);
  const { data: response } = useGetMarketPricesQuery({
    official: true,
    marketId: selectedMarket === "all" ? undefined : selectedMarket,
  });

  const navigate = useNavigate();
  const rawData = response?.data || [];

  // --- Date Logic ---
  // Get the most recent update date from the dataset
  const lastUpdatedDate = useMemo(() => {
    if (rawData.length === 0) return null;
    const dates = rawData.map((item: any) => new Date(item.updatedAt || item.date).getTime());
    return new Date(Math.max(...dates));
  }, [rawData]);

  // Generate unique categories for the dropdown
  const categoryOptions = useMemo(() => {
    const unique = Array.from(
      new Set(rawData.map((item: any) => item.category)),
    );
    return ["all", ...unique];
  }, [rawData]);

  // Combined logic: Search -> Category Filter -> Market Filter -> Sort
  const processedData = useMemo(() => {
    let filtered = [...rawData];

    // 1. Search filter
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.cropName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // 2. Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // 3. Market filter (Crucial for single market view)
    if (selectedMarket !== "all") {
      filtered = filtered.filter((item) => item.marketId === selectedMarket);
    }

    // 4. Sorting logic
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

  // Group data by market for the "All Markets" view
  const groupedData = useMemo(() => {
    if (selectedMarket !== "all") return [];

    return markets
      .map((m: any) => ({
        marketName: m.name,
        marketId: m._id,
        items: processedData.filter((item: any) => item.marketId === m._id),
      }))
      .filter((group: any) => group.items.length > 0);
  }, [processedData, selectedMarket, markets]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="w-full h-screen p-4">
      {/* HEADER SECTION WITH DATE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Market Prices</h2>
          <p className="text-muted-foreground mt-2">
            Real-time updates of the latest market prices.
          </p>
        </div>
        
        {lastUpdatedDate && (
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <Calendar className="h-4 w-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-tight">Latest Update</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {format(lastUpdatedDate, "dd MMMM yyyy")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Horizontal Market Tags */}
      <div className="mb-8">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
          Filter by Market
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedMarket("all")}
            className={cn(
              "px-5 py-1.5 rounded-full text-sm font-medium transition-all border",
              selectedMarket === "all"
                ? "bg-primary text-white border-primary shadow-md"
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
                "px-5 py-1.5 rounded-full text-sm font-medium transition-all border whitespace-nowrap",
                selectedMarket === m._id
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:border-primary/50 hover:bg-slate-50",
              )}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Category Filter Row */}
      <Card className="mb-4">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search crops by name..."
                className="pl-9 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[220px] bg-white">
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
        </CardContent>
      </Card>

      {/* Table Section */}
      <div className="space-y-8 pb-10">
        {selectedMarket === "all" ? (
          // Grouped Multi-Table View
          groupedData.map((group: any) => (
            <div key={group.marketId} className="space-y-4">
              <div className="flex items-center gap-2 px-2 text-primary font-bold text-lg uppercase tracking-wider">
                <MapPin className="h-4 w-4" />
                {group.marketName}
              </div>
              <Card>
                <CardContent className="pt-6">
                  <MarketPriceTable
                    data={group.items}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                    onRowClick={(cropId, marketId) =>
                      navigate(
                        `/${user?.role}/crop-price-history?cropId=${cropId}&marketId=${marketId}`,
                      )
                    }
                  />
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          // Single Selected Market View
          <div className="space-y-4">
            {processedData.length > 0 && (
              <div className="flex items-center gap-2 px-2 text-primary font-bold text-lg uppercase tracking-wider">
                <MapPin className="h-4 w-4" />
                {processedData[0]?.marketName}
              </div>
            )}
            <Card>
              <CardContent className="pt-6">
                <MarketPriceTable
                  data={processedData}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  onRowClick={(cropId, marketId) =>
                    navigate(
                      `/${user?.role}/crop-price-history?cropId=${cropId}&marketId=${marketId}`,
                    )
                  }
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarketDashboard;