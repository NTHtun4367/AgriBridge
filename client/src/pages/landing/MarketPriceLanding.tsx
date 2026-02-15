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
import { format, isValid } from "date-fns";
import { useTranslation } from "react-i18next";
import { localizeData, toMyanmarNumerals } from "@/utils/translator";
import type { Market } from "@/types/market";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

function MarketPriceLanding() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  const { lang } = useSelector((state: RootState) => state.settings);

  // 1. Date Localization with Safety Check
  const todayDate = useMemo(() => {
    const now = new Date();
    if (!isValid(now)) return ""; // Safety fallback
    const d = format(now, "dd-MM-yyyy");
    return lang === "mm" ? toMyanmarNumerals(d) : d;
  }, [lang]);

  // 2. API Queries
  const { data: tempResponse } = useGetMarketPricesQuery({
    official: true,
    marketId: selectedMarket === "all" ? undefined : selectedMarket,
  });

  const { data: tempMarkets = [] } = useGetAllMarketsQuery(undefined);

  // 3. Data Localization
  const response = useMemo(() => {
    return localizeData(tempResponse, lang);
  }, [tempResponse, lang]);

  const markets = useMemo(() => {
    return localizeData(tempMarkets, lang);
  }, [tempMarkets, lang]);

  const rawData = useMemo(() => response?.data || [], [response]);

  // 4. Filter Options
  const categoryOptions = useMemo(() => {
    const unique = Array.from(
      new Set(rawData.map((item: any) => item.category)),
    ) as string[];
    return ["all", ...unique];
  }, [rawData]);

  // 5. Search & Sort Logic
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

  // 6. Grouping Logic
  const groupedData = useMemo(() => {
    if (selectedMarket !== "all") return [];
    return (markets as Market[])
      .map((m) => ({
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
              <h1 className="text-5xl mm:text-[55px] font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-primary mm:pb-2">
                <span className="block mm:pb-8">{t("market.hero.today")}</span>
                <span className="text-primary">{t("market.hero.title")}</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 mm:leading-loose">
                {t("market.hero.subtitle")}
              </p>
            </div>
          </div>

          <div className="relative mt-16 max-w-4xl mx-auto px-6 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("market.filters.search_placeholder")}
                  className="pl-9 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-white mm:leading-loose">
                  <SelectValue
                    placeholder={t("market.filters.all_categories")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? t("market.filters.all_categories") : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col items-center gap-3">
              <span className="text-sm font-medium text-slate-500">
                {t("market.filters.filter_by_market")}
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
                  {t("market.filters.all_markets")}
                </button>
                {(markets as Market[]).map((m) => (
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

      <Footer />
    </div>
  );
}

export default MarketPriceLanding;
