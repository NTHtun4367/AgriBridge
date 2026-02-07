import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BrainCircuit,
  Loader2,
  History,
  Sparkles,
  Download,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  useGetAiAnalysisMutation,
  useGetSeasonalSummaryQuery,
} from "@/store/slices/reportApi";

const SeasonalReports = ({ userId }: { userId: string }) => {
  const [activeSeason, setActiveSeason] = useState<string | null>(null);
  const { data: reports, isLoading } = useGetSeasonalSummaryQuery(userId);
  const [getAiAdvice, { data: aiResponse, isLoading: isAiLoading }] =
    useGetAiAnalysisMutation();

  const handleAskAi = async (season: string) => {
    setActiveSeason(season);
    await getAiAdvice({ userId, season });
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500 h-12 w-12" />
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header Area */}
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            SEASONAL INSIGHTS
          </h1>
          <p className="text-slate-500 font-bold uppercase text-sm tracking-widest">
            Advanced Financial Intelligence
          </p>
        </div>
        <Button
          variant="outline"
          className="hidden md:flex"
          onClick={() => window.print()}
        >
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Top 3 Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports?.slice(0, 3).map((report) => (
          <Card
            key={report.season}
            className="relative overflow-hidden border-2 hover:border-slate-900 transition-all group"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-400">
                  {report.season}
                </span>
                <Badge
                  className={
                    report.netProfit >= 0 ? "bg-emerald-500" : "bg-rose-500"
                  }
                >
                  {report.netProfit >= 0 ? "SURPLUS" : "DEFICIT"}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-black">
                {report.netProfit.toLocaleString()}{" "}
                <span className="text-sm">MMK</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleAskAi(report.season)}
                disabled={isAiLoading}
                className="w-full bg-slate-100 hover:bg-slate-900 text-slate-900 hover:text-white font-bold transition-colors"
              >
                {isAiLoading && activeSeason === report.season ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <BrainCircuit className="mr-2 h-4 w-4" />
                )}
                AI Audit
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI ANALYSIS DISPLAY - "The Power Feature" */}
      {aiResponse && (
        <div className="animate-in slide-in-from-bottom-10 duration-500">
          <Card className="border-none shadow-2xl bg-slate-900 text-white overflow-hidden rounded-3xl">
            <div className="bg-linear-to-r from-indigo-600 to-emerald-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <Sparkles className="text-yellow-300 fill-yellow-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-black italic tracking-tight">
                    AI ADVISOR LOG
                  </h2>
                  <p className="text-xs font-bold text-white/70">
                    DEEP ANALYSIS FOR {activeSeason}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-white border-white/50">
                Llama-3.3 Advanced
              </Badge>
            </div>
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-white prose-strong:text-emerald-400">
                <ReactMarkdown>{aiResponse.advice}</ReactMarkdown>
              </div>
              <div className="mt-10 pt-6 border-t border-white/10 flex gap-4">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                  Data Sources: Government Market API + Farmer Input Ledger +
                  Satellite Price Trends
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* History List */}
      <Card className="rounded-2xl border-2 border-slate-100">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-slate-400" />
            Seasonal History
          </CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Season</TableHead>
              <TableHead className="font-bold">Total Income</TableHead>
              <TableHead className="font-bold">Total Expense</TableHead>
              <TableHead className="text-right font-bold">Net Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports?.map((r) => (
              <TableRow key={r.season} className="hover:bg-slate-50">
                <TableCell className="font-bold text-slate-900">
                  {r.season}
                </TableCell>
                <TableCell className="text-emerald-600 font-bold">
                  +{r.totalIncome.toLocaleString()}
                </TableCell>
                <TableCell className="text-rose-500 font-medium">
                  -{r.totalExpense.toLocaleString()}
                </TableCell>
                <TableCell
                  className={`text-right font-black ${r.netProfit >= 0 ? "text-emerald-700" : "text-rose-700"}`}
                >
                  {r.netProfit.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default SeasonalReports;
