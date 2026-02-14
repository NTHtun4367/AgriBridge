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
import { useTranslation } from "react-i18next";

interface MarketTableProps {
  data: any[];
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" | null };
  onRowClick: (cropId: string, marketId: string) => void;
}

export function MarketPriceTable({
  data,
  onSort,
  sortConfig,
  onRowClick,
}: MarketTableProps) {
  const { t, i18n } = useTranslation();
  const isMyanmar = i18n.language === "my";

  console.log("Hello from market price table");
  
  // Typography adjustment for Burmese script
  const mmLeading = isMyanmar ? "leading-loose py-2" : "leading-normal";

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
      <TableCaption className={mmLeading}>
        {t("marketTable.caption")}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead
            className={`w-[150px] font-bold py-4 cursor-pointer select-none ${mmLeading}`}
            onClick={() => onSort("cropName")}
          >
            {t("marketTable.cropName")} {getSortIcon("cropName")}
          </TableHead>
          <TableHead
            className={`text-center font-bold py-4 cursor-pointer select-none ${mmLeading}`}
            onClick={() => onSort("category")}
          >
            {t("marketTable.category")} {getSortIcon("category")}
          </TableHead>
          <TableHead
            className={`text-center font-bold py-4 cursor-pointer select-none ${mmLeading}`}
            onClick={() => onSort("amount")}
          >
            {t("marketTable.amount")} {getSortIcon("amount")}
          </TableHead>
          <TableHead className={`text-center font-bold py-4 ${mmLeading}`}>
            {t("marketTable.unit")}
          </TableHead>
          <TableHead
            className={`text-center font-bold py-4 cursor-pointer select-none ${mmLeading}`}
            onClick={() => onSort("previousPrice")}
          >
            {t("marketTable.previousPrice")} {getSortIcon("previousPrice")}
          </TableHead>
          <TableHead
            className={`text-center font-bold py-4 cursor-pointer select-none ${mmLeading}`}
            onClick={() => onSort("currentPrice")}
          >
            {t("marketTable.currentPrice")} {getSortIcon("currentPrice")}
          </TableHead>
          <TableHead className={`text-right font-bold py-4 ${mmLeading}`}>
            {t("marketTable.changes")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((market: any) => (
            <TableRow
              key={market.cropId}
              className="cursor-pointer hover:bg-slate-50/50 transition-colors"
              onClick={() => onRowClick(market.cropId, market.marketId)}
            >
              <TableCell className={`font-medium ${mmLeading}`}>
                {market.cropName}
              </TableCell>
              <TableCell className={`text-center font-medium ${mmLeading}`}>
                {market.category}
              </TableCell>
              <TableCell className="text-center font-medium">
                {market.amount !== undefined && market.amount !== null
                  ? market.amount.toLocaleString(i18n.language)
                  : "-"}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className={mmLeading}>
                  {market.unit}
                </Badge>
              </TableCell>
              <TableCell className="text-center font-bold italic text-slate-500 tabular-nums">
                {market.previousPrice
                  ? market.previousPrice.toLocaleString(i18n.language)
                  : "0"}{" "}
                <span className="text-[10px] ml-0.5">
                  {t("marketTable.currency")}
                </span>
              </TableCell>
              <TableCell className="text-center font-bold tabular-nums text-primary">
                {market.currentPrice.toLocaleString(i18n.language)}{" "}
                <span className="text-[10px] ml-0.5">
                  {t("marketTable.currency")}
                </span>
              </TableCell>
              <TableCell
                className={`text-right font-bold italic tabular-nums ${
                  market.priceChange < 0 ? "text-destructive" : "text-green-600"
                }`}
              >
                {market.priceChange > 0
                  ? `+${market.priceChange.toLocaleString(i18n.language)}`
                  : market.priceChange.toLocaleString(i18n.language)}{" "}
                <span className="text-[10px] ml-0.5 font-normal">
                  {t("marketTable.currency")}
                </span>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={7}
              className={`h-24 text-center text-muted-foreground ${mmLeading}`}
            >
              {t("marketTable.noResults")}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
