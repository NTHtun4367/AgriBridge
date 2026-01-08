import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
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
import { useGetMarketPricesQuery } from "@/store/slices/marketApi";

function MarketDashboard() {
  const { data: response } = useGetMarketPricesQuery({ official: true });

  const navigate = useNavigate();

  // --- Search, Filter & Sort States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "cropName", // Default sort
    direction: "asc",
  });

  const rawData = response?.data || [];

  // Generate unique categories for the dropdown
  const categoryOptions = useMemo(() => {
    const unique = Array.from(
      new Set(rawData.map((item: any) => item.category))
    );
    return ["all", ...unique];
  }, [rawData]);

  // Combined logic: Search -> Category Filter -> Sort
  const processedData = useMemo(() => {
    let filtered = [...rawData];

    // 1. Search filter
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.cropName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // 3. Sorting logic
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
  }, [rawData, searchTerm, selectedCategory, sortConfig]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-secondary w-full h-screen p-4">
      <h2 className="text-2xl font-bold">Market Prices</h2>
      <p className="text-muted-foreground mb-8 mt-2">
        Real-time updates of the latest market prices.
      </p>

      {/* Combined Search and Select Filter */}
      <Card className="mb-4">
        <CardContent>
          <div className="relative flex gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search crops..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[220px]">
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

      <Card>
        <CardContent className="pt-6">
          <MarketPriceTable
            data={processedData}
            onSort={handleSort}
            sortConfig={sortConfig}
            onRowClick={(cropId, marketId) =>
              navigate(
                `/farmer/crop-price-history?cropId=${cropId}&marketId=${marketId}`
              )
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default MarketDashboard;
