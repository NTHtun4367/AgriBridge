import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetAllMarketsQuery,
  useCreateMarketMutation,
  useDeleteMarketMutation,
} from "@/store/slices/marketApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, Loader2, PlusCircle, Store, MapPin } from "lucide-react";

/* ---------------- Schema ---------------- */
// Based on your Mongoose Market Schema
const marketSchema = z.object({
  name: z.string().min(2, "Market name must be at least 2 characters"),
  region: z.string().min(2, "Region is required"),
});

type MarketFormValues = z.infer<typeof marketSchema>;

export default function MarketPlaceManagement() {
  // 1. RTK Query Hooks
  const {
    data: markets = [],
    isLoading,
    isFetching,
  } = useGetAllMarketsQuery(undefined);

  const [createMarket, { isLoading: isCreating }] = useCreateMarketMutation();
  const [deleteMarket, { isLoading: isDeleting }] = useDeleteMarketMutation();

  // 2. Form Setup
  const form = useForm<MarketFormValues>({
    resolver: zodResolver(marketSchema),
    defaultValues: {
      name: "",
      region: "",
    },
  });

  // 3. Handlers
  async function handleAdd(values: MarketFormValues) {
    try {
      await createMarket(values).unwrap();
      toast.success("Market location added successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to add market. Please try again.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteMarket(id).unwrap();
      toast.success("Market removed successfully");
    } catch (error) {
      toast.error("Failed to delete market");
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Market Directory
          </h1>
          <p className="text-muted-foreground">
            Register and manage trading locations and regional hubs.
          </p>
        </div>
        {isFetching && (
          <Badge variant="secondary" className="animate-pulse">
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Updating...
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Form */}
        <div className="lg:col-span-4">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                Add New Market
              </CardTitle>
              <CardDescription>
                Define a new trading location for price tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAdd)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Market Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Bayint Naung Market"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region / State</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              placeholder="e.g. Yangon"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Store className="mr-2 h-4 w-4" />
                    )}
                    {isCreating ? "Saving..." : "Create Market"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Table */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Active Markets</CardTitle>
              <CardDescription>
                Overview of all registered markets in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[45%]">Market Name</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right px-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell
                            colSpan={4}
                            className="h-16 animate-pulse bg-muted/20"
                          />
                        </TableRow>
                      ))
                    ) : markets.length > 0 ? (
                      markets.map((market: any) => (
                        <TableRow
                          key={market._id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <TableCell className="font-semibold">
                            {market.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {market.region}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                market.isActive ? "default" : "secondary"
                              }
                              className="bg-green-100 text-green-700 hover:bg-green-100 border-none"
                            >
                              {market.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right px-6">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              disabled={isDeleting}
                              onClick={() => handleDelete(market._id)}
                            >
                              <Trash2 size={18} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-32 text-center text-muted-foreground"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Store className="h-8 w-8 opacity-20" />
                            <p>No markets found. Add one to get started.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
