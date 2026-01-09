import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface MerchantMarketPriceTableProps {
  data: any[];
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" | null };
  //   onRowClick: (cropId: string, marketId: string) => void;
}

export function MerchantMarketPriceTable({
  data,
  onSort,
  sortConfig,
}: //   onRowClick,
MerchantMarketPriceTableProps) {
  // Helper to render the correct icon based on sort state
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="ml-2 h-3 w-3 inline opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-2 h-3 w-3 inline text-primary" />
    ) : (
      <ArrowDown className="ml-2 h-3 w-3 inline text-primary" />
    );
  };

  return (
    <Table>
      <TableCaption className="italic">
        * Prices listed are per standard unit (e.g., Viss, Basket) as defined by
        local trading standards.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead
            className="w-[150px] font-bold py-4 cursor-pointer select-none"
            onClick={() => onSort("cropName")}
          >
            Crop Name {getSortIcon("cropName")}
          </TableHead>
          <TableHead
            className="text-center font-bold py-4 cursor-pointer select-none"
            onClick={() => onSort("category")}
          >
            Category {getSortIcon("category")}
          </TableHead>
          <TableHead className="text-center font-bold py-4">Unit</TableHead>
          {/* <TableHead
            className="text-center font-bold py-4 cursor-pointer select-none"
            onClick={() => onSort("previousPrice")}
          >
            Previous Price {getSortIcon("previousPrice")}
          </TableHead> */}
          <TableHead
            className="text-center font-bold py-4 cursor-pointer select-none"
            onClick={() => onSort("currentPrice")}
          >
            Buying Price {getSortIcon("currentPrice")}
          </TableHead>
          {/* <TableHead className="text-right font-bold py-4">Changes</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((market) => (
            <TableRow
              key={market.cropId}
              className="cursor-pointer hover:bg-slate-50/50 transition-colors"
              //   onClick={() => onRowClick(market.cropId, market.marketId)}
            >
              <TableCell className="font-medium">{market.cropName}</TableCell>
              <TableCell className="text-center font-medium">
                {market.category}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline">{market.unit}</Badge>
              </TableCell>
              {/* <TableCell className="text-center font-bold italic text-slate-500">
                {market.previousPrice.toLocaleString()} MMK
              </TableCell> */}
              <TableCell className="text-center font-bold">
                {market.currentPrice.toLocaleString()} MMK
              </TableCell>
              {/* <TableCell
                className={`text-right font-bold italic ${
                  market.priceChange < 0 ? "text-destructive" : "text-green-600"
                }`}
              >
                {market.priceChange > 0
                  ? `+${market.priceChange}`
                  : market.priceChange}{" "}
                MMK
              </TableCell> */}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={6}
              className="h-24 text-center text-muted-foreground"
            >
              No results found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
