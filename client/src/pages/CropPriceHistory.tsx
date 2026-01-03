import Navigation from "@/common/home/Navigation";
import CropPriceHistoryChart from "@/components/market/CropPriceHistoryChart";
import { useGetCropPriceHistoryQuery } from "@/store/slices/marketApi";
import { useSearchParams } from "react-router";

function CropPriceHistory() {
  const [searchParams] = useSearchParams();

  const cropId = searchParams.get("cropId");
  const marketId = searchParams.get("marketId");

  // 2. Execute query only if IDs exist (skip: true prevents the call if falsey)
  const { data, isLoading } = useGetCropPriceHistoryQuery(
    { cropId: cropId || "", marketId: marketId || "" },
    { skip: !cropId || !marketId }
  );

  return (
    <div>
      <Navigation />
      <div className="max-w-4xl mx-auto mt-24 animate-in slide-in-from-bottom-15 duration-1000">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Price Trend Analysis</h2>

          {/* 3. Conditional Rendering to prevent blank/broken charts */}
          {isLoading && (
            <div className="h-[300px] w-full flex items-center justify-center bg-slate-50 animate-pulse rounded-lg">
              <p className="text-muted-foreground">
                Loading historical data...
              </p>
            </div>
          )}

          {!isLoading && data && data.length > 0 ? (
            <div className="h-[350px]">
              <CropPriceHistoryChart data={data} />
            </div>
          ) : (
            !isLoading && (
              <div className="h-[300px] w-full flex items-center justify-center border-dashed border-2 rounded-lg text-muted-foreground">
                No historical data available for this selection.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default CropPriceHistory;
