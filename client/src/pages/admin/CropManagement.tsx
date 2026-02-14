import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import * as z from "zod";
import {
  useGetAllCropsQuery,
  useCreateCropMutation,
  useDeleteCropMutation,
} from "@/store/slices/marketApi";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Trash2, Loader2, PlusCircle, Leaf } from "lucide-react";

const cropSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.enum(["rice", "beans"]),
});

type CropFormValues = z.infer<typeof cropSchema>;

export default function CropManagement() {
  const { t } = useTranslation();
  const {
    data: crops = [],
    isLoading,
    isFetching,
  } = useGetAllCropsQuery(undefined);
  const [createCrop, { isLoading: isCreating }] = useCreateCropMutation();
  const [deleteCrop, { isLoading: isDeleting }] = useDeleteCropMutation();

  const form = useForm<CropFormValues>({
    resolver: zodResolver(cropSchema),
    defaultValues: {
      name: "",
      category: "rice",
    },
  });

  async function handleAdd(values: CropFormValues) {
    try {
      await createCrop(values).unwrap();
      toast.success(t("crop_mgmt.table.toast_success"));
      form.reset();
    } catch (error) {
      toast.error(t("crop_mgmt.table.toast_error"));
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCrop(id).unwrap();
      toast.success(t("crop_mgmt.table.toast_delete"));
    } catch (error) {
      toast.error(t("crop_mgmt.table.toast_error"));
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mm:leading-loose">
            {t("crop_mgmt.title")}
          </h1>
          <p className="text-muted-foreground mm:leading-loose">{t("crop_mgmt.description")}</p>
        </div>
        {isFetching && (
          <Badge variant="secondary" className="animate-pulse">
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            {t("crop_mgmt.syncing")}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Form */}
        <div className="lg:col-span-4">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 mm:leading-loose">
                <PlusCircle className="h-5 w-5 text-primary" />
                {t("crop_mgmt.add_card.title")}
              </CardTitle>
              <CardDescription>
                {t("crop_mgmt.add_card.description")}
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
                        <FormLabel>
                          {t("crop_mgmt.add_card.label_name")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "crop_mgmt.add_card.placeholder_name",
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("crop_mgmt.add_card.label_category")}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={t(
                                  "crop_mgmt.add_card.placeholder_category",
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="rice">
                              {t("crop_mgmt.categories.rice")}
                            </SelectItem>
                            <SelectItem value="beans">
                              {t("crop_mgmt.categories.beans")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
                      <Leaf className="mr-2 h-4 w-4" />
                    )}
                    {isCreating
                      ? t("crop_mgmt.add_card.saving_btn")
                      : t("crop_mgmt.add_card.submit_btn")}
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
              <CardTitle className="mm:leading-loose">{t("crop_mgmt.table.title")}</CardTitle>
              <CardDescription>
                {t("crop_mgmt.table.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[60%]">
                        {t("crop_mgmt.table.col_name")}
                      </TableHead>
                      <TableHead>{t("crop_mgmt.table.col_category")}</TableHead>
                      <TableHead className="text-right px-6">
                        {t("crop_mgmt.table.col_action")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell
                            colSpan={3}
                            className="h-16 animate-pulse bg-muted/20"
                          />
                        </TableRow>
                      ))
                    ) : crops.length > 0 ? (
                      crops.map((crop: any) => (
                        <TableRow
                          key={crop._id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <TableCell className="font-semibold">
                            {crop.name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                crop.category === "rice" ? "default" : "outline"
                              }
                              className="capitalize"
                            >
                              {t(`${crop.category}`)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right px-6">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              disabled={isDeleting}
                              onClick={() => handleDelete(crop._id)}
                            >
                              <Trash2 size={18} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="h-32 text-center text-muted-foreground"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Leaf className="h-8 w-8 opacity-20" />
                            <p>{t("crop_mgmt.table.no_data")}</p>
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
