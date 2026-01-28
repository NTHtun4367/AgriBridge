import React from "react";
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
import { BrainCircuit, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  useGetAiAnalysisMutation,
  useGetSeasonalSummaryQuery,
} from "@/store/slices/reportApi";

interface SeasonalReportsProps {
  userId: string;
}

const SeasonalReports = ({ userId }: SeasonalReportsProps) => {
  const { data: reports, isLoading } = useGetSeasonalSummaryQuery(userId);
  const [getAiAdvice, { data: aiResponse, isLoading: isAiLoading }] =
    useGetAiAnalysisMutation();

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Seasonal Financial Reports</h1>

      {/* Seasonal Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports?.slice(0, 3).map((report) => (
          <Card key={report.season} className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {report.season}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {report.netProfit.toLocaleString()} MMK
              </div>
              <p className="text-xs mt-1 flex items-center gap-1">
                {report.netProfit >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                Net Performance
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full text-xs"
                disabled={isAiLoading}
                onClick={() => getAiAdvice({ userId, season: report.season })}
              >
                {isAiLoading ? "Analyzing..." : "Ask AI about this Season"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Advice Section */}
      {(isAiLoading || aiResponse) && (
        <Card className="bg-slate-50 border-dashed border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <BrainCircuit className="h-5 w-5" /> AI Seasonal Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAiLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" /> Analyzing data...
              </div>
            ) : (
              <div className="prose prose-sm max-w-none prose-blue">
                <ReactMarkdown>{aiResponse?.advice || ""}</ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Seasonal Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Season</TableHead>
                <TableHead>Total Income</TableHead>
                <TableHead>Total Expense</TableHead>
                <TableHead className="text-right">Profit/Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports?.map((r) => (
                <TableRow key={r.season}>
                  <TableCell className="font-medium">{r.season}</TableCell>
                  <TableCell className="text-green-600">
                    {r.totalIncome.toLocaleString()} MMK
                  </TableCell>
                  <TableCell className="text-red-600">
                    {r.totalExpense.toLocaleString()} MMK
                  </TableCell>
                  <TableCell
                    className={`text-right font-bold ${
                      r.netProfit >= 0 ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {r.netProfit.toLocaleString()} MMK
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeasonalReports;
