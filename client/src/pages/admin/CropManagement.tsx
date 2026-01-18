import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

/* ---------------- Schema ---------------- */
const cropSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.enum(["rice", "beans"]),
});

type CropFormValues = z.infer<typeof cropSchema>;

export default function CropManagement() {
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
      toast.success("Crop variety added successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to add crop. Please try again.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCrop(id).unwrap();
      toast.success("Crop deleted successfully");
    } catch (error) {
      toast.error("Failed to delete crop");
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crop Inventory</h1>
          <p className="text-muted-foreground">
            Manage the varieties and categories available in the market.
          </p>
        </div>
        {isFetching && (
          <Badge variant="secondary" className="animate-pulse">
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Syncing...
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
                Add New Crop
              </CardTitle>
              <CardDescription>
                Enter the details for the new crop variety.
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
                        <FormLabel>Variety Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Matpe" {...field} />
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
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="rice">Rice</SelectItem>
                            <SelectItem value="beans">Beans</SelectItem>
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
                    {isCreating ? "Saving..." : "Create Crop"}
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
              <CardTitle>Available Crops</CardTitle>
              <CardDescription>
                A list of all registered crops in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[60%]">Crop Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right px-6">Action</TableHead>
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
                              {crop.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right px-6">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              disabled={isDeleting}
                              onClick={() => {
                                // if (
                                //   confirm(
                                //     "Are you sure you want to delete this crop?"
                                //   )
                                // ) {
                                handleDelete(crop._id);
                                // }
                              }}
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
                            <p>No crops found. Add one to get started.</p>
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
