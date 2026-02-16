import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { useUpdateUserVerificationStatusMutation } from "@/store/slices/adminApi";
import { toast } from "sonner";
import { Loader2, CheckCircle, Clock, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

interface MerchantVerificationDropDownProps {
  merchantId: string;
  currentStatus: string;
}

function MerchantVerificationDropDown({
  merchantId,
  currentStatus,
}: MerchantVerificationDropDownProps) {
  const { t } = useTranslation();
  const [updateVerification, { isLoading }] =
    useUpdateUserVerificationStatusMutation();

  const verificationOptions = useMemo(
    () => [
      {
        value: "pending",
        label: t("merchant_mgmt.status.pending", "Pending"),
        color: "text-yellow-600",
        icon: <Clock className="w-4 h-4" />,
        borderColor: "border-yellow-500/50",
      },
      {
        value: "verified",
        label: t("merchant_mgmt.status.verified", "Verified"),
        color: "text-green-600",
        icon: <CheckCircle className="w-4 h-4" />,
        borderColor: "border-green-500/50",
      },
      {
        value: "rejected",
        label: t("merchant_mgmt.status.rejected", "Rejected"),
        color: "text-red-600",
        icon: <XCircle className="w-4 h-4" />,
        borderColor: "border-red-500/50",
      },
    ],
    [t],
  );

  const currentOption = useMemo(() => {
    return (
      verificationOptions.find((item) => item.value === currentStatus) ||
      verificationOptions[0] // Default to Pending if status is unknown
    );
  }, [currentStatus, verificationOptions]);

  const handleChange = async (newStatus: string) => {
    try {
      await updateVerification({
        userId: merchantId,
        status: newStatus,
      }).unwrap();

      toast.success(
        t(
          "merchant_mgmt.notifications.verification_updated",
          `Verification updated to ${newStatus}`,
        ),
      );
    } catch (error) {
      toast.error(
        t(
          "merchant_mgmt.notifications.verification_error",
          "Failed to update verification",
        ),
      );
    }
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={handleChange}
      disabled={isLoading}
    >
      <SelectTrigger
        className={`w-[155px] h-9 border-2 text-xs font-bold transition-all bg-background uppercase ${currentOption.borderColor} ${currentOption.color}`}
      >
        <div className="flex items-center gap-2 w-full">
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <>
              {currentOption && (
                <span className={currentOption.color}>
                  {currentOption.icon}
                </span>
              )}
              <span className="truncate mm:leading-loose">
                {currentOption?.label}
              </span>
            </>
          )}
        </div>
      </SelectTrigger>

      <SelectContent align="end" className="min-w-[155px]">
        {verificationOptions.map((item) => (
          <SelectItem
            value={item.value}
            key={item.value}
            className="cursor-pointer focus:bg-accent"
          >
            <div className="flex items-center gap-2 py-1">
              <span className={item.color}>{item.icon}</span>
              <span className={`text-xs font-semibold ${item.color}`}>
                {item.label}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default MerchantVerificationDropDown;
