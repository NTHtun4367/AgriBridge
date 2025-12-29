import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetLatestPricesQuery } from "@/store/slices/marketApi";

function MarketDashboard() {
  const { data: response } = useGetLatestPricesQuery();

  const marketPricesData = response?.data;
  console.log(marketPricesData);

  return (
    <div className="bg-secondary w-full h-screen p-4">
      <h2 className="text-2xl font-bold">Market Prices</h2>
      <p className="text-muted-foreground mb-8 mt-2">
        Real-time updates of the latest market prices.
      </p>
      <Card>
        <CardContent>
          <Table>
            <TableCaption>A list of all merket prices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] font-bold py-4">
                  Crop Name
                </TableHead>
                <TableHead className="text-center font-bold py-4">
                  Category
                </TableHead>
                <TableHead className="text-center font-bold py-4">
                  Unit
                </TableHead>
                <TableHead className="w-[100px] text-center font-bold py-4">
                  Current Price
                </TableHead>
                <TableHead className="text-right font-bold py-4">
                  Changes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketPricesData?.map((market) => (
                <TableRow key={market.cropId}>
                  <TableCell className="font-medium">
                    {market.cropName}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {market.category}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={"outline"}>{market.unit}</Badge>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {market.price} MMK
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        market.priceChangePercent.toString()[0] === "-"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {`${market.priceChangePercent.toFixed(2)}%`}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default MarketDashboard;
