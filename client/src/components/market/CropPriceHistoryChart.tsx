import { CartesianGrid, Line, LineChart, XAxis, YAxis, Label } from "recharts";
import { format, isValid } from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  price: {
    label: "Price",
    color: "#6EAE19",
  },
} satisfies ChartConfig;

interface DataPoint {
  date: string | Date;
  price: number;
}

function CropPriceHistoryChart({ data }: { data: DataPoint[] }) {
  const formattedData = [...data]
    .map((item) => ({
      ...item,
      price: Number(item.price),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <LineChart
        data={formattedData}
        // Increased left margin to make room for the vertical label
        margin={{ left: 40, right: 20, top: 30, bottom: 20 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />

        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={12}
          interval="preserveStartEnd"
          tickFormatter={(value) => {
            const date = new Date(value);
            return isValid(date) ? format(date, "MMM dd") : "";
          }}
        />

        <YAxis
          // Remove 'hide' to show the axis scale
          tickLine={false}
          axisLine={false}
          tickMargin={15}
          domain={["auto", "auto"]}
          tickFormatter={(value) => `${value} MMK`}
        >
          {/* Added Vertical Label */}
          <Label
            value="Price (Amount)"
            angle={-90}
            position="insideLeft"
            offset={-10}
            style={{
              textAnchor: "middle",
              fill: "hsl(var(--muted-foreground))",
              fontSize: "12px",
              fontWeight: 500,
            }}
          />
        </YAxis>

        <ChartTooltip
          cursor={{ stroke: "#6EAE19", strokeWidth: 1, strokeDasharray: "4 4" }}
          content={<ChartTooltipContent hideLabel />}
        />

        <Line
          dataKey="price"
          type="linear"
          stroke="#6EAE19"
          strokeWidth={1.5} // Thin line
          dot={{
            r: 3,
            fill: "#6EAE19",
            strokeWidth: 1,
            stroke: "#fff",
          }}
          activeDot={{
            r: 5,
            fill: "#6EAE19",
            stroke: "#fff",
            strokeWidth: 2,
          }}
          connectNulls={true}
          isAnimationActive={true}
          animationDuration={1500}
        />
      </LineChart>
    </ChartContainer>
  );
}

export default CropPriceHistoryChart;
