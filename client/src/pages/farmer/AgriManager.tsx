import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router"; // Added for navigation
import {
  Plus,
  Trash2,
  Save,
  Power,
  Table as TableIcon,
  Database,
  Sprout,
  MapPin,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useStartSeasonMutation,
  useRegisterCropsBulkMutation,
  useGetCropsQuery,
  useEndSeasonMutation,
  useGetActiveSeasonQuery,
} from "@/store/slices/farmerApi";
import { useGetAllCropsQuery } from "@/store/slices/marketApi";

const SEASONS = ["Summer 2026", "Rainy 2026", "Winter 2026", "Summer 2027"];

export const AgricultureManager = () => {
  const navigate = useNavigate();
  const [selectedName, setSelectedName] = useState("");
  const [activeSeason, setActiveSeason] = useState<any>(null);
  const [rows, setRows] = useState([
    { category: "", cropName: "", variety: "", areaSize: "" },
  ]);

  const { data: currentActiveData, isLoading: isLoadingActive } =
    useGetActiveSeasonQuery();
  const { data: masterCrops = [] } = useGetAllCropsQuery(undefined);

  const [startSeason] = useStartSeasonMutation();
  const [bulkRegister] = useRegisterCropsBulkMutation();
  const [endSeason] = useEndSeasonMutation();

  const { data: savedCrops, refetch: refetchSavedCrops } = useGetCropsQuery(
    activeSeason?._id,
    { skip: !activeSeason?._id },
  );

  const categories = useMemo(() => {
    const unique = new Set(masterCrops.map((c: any) => c.category));
    return Array.from(unique);
  }, [masterCrops]);

  useEffect(() => {
    if (currentActiveData) setActiveSeason(currentActiveData);
  }, [currentActiveData]);

  const handleStart = async () => {
    try {
      const res = await startSeason(selectedName).unwrap();
      setActiveSeason(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegister = async () => {
    try {
      await bulkRegister({
        seasonId: activeSeason._id,
        crops: rows.filter((r) => r.cropName && r.areaSize),
      }).unwrap();
      setRows([{ category: "", cropName: "", variety: "", areaSize: "" }]);
      refetchSavedCrops();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEnd = async () => {
    if (!window.confirm("End this season? AI will generate a final report."))
      return;
    try {
      const seasonName = activeSeason.name;
      await endSeason(activeSeason._id).unwrap();
      setActiveSeason(null);
      // POWER MOVE: Redirect to AI Analysis after ending season
      navigate("/farmer/reports", { state: { autoAnalyze: seasonName } });
    } catch (e) {
      console.error(e);
    }
  };

  const updateRow = (idx: number, field: string, val: string) => {
    const newRows = [...rows];
    (newRows[idx] as any)[field] = val;
    if (field === "category") newRows[idx].cropName = "";
    setRows(newRows);
  };

  const totalAcres =
    savedCrops?.reduce((acc: number, c: any) => acc + Number(c.areaSize), 0) ||
    0;
  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString() : "N/A";

  if (isLoadingActive)
    return (
      <div className="h-screen flex items-center justify-center">
        <Sprout className="animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-30 px-6 h-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg text-white">
            <Sprout size={24} />
          </div>
          <h1 className="text-xl font-bold">AgriOps Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          {!activeSeason ? (
            <div className="flex gap-2">
              <Select onValueChange={setSelectedName}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Select Cycle" />
                </SelectTrigger>
                <SelectContent>
                  {SEASONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleStart}
                disabled={!selectedName}
                className="bg-slate-900"
              >
                Initialize
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                Live: {activeSeason.name}
              </Badge>
              <Button onClick={handleEnd} variant="destructive" size="sm">
                <Power size={16} className="mr-2" /> Close Cycle
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Analytics Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Area"
            value={`${totalAcres} Acres`}
            icon={MapPin}
            color="text-blue-600"
          />
          <StatCard
            label="Registered Crops"
            value={savedCrops?.length || 0}
            icon={Database}
            color="text-emerald-600"
          />
          <StatCard
            label="Start Date"
            value={
              activeSeason
                ? formatDate(activeSeason.createdAt)
                : "No Active Cycle"
            }
            icon={Calendar}
            color="text-purple-600"
          />
          <StatCard
            label="Status"
            value={activeSeason ? "Active" : "Idle"}
            icon={TableIcon}
            color="text-slate-400"
          />
        </div>

        {activeSeason ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Worksheet */}
            <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Seasonal Worksheet
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setRows([
                      ...rows,
                      { category: "", cropName: "", variety: "", areaSize: "" },
                    ])
                  }
                >
                  <Plus size={14} className="mr-1" /> Add Row
                </Button>
              </div>
              <table className="w-full">
                <thead className="text-left text-[10px] uppercase text-slate-400 bg-slate-50/50">
                  <tr>
                    <th className="p-4 w-12">#</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Variety</th>
                    <th className="p-4">Acres</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((row, idx) => (
                    <tr key={idx}>
                      <td className="p-4 font-bold text-slate-300">
                        {idx + 1}
                      </td>
                      <td className="p-4">
                        <Select
                          value={row.category}
                          onValueChange={(v) => updateRow(idx, "category", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c: any) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <Select
                          value={row.cropName}
                          onValueChange={(v) => updateRow(idx, "cropName", v)}
                          disabled={!row.category}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Variety" />
                          </SelectTrigger>
                          <SelectContent>
                            {masterCrops
                              .filter((c: any) => c.category === row.category)
                              .map((v: any) => (
                                <SelectItem key={v._id} value={v.name}>
                                  {v.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <Input
                          type="number"
                          value={row.areaSize}
                          onChange={(e) =>
                            updateRow(idx, "areaSize", e.target.value)
                          }
                          placeholder="0.0"
                          className="font-mono font-bold"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setRows(rows.filter((_, i) => i !== idx))
                          }
                          disabled={rows.length === 1}
                        >
                          <Trash2
                            size={16}
                            className="text-slate-300 hover:text-red-500"
                          />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t bg-slate-50/30 flex justify-end">
                <Button
                  onClick={handleRegister}
                  className="bg-emerald-600 hover:bg-emerald-700 px-8"
                >
                  <Save size={16} className="mr-2" /> Save Assets
                </Button>
              </div>
            </div>

            {/* Live Crop List */}
            <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                <h2 className="text-xs font-bold uppercase tracking-widest">
                  Active Land Utilization
                </h2>
                <Badge className="bg-emerald-500">
                  {totalAcres} Total Acres
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 gap-4">
                {savedCrops?.map((c: any) => (
                  <div
                    key={c._id}
                    className="p-4 border-2 border-slate-100 rounded-xl flex justify-between items-center group hover:border-emerald-200 transition-all"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        {c.variety || "Variety"}
                      </p>
                      <p className="text-lg font-black text-slate-800">
                        {c.cropName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-emerald-600">
                        {c.areaSize}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        Acres
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[400px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-10 bg-white">
            <div className="bg-slate-50 p-6 rounded-full mb-4 text-slate-200">
              <TableIcon size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-800">
              No Active Cycle
            </h2>
            <p className="text-slate-500 max-w-sm mb-6">
              Initialize a new season cycle to start tracking land allocation
              and crop performance.
            </p>
            <div className="flex items-center gap-2 text-slate-300 font-bold uppercase text-[10px] tracking-widest">
              Select Season Above <ArrowRight size={14} /> Start
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white border p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-xl bg-slate-50 ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

const Badge = ({ children, className }: any) => (
  <span
    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${className}`}
  >
    {children}
  </span>
);
