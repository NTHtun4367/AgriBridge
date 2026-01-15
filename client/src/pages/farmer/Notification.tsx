import { Button } from "@/components/ui/button";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from "@/store/slices/notificationApi";
import { Trash2, MailOpen, ArrowLeft, BellOff } from "lucide-react";
import { useNavigate } from "react-router";

export const Notification = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetNotificationsQuery();
  const [markRead] = useMarkAsReadMutation();
  const [remove] = useDeleteNotificationMutation();

  const notifications = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500">Loading your updates...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-extrabold text-gray-900">Notifications</h1>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
            <BellOff className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No notifications
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              We'll let you know when something happens.
            </p>
          </div>
        ) : (
          notifications.map((item: any) => (
            <div
              key={item._id}
              className={`flex items-start justify-between p-5 border rounded-xl transition-all shadow-sm ${
                item.isRead
                  ? "bg-white border-gray-100"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {!item.isRead && (
                    <div className="h-2.5 w-2.5 bg-blue-600 rounded-full animate-pulse" />
                  )}
                  <h3
                    className={`font-bold ${
                      item.isRead ? "text-gray-700" : "text-gray-900"
                    }`}
                  >
                    {item.notificationId?.title || "Notification"}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                  {item.notificationId?.message}
                </p>
                <p className="text-[11px] font-medium text-gray-400 mt-3 flex items-center gap-1">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2 ml-4">
                {!item.isRead && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 border-blue-200 hover:bg-blue-100"
                    onClick={() => markRead(item._id)} // Use item._id to target the specific user-notification doc
                    title="Mark as read"
                  >
                    <MailOpen className="h-4 w-4 text-blue-600" />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => remove(item._id)}
                  className="h-9 w-9 hover:bg-red-50 hover:text-red-600 border-gray-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
