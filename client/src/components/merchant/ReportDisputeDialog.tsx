import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCreateDisputeMutation } from "@/store/slices/disputeApi";
import { useCurrentUserQuery } from "@/store/slices/userApi";

// 1. DISPUTE SCHEMA
const disputeSchema = z.object({
  reason: z.string().min(1, "Please select a reason for the dispute"),
  description: z
    .string()
    .min(20, "Please provide at least 20 characters describing the issue"),
  orderId: z.string().optional(),
});

type DisputeFormValues = z.infer<typeof disputeSchema>;

interface ReportDisputeDialogProps {
  merchant: any;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function ReportDisputeDialog({
  merchant,
  isOpen,
  setIsOpen,
}: ReportDisputeDialogProps) {
  const { data: user } = useCurrentUserQuery();
  const [createDispute, { isLoading }] = useCreateDisputeMutation();

  const form = useForm<DisputeFormValues>({
    resolver: zodResolver(disputeSchema),
    defaultValues: { reason: "", description: "", orderId: "" },
  });

  async function onSubmit(values: DisputeFormValues) {
    try {
      await createDispute({
        merchantId: merchant._id, // Ensure this matches your DB schema
        farmerId: user?._id,
        ...values,
      }).unwrap();

      toast.success("Dispute reported to admin successfully.");
      setIsOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to submit report.");
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Report Merchant
          </DialogTitle>
          <DialogDescription>
            Submit a formal dispute regarding{" "}
            <strong>{merchant.merchantId.businessName}</strong>. The admin team
            will review your report.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Dispute</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pricing">Incorrect Pricing</SelectItem>
                      <SelectItem value="payment">Payment Issues</SelectItem>
                      <SelectItem value="behavior">
                        Unprofessional Behavior
                      </SelectItem>
                      <SelectItem value="fraud">Suspected Fraud</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain what happened in detail..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Report
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
