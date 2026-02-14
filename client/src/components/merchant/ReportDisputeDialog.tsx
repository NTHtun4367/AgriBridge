import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
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
import { useCurrentUserQuery } from "@/store/slices/userApi";
import { useCreateDisputeMutation } from "@/store/slices/disputeApi";

interface ReportMerchantDisputeDialogProps {
  merchant: any;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function ReportDisputeDialog({
  merchant,
  isOpen,
  setIsOpen,
}: ReportMerchantDisputeDialogProps) {
  const { t } = useTranslation();
  const { data: user } = useCurrentUserQuery();
  const [createMerchantDispute, { isLoading }] = useCreateDisputeMutation();

  // 1. LOCALIZED SCHEMA
  const merchantDisputeSchema = z.object({
    reason: z.string().min(1, t("merchant_disputes.validation.reason")),
    description: z
      .string()
      .min(20, t("merchant_disputes.validation.description")),
    orderId: z.string().optional(),
  });

  type MerchantDisputeFormValues = z.infer<typeof merchantDisputeSchema>;

  const form = useForm<MerchantDisputeFormValues>({
    resolver: zodResolver(merchantDisputeSchema),
    defaultValues: { reason: "", description: "", orderId: "" },
  });

  async function onSubmit(values: MerchantDisputeFormValues) {
    try {
      await createMerchantDispute({
        merchantId: merchant._id,
        farmerId: user?._id,
        ...values,
      }).unwrap();

      toast.success(t("merchant_disputes.success"));
      setIsOpen(false);
      form.reset();
    } catch (error) {
      toast.error(t("merchant_disputes.error"));
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 mm:leading-loose">
            <AlertTriangle className="h-5 w-5" />
            {t("merchant_disputes.title")}
          </DialogTitle>
          <DialogDescription className="mm:leading-loose">
            <Trans
              i18nKey="merchant_disputes.description"
              values={{
                name: merchant?.merchantId?.businessName || "Merchant",
              }}
              components={{ strong: <strong /> }}
            />
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mm:leading-loose">{t("merchant_disputes.reason_label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="mm:leading-loose">
                        <SelectValue
                          placeholder={t(
                            "merchant_disputes.reason_placeholder",
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pricing">
                        {t("merchant_disputes.reasons.pricing")}
                      </SelectItem>
                      <SelectItem value="payment">
                        {t("merchant_disputes.reasons.payment")}
                      </SelectItem>
                      <SelectItem value="behavior">
                        {t("merchant_disputes.reasons.behavior")}
                      </SelectItem>
                      <SelectItem value="fraud">
                        {t("merchant_disputes.reasons.fraud")}
                      </SelectItem>
                      <SelectItem value="other">
                        {t("merchant_disputes.reasons.other")}
                      </SelectItem>
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
                  <FormLabel className="mm:leading-loose">{t("merchant_disputes.desc_label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("merchant_disputes.desc_placeholder")}
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
                {t("merchant_disputes.cancel")}
              </Button>
              <Button type="submit" variant="destructive" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("merchant_disputes.submit")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
