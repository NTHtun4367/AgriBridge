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
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navigation from "@/common/home/Navigation";
import Footer from "@/common/home/Footer";
import { useNavigate } from "react-router";

function MarketPriceLanding() {
  const { data: response } = useGetLatestPricesQuery();
  const navigate = useNavigate();

  const marketPricesData = response?.data;

  return (
    <div>
      <Navigation />
      <header className="relative overflow-hidden pt-32 pb-16 animate-in slide-in-from-bottom-15 duration-1000">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-primary">
            Today's <br />
            <span className="text-primary">Market Prices</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Real-time updates of the latest market prices, accurately reflected
            for your convenience.
          </p>
        </div>
        <div className="relative mt-16 w-xl mx-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search crops..."
            className="pl-9"
            //   value={searchTerm}
            //   onChange={(e: ChangeEvent<HTMLInputElement>) =>
            //     setSearchTerm(e.target.value)
            //   }
          />
        </div>
      </header>
      <div className="max-w-6xl mx-auto mb-32 animate-in slide-in-from-bottom-15 duration-1000">
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
                  <TableHead className="text-center font-bold py-4">
                    Previous Price
                  </TableHead>
                  <TableHead className="text-center font-bold py-4">
                    Current Price
                  </TableHead>
                  <TableHead className="text-right font-bold py-4">
                    Changes
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketPricesData?.map((market) => (
                  <TableRow
                    key={market.cropId}
                    onClick={() =>
                      navigate(
                        `/crop-price-history?cropId=${market.cropId}&marketId=${market.marketId}`
                      )
                    }
                  >
                    <TableCell className="font-medium">
                      {market.cropName}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {market.category}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={"outline"}>{market.unit}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-bold italic">
                      {market.previousPrice} MMK
                    </TableCell>
                    <TableCell className="text-center font-bold">
                      {market.currentPrice} MMK
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold italic ${
                        market.priceChange < 0
                          ? "text-destructive"
                          : "text-green-600"
                      }`}
                    >
                      {/* <TableCell
                      className="text-right"
                    > */}
                      {/* <Badge
                        variant={
                          market.priceChangePercent.toString()[0] === "-"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {`${market.priceChangePercent.toFixed(2)}%`}
                      </Badge> */}
                      {market.priceChange} MMK
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

export default MarketPriceLanding;
