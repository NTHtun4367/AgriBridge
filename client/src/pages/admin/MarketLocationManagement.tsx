import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
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
import { localizeData } from "@/utils/translator";

const marketSchema = z.object({
  name: z.string().min(2, "Market name must be at least 2 characters"),
  region: z.string().min(2, "Region is required"),
});

type MarketFormValues = z.infer<typeof marketSchema>;

export default function MarketPlaceManagement() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language as "en" | "mm") || "en";

  const {
    data: rawMarkets = [],
    isLoading,
    isFetching,
  } = useGetAllMarketsQuery(undefined);

  const [createMarket, { isLoading: isCreating }] = useCreateMarketMutation();
  const [deleteMarket, { isLoading: isDeleting }] = useDeleteMarketMutation();

  // Localize market names and regions using the shared utility
  const markets = useMemo(() => {
    return localizeData(rawMarkets, currentLang);
  }, [rawMarkets, currentLang]);

  const form = useForm<MarketFormValues>({
    resolver: zodResolver(marketSchema),
    defaultValues: {
      name: "",
      region: "",
    },
  });

  async function handleAdd(values: MarketFormValues) {
    try {
      await createMarket(values).unwrap();
      toast.success(String(t("market_mgmt.table.toast_success")));
      form.reset();
    } catch (error) {
      toast.error(String(t("market_mgmt.table.toast_error")));
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteMarket(id).unwrap();
      toast.success(String(t("market_mgmt.table.toast_delete")));
    } catch (error) {
      toast.error(String(t("market_mgmt.table.toast_error")));
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mm:leading-loose">
            {String(t("market_mgmt.title"))}
          </h1>
          <p className="text-muted-foreground mm:leading-loose">
            {String(t("market_mgmt.description"))}
          </p>
        </div>
        {isFetching && (
          <Badge variant="secondary" className="animate-pulse">
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            {String(t("market_mgmt.updating"))}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Form Card */}
        <div className="lg:col-span-4">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 mm:leading-loose">
                <PlusCircle className="h-5 w-5 text-primary" />
                {String(t("market_mgmt.add_card.title"))}
              </CardTitle>
              <CardDescription className="mm:leading-relaxed">
                {String(t("market_mgmt.add_card.description"))}
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
                        <FormLabel className="mm:leading-loose">
                          {String(t("market_mgmt.add_card.label_name"))}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={String(
                              t("market_mgmt.add_card.placeholder_name"),
                            )}
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
                        <FormLabel className="mm:leading-loose">
                          {String(t("market_mgmt.add_card.label_region"))}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              placeholder={String(
                                t("market_mgmt.add_card.placeholder_region"),
                              )}
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
                    className="w-full font-bold mm:leading-loose cursor-pointer"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Store className="h-4 w-4" />
                    )}
                    {isCreating
                      ? String(t("market_mgmt.add_card.saving_btn"))
                      : String(t("market_mgmt.add_card.submit_btn"))}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Table Card */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="mm:leading-loose">
                {String(t("market_mgmt.table.title"))}
              </CardTitle>
              <CardDescription className="mm:leading-relaxed">
                {String(t("market_mgmt.table.description"))}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[45%] font-bold">
                        {String(t("market_mgmt.table.col_name"))}
                      </TableHead>
                      <TableHead className="font-bold">
                        {String(t("market_mgmt.table.col_region"))}
                      </TableHead>
                      <TableHead className="font-bold">
                        {String(t("market_mgmt.table.col_status"))}
                      </TableHead>
                      <TableHead className="text-right px-6 font-bold">
                        {String(t("market_mgmt.table.col_action"))}
                      </TableHead>
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
                          <TableCell className="font-semibold mm:leading-loose">
                            {market.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground mm:leading-loose">
                            {market.region}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                market.isActive ? "default" : "secondary"
                              }
                              className={`${
                                market.isActive
                                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                              } border-none mm:leading-loose`}
                            >
                              {market.isActive
                                ? String(t("market_mgmt.table.status_active"))
                                : String(
                                    t("market_mgmt.table.status_inactive"),
                                  )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right px-6">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
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
                            <p className="mm:leading-loose">
                              {String(t("market_mgmt.table.no_data"))}
                            </p>
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
