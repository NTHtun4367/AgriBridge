import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import { useChangeUserStatusMutation } from "@/store/slices/adminApi";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

interface UserStatusDropDownProps {
  userId: string;
  userStatus: string; // This must be "active" or "ban" (or "unactive")
}

function UserStatusDropDown({ userId, userStatus }: UserStatusDropDownProps) {
  const { t } = useTranslation();
  const [changeUserStatus, { isLoading }] = useChangeUserStatusMutation();

  const statusOptions = useMemo(
    () => [
      {
        value: "active",
        label: t("farmer_mgmt.status.active", "Active"),
        color: "text-primary",
        icon: <ShieldCheck className="w-4 h-4" />,
      },
      {
        // Ensure this 'value' matches what your API/Database sends
        value: "ban",
        label: t("farmer_mgmt.status.unactive", "Unactive"),
        color: "text-destructive",
        icon: <ShieldAlert className="w-4 h-4" />,
      },
    ],
    [t],
  );

  // Fallback if userStatus doesn't match "active" or "ban" perfectly
  const currentOption = useMemo(() => {
    return (
      statusOptions.find((item) => item.value === userStatus) ||
      statusOptions[1]
    );
  }, [userStatus, statusOptions]);

  const handleChange = async (newStatus: string) => {
    try {
      await changeUserStatus({ userId, status: newStatus }).unwrap();
      toast.success(
        t(
          "farmer_mgmt.notifications.status_updated",
          `Status updated to ${newStatus}`,
        ),
      );
    } catch (error) {
      toast.error(
        t("farmer_mgmt.notifications.status_error", "Failed to update status"),
      );
    }
  };

  return (
    <Select
      value={userStatus}
      onValueChange={handleChange}
      disabled={isLoading}
    >
      <SelectTrigger
        className={`w-[150px] h-9 border-2 text-xs font-bold transition-all bg-background ${
          userStatus === "active"
            ? "border-primary/50 text-primary"
            : "border-destructive/50 text-destructive"
        }`}
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
              <span className="truncate mm:leading-loose">{currentOption?.label}</span>
            </>
          )}
        </div>
      </SelectTrigger>

      <SelectContent align="end" className="min-w-[150px]">
        {statusOptions.map((item) => (
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

export default UserStatusDropDown;
