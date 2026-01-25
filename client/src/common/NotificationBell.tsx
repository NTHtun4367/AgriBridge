import { Bell } from "lucide-react";
import { useGetNotificationsQuery } from "@/store/slices/notificationApi";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUserQuery } from "@/store/slices/userApi";

export const NotificationBell = () => {
  // const navigate = useNavigate();
  const { data: user } = useCurrentUserQuery();
  const { data, isLoading } = useGetNotificationsQuery()
  
  // Filter notifications to match the current user's role
  const notifications = Array.isArray(data)
    ? data.filter(
        (n: any) =>
          n.notificationId?.targetRole === user?.role ||
          n.notificationId?.targetRole === "all",
      )
    : [];

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative p-2 outline-none">
        <Bell
          className={`h-6 w-6 ${isLoading ? "text-gray-300" : "text-gray-600"}`}
        />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 max-h-[450px] overflow-hidden bg-white shadow-xl border flex flex-col"
      >
        <div className="p-3 font-bold border-b text-sm flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
              {unreadCount} New
            </span>
          )}
        </div>

        <div className="overflow-y-auto flex-1">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-400">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">
              No notifications yet
            </div>
          ) : (
            // Only show the first 5 in the dropdown for better UX
            notifications.slice(0, 5).map((notif: any) => (
              <DropdownMenuItem
                key={notif._id}
                className={`p-3 border-b cursor-pointer flex flex-col items-start gap-1 ${
                  !notif.isRead ? "bg-blue-50/50" : ""
                }`}
                // onClick={() => navigate("/notifications")}
              >
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {notif.notificationId?.title}
                </p>
                {/* Render HTML content using dangerouslySetInnerHTML */}
                <div
                  className="text-xs text-gray-600 line-clamp-2 prose prose-sm max-w-full"
                  dangerouslySetInnerHTML={{
                    __html: notif.notificationId?.message || "",
                  }}
                />
                <span className="text-[10px] text-gray-400">
                  {new Date(notif.createdAt).toLocaleDateString()}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>

        {/* This button connects to your Notification Page */}
        <Link
          to={`/${user?.role}/notifications`}
          className="p-3 text-center text-xs font-bold text-blue-600 hover:bg-gray-50 border-t"
        >
          View All Notifications
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
