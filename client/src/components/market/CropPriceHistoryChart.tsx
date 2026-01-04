import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import { format, isValid } from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Configuration for the shadcn/ui chart wrapper
const chartConfig = {
  price: {
    label: "Market Price",
    color: "hsl(var(--primary))", // Using CSS variable for theme consistency
  },
} satisfies ChartConfig;

interface DataPoint {
  date: string | Date;
  price: number;
}

interface ChartProps {
  data: DataPoint[];
}

export function CropPriceHistoryChart({ data }: ChartProps) {
  // 1. Process and sort data chronologically
  const formattedData = useMemo(() => {
    return [...data]
      .map((item) => ({
        ...item,
        price: Number(item.price),
        // Ensure the date object is valid for Recharts
        timestamp: new Date(item.date).getTime(),
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [data]);

  // 2. Formatter for currency (MMK)
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    compactDisplay: "short",
    notation: "standard",
  });

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ left: 30, right: 20, top: 30, bottom: 20 }}
        >
          {/* Background Grid */}
          <CartesianGrid 
            vertical={false} 
            strokeDasharray="3 3" 
            className="stroke-slate-200" 
          />

          {/* X-Axis: Dates */}
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value);
              return isValid(date) ? format(date, "MMM dd") : "";
            }}
            className="text-xs font-medium text-muted-foreground"
          />

          {/* Y-Axis: Price in MMK */}
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            domain={["auto", "auto"]}
            tickFormatter={(value) => currencyFormatter.format(value)}
            className="text-xs font-medium text-muted-foreground"
          >
            <Label
              value="Price (MMK)"
              angle={-90}
              position="insideLeft"
              offset={-20}
              style={{
                textAnchor: "middle",
                fill: "hsl(var(--muted-foreground))",
                fontSize: "12px",
                fontWeight: 600,
              }}
            />
          </YAxis>

          {/* Tooltip: Shows on Hover */}
          <ChartTooltip
            cursor={{ 
                stroke: "hsl(var(--primary))", 
                strokeWidth: 1.5, 
                strokeDasharray: "5 5" 
            }}
            content={
              <ChartTooltipContent 
                labelFormatter={(value) => {
                  return format(new Date(value), "MMMM dd, yyyy");
                }}
              />
            }
          />

          {/* The Actual Line */}
          <Line
            dataKey="price"
            type="linear" // Smoother curve
            stroke="#6EAE19" // Your brand primary color
            strokeWidth={2.5}
            dot={{
              r: 4,
              fill: "#6EAE19",
              strokeWidth: 2,
              stroke: "#fff",
            }}
            activeDot={{
              r: 6,
              fill: "#6EAE19",
              stroke: "#fff",
              strokeWidth: 2,
              className: "shadow-lg"
            }}
            connectNulls={true}
            animationDuration={1200}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default CropPriceHistoryChart;