import { useState, useMemo } from "react";
import { Search, Inbox } from "lucide-react";
import ActivityTitle from "@/components/farmer/ActivityTitle";
import { useGetAllEntriesQuery } from "@/store/slices/farmerApi";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Helper to match seasons
const generateFilterSeasons = () => {
  const currentYear = new Date().getFullYear();
  const names = ["Summer", "Monsoon", "Winter"];
  const years = [currentYear - 1, currentYear, currentYear + 1];
  const options: string[] = [];
  years.forEach((y) => names.forEach((n) => options.push(`${n} ${y}`)));
  return options;
};

function Records() {
  const { data: entries, isLoading } = useGetAllEntriesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");

  const seasonOptions = useMemo(() => generateFilterSeasons(), []);

  // Advanced Filtering Logic
  const filteredEntries = useMemo(() => {
    if (!entries) return [];

    return entries.filter((en: any) => {
      const matchesSearch =
        en.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        en.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || en.type === selectedType;
      const matchesSeason =
        selectedSeason === "all" || en.season === selectedSeason;

      return matchesSearch && matchesType && matchesSeason;
    });
  }, [entries, searchTerm, selectedType, selectedSeason]);

  return (
    <div className="w-full min-h-screen p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tight">
            Farm Records
          </h2>
          <p className="text-slate-500 font-medium">
            History of all your agricultural transactions
          </p>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
          {/* Search Bar */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by category or notes..."
              className="pl-10 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income Only</SelectItem>
              <SelectItem value="expense">Expenses Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Season Filter */}
          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Season" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Seasons</SelectItem>
              {seasonOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Records Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {isLoading ? (
            <div className="col-span-full py-20 text-center font-bold text-slate-400">
              Loading your history...
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="col-span-full py-24 flex flex-col items-center justify-center bg-secondary rounded-3xl border-2 border-dashed border-slate-200">
              <div className="p-4 bg-slate-50 rounded-full mb-4">
                <Inbox className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-slate-500 font-bold text-lg">
                No records found
              </p>
              <p className="text-slate-400 text-sm">
                Try adjusting your filters or search terms.
              </p>
              <Button
                variant="link"
                className="mt-2 text-primary"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("all");
                  setSelectedSeason("all");
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            filteredEntries.map((en: any) => (
              <div
                key={en._id}
                className="transition-all hover:-translate-y-0.5"
              >
                <ActivityTitle
                  id={en._id}
                  title={en.category}
                  cat={en.type}
                  amount={en.value}
                  type={en.type}
                  date={en.date} // Actual entry date
                  season={en.season} // Multi-year season
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Records;
