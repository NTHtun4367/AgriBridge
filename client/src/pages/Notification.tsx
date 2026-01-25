import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "@/store/slices/notificationApi";
import { useCurrentUserQuery } from "@/store/slices/userApi";
import { Trash2, ArrowLeft, BellOff, X, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router";

export const Notification = () => {
  const navigate = useNavigate();
  const [selectedNoti, setSelectedNoti] = useState<any>(null);

  const { data: user } = useCurrentUserQuery();
  const { data, isLoading } = useGetNotificationsQuery();
  const [markRead] = useMarkAsReadMutation();
  const [markAllRead] = useMarkAllAsReadMutation();
  const [remove] = useDeleteNotificationMutation();

  console.log(data);

  // Filter notifications based on current user's role
  const notifications = Array.isArray(data)
    ? data.filter(
        (n: any) =>
          n.notificationId?.targetRole === user?.role ||
          n.notificationId?.targetRole === "all",
      )
    : [];

  console.log(notifications);

  const hasUnread = notifications.some((n) => !n.isRead);

  const handleViewDetails = (item: any) => {
    setSelectedNoti(item);
    if (!item.isRead) {
      markRead(item._id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500 font-medium">
          Loading notifications...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Notifications
          </h1>
          <p className="text-gray-500 text-sm">
            Stay updated with your latest activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasUnread && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllRead()}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <CheckCheck className="h-4 w-4 mr-2" /> Mark all read
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border-2 border-dashed border-gray-200">
            <BellOff className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-semibold">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((item: any) => (
            <div
              key={item._id}
              onClick={() => handleViewDetails(item)}
              className={`group flex items-start justify-between p-4 border rounded-xl transition-all cursor-pointer ${
                item.isRead
                  ? "bg-white border-gray-100 opacity-75 hover:opacity-100"
                  : "bg-blue-50/60 border-blue-100 shadow-sm hover:border-blue-300"
              }`}
            >
              <div className="flex-1 pr-4 overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                  {!item.isRead && (
                    <span className="h-2 w-2 bg-blue-600 rounded-full shrink-0" />
                  )}
                  <h3
                    className={`font-bold leading-none truncate ${
                      item.isRead ? "text-gray-600" : "text-gray-900"
                    }`}
                  >
                    {item.notificationId?.title}
                  </h3>
                </div>
                {/* HTML content preview for the list */}
                <div
                  className="text-gray-600 text-sm line-clamp-1 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: item.notificationId?.message || "",
                  }}
                />
                <span className="text-[10px] font-bold text-gray-400 uppercase mt-2 block">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-red-600"
                  onClick={() => remove(item._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedNoti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in duration-150 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  System Notification
                </div>
                <button
                  onClick={() => setSelectedNoti(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <h2 className="text-xl font-black mb-2">
                {selectedNoti.notificationId?.title}
              </h2>
              {/* HTML content for the Modal Detail */}
              <div
                className="text-gray-600 text-sm leading-relaxed mb-6 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: selectedNoti.notificationId?.message || "",
                }}
              />
              <div className="text-[11px] text-gray-400 border-t pt-4">
                Received on: {new Date(selectedNoti.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 p-4 flex justify-end">
              <Button size="sm" onClick={() => setSelectedNoti(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
