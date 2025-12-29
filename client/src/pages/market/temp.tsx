// // import React from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   type ChartOptions,
// } from "chart.js";
// import { Line } from "react-chartjs-2";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import {
//   TrendingUp,
//   TrendingDown,
//   Minus,
//   MapPin,
//   Calendar,
//   Clock,
// } from "lucide-react";
// import { useGetLatestPricesQuery } from "@/store/slices/marketApi";

// // Register Chart.js modules
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// // --- Mock Data ---
// const labels = ["Oct 01", "Oct 02", "Oct 03", "Oct 04", "Oct 05", "Oct 06"];

// const chartData = {
//   labels,
//   datasets: [
//     {
//       fill: true,
//       label: "Morning Price",
//       data: [40, 41, 44, 42, 45, 43],
//       borderColor: "rgb(59, 130, 246)", // Blue-500
//       backgroundColor: "rgba(59, 130, 246, 0.1)",
//       tension: 0.4,
//     },
//     {
//       fill: true,
//       label: "Evening Price",
//       data: [42, 43, 42, 45, 47, 46],
//       borderColor: "rgb(16, 185, 129)", // Emerald-500
//       backgroundColor: "rgba(16, 185, 129, 0.1)",
//       tension: 0.4,
//     },
//   ],
// };

// const chartOptions: ChartOptions<"line"> = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       position: "top" as const,
//       align: "end",
//       labels: {
//         usePointStyle: true,
//         boxWidth: 6,
//         font: { size: 12, weight: "bold" },
//       },
//     },
//     tooltip: {
//       padding: 12,
//       backgroundColor: "#ffffff",
//       titleColor: "#1e293b",
//       bodyColor: "#64748b",
//       borderColor: "#e2e8f0",
//       borderWidth: 1,
//       displayColors: true,
//       usePointStyle: true,
//     },
//   },
//   scales: {
//     x: { grid: { display: false } },
//     y: {
//       grid: { color: "#f1f5f9" },
//       border: { dash: [4, 4] },
//       ticks: { callback: (value: any) => `$${value}` },
//     },
//   },
// };

// export default function MarketDashboard() {
//   const { data } = useGetLatestPricesQuery();

//   console.log(data);

//   return (
//     <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
//       <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//             Market Price Monitor
//           </h1>
//           <p className="text-muted-foreground flex items-center gap-2 mt-1">
//             <Clock className="w-4 h-4" /> Monitoring Morning & Evening
//             collection cycles
//           </p>
//         </div>
//         <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border shadow-sm w-fit">
//           <Calendar className="w-4 h-4 text-blue-500" />
//           <span className="font-semibold text-slate-700">
//             {new Date().toLocaleDateString()}
//           </span>
//         </div>
//       </header>

//       {/* Summary Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <MetricCard
//           title="Rice (Premium)"
//           price={46.0}
//           change={+2.5}
//           trend="up"
//         />
//         <MetricCard
//           title="Corn (Yellow)"
//           price={30.5}
//           change={-1.2}
//           trend="down"
//         />
//         <MetricCard title="Wheat" price={28.0} change={0} trend="stable" />
//       </div>

//       <Tabs defaultValue="trends" className="space-y-4">
//         <TabsList className="bg-white border p-1">
//           <TabsTrigger value="trends">Price Analytics</TabsTrigger>
//           <TabsTrigger value="markets">Market Distribution</TabsTrigger>
//         </TabsList>

//         <TabsContent value="trends" className="space-y-4">
//           <Card className="border-none shadow-md">
//             <CardHeader>
//               <CardTitle className="text-lg">Price Volatility Index</CardTitle>
//               <CardDescription>
//                 Visualizing the gap between daily AM and PM price points
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[400px] w-full">
//                 <Line options={chartOptions} data={chartData} />
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="markets">
//           <Card className="border-none shadow-md">
//             <CardContent className="pt-6">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-slate-50/50">
//                     <TableHead>Location</TableHead>
//                     <TableHead>Crop Type</TableHead>
//                     <TableHead>Current Price</TableHead>
//                     <TableHead>Daily Variance</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   <MarketRow
//                     market="City Hub"
//                     crop="Rice"
//                     price={45.0}
//                     change={1.2}
//                   />
//                   <MarketRow
//                     market="North Terminal"
//                     crop="Rice"
//                     price={46.2}
//                     change={-0.5}
//                   />
//                   <MarketRow
//                     market="East Market"
//                     crop="Corn"
//                     price={30.0}
//                     change={0}
//                   />
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

// // --- Sub-Components ---

// function MetricCard({
//   title,
//   price,
//   change,
//   trend,
// }: {
//   title: string;
//   price: number;
//   change: number;
//   trend: "up" | "down" | "stable";
// }) {
//   return (
//     <Card className="border-none shadow-sm overflow-hidden relative">
//       <div
//         className={`absolute top-0 left-0 w-1 h-full ${
//           trend === "up"
//             ? "bg-emerald-500"
//             : trend === "down"
//             ? "bg-rose-500"
//             : "bg-slate-300"
//         }`}
//       />
//       <CardContent className="p-6">
//         <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
//           {title}
//         </p>
//         <div className="flex items-baseline gap-2 mt-2">
//           <span className="text-3xl font-bold text-slate-900">
//             ${price.toFixed(2)}
//           </span>
//           <span className="text-xs text-slate-400 font-medium">/ kg</span>
//         </div>
//         <div
//           className={`mt-4 flex items-center gap-1 text-sm font-bold ${
//             trend === "up"
//               ? "text-emerald-600"
//               : trend === "down"
//               ? "text-rose-600"
//               : "text-slate-500"
//           }`}
//         >
//           {trend === "up" ? (
//             <TrendingUp size={16} />
//           ) : trend === "down" ? (
//             <TrendingDown size={16} />
//           ) : (
//             <Minus size={16} />
//           )}
//           {change !== 0 ? `${Math.abs(change)}% from morning` : "No change"}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function MarketRow({
//   market,
//   crop,
//   price,
//   change,
// }: {
//   market: string;
//   crop: string;
//   price: number;
//   change: number;
// }) {
//   return (
//     <TableRow>
//       <TableCell className="font-semibold">
//         <div className="flex items-center gap-2">
//           <MapPin className="w-4 h-4 text-slate-400" /> {market}
//         </div>
//       </TableCell>
//       <TableCell>{crop}</TableCell>
//       <TableCell className="font-mono font-bold">${price.toFixed(2)}</TableCell>
//       <TableCell>
//         <Badge
//           variant={
//             change > 0 ? "default" : change < 0 ? "destructive" : "secondary"
//           }
//           className="rounded-md"
//         >
//           {change > 0 ? `+${change}%` : `${change}%`}
//         </Badge>
//       </TableCell>
//     </TableRow>
//   );
// }
