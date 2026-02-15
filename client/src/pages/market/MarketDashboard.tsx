import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";
import { localizeData, toMyanmarNumerals } from "@/utils/translator";
import { type RootState } from "@/store";

function MarketDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Get current language from Redux state
  const { lang } = useSelector((state: RootState) => state.settings);

  // --- Search, Filter & Sort States ---
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

  // --- API Calls ---
  // Fetch markets and prices
  const { data: rawMarkets = [] } = useGetAllMarketsQuery(undefined);
  const { data: rawResponse } = useGetMarketPricesQuery({
    official: true,
    // When "all" is selected, we pass undefined to fetch everything
    marketId: selectedMarket === "all" ? undefined : selectedMarket,
  });

  // --- Localization Logic ---
  // Localize market list for the tags/buttons
  const localizedMarkets = useMemo(
    () => localizeData(rawMarkets, lang),
    [rawMarkets, lang],
  );

  console.log(localizedMarkets);

  // Localize the actual price data
  const localizedResponse = useMemo(
    () => localizeData(rawResponse, lang),
    [rawResponse, lang],
  );

  const rawData = useMemo(
    () => localizedResponse?.data || [],
    [localizedResponse],
  );

  // --- Date Logic ---
  const todayDate = useMemo(() => {
    const now = new Date();
    if (!isValid(now)) return "";
    const d = format(now, "dd-MM-yyyy");
    return lang === "mm" ? toMyanmarNumerals(d) : d;
  }, [lang]);

  // --- Filter Options ---
  const categoryOptions = useMemo<string[]>(() => {
    const unique = Array.from(
      new Set(rawData.map((item: any) => item.category as string)),
    );
    return ["all", ...unique] as string[];
  }, [rawData]);

  // --- Processing Logic (Search, Category, Market, Sort) ---
  const processedData = useMemo(() => {
    let filtered = [...rawData];

    if (searchTerm) {
      filtered = filtered.filter((item: any) =>
        item.cropName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (item: any) => item.category === selectedCategory,
      );
    }

    // Direct ID filtering to ensure Yangon/Mandalay switch correctly
    if (selectedMarket !== "all") {
      filtered = filtered.filter(
        (item: any) => item.marketId === selectedMarket,
      );
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

  // --- Grouping Logic for "All Markets" View ---
  const groupedData = useMemo(() => {
    if (selectedMarket !== "all") return [];
    return localizedMarkets
      .map((m: any) => ({
        marketName: m.name,
        marketId: m._id,
        items: processedData.filter((item: any) => item.marketId === m._id),
      }))
      .filter((group: any) => group.items.length > 0);
  }, [processedData, selectedMarket, localizedMarkets]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="w-full h-screen p-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">{t("market_dashboard.title")}</h2>
          <p className="text-muted-foreground mt-2">
            {t("market_dashboard.subtitle")}
          </p>
        </div>
      </div>

      {/* Market Selection Tags */}
      <div className="mb-8">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
          {t("market_dashboard.filter_market")}
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
            {t("market_dashboard.all_markets")}
          </button>
          {localizedMarkets.map((m: any) => (
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

      {/* Search and Category Card */}
      <Card className="mb-4">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("market_dashboard.search_placeholder")}
                className="pl-9 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[220px] bg-white mm:leading-loose">
                <SelectValue
                  placeholder={t("market_dashboard.all_categories")}
                />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((cat: string) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? t("market_dashboard.all_categories") : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <main className="max-w-6xl mx-auto mt-12">
        {selectedMarket === "all" ? (
          <div className="space-y-20">
            {groupedData.map((group: any) => (
              <div key={group.marketId} className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg mm:mb-3">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl text-primary font-semibold uppercase tracking-tight mm:leading-loose">
                        {group.marketName}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium mm:leading-loose">
                        {t("market.table.market_as_of", {
                          marketName: group.marketName,
                          date: todayDate,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 font-medium italic">
                    {t("market.table.crops_found", {
                      count: group.items.length,
                      displayCount:
                        lang === "mm"
                          ? toMyanmarNumerals(group.items.length)
                          : group.items.length,
                    })}
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
                    {t("market.table.market_as_of", {
                      marketName: processedData[0]?.marketName || "",
                      date: todayDate,
                    })}
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
    </div>
  );
}

export default MarketDashboard;
