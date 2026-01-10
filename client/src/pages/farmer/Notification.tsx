import { useState, useMemo } from "react";
import {
  Bell,
  MessageSquare,
  TrendingUp,
  Info,
  CheckCheck,
  Calendar,
  ChevronRight,
  Inbox,
  // Sparkles,
  Circle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Types & Mock Data ---
export type NotificationType = "price_alert" | "message" | "system" | "payment";

export interface Notification {
  id: string;
  title: string;
  description: string;
  fullContent: string;
  timestamp: string;
  date: string;
  type: NotificationType;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Wheat Prices Up 5%",
    description: "The market price for Wheat in your region has increased.",
    fullContent:
      "Market analysis shows a 5% increase in Wheat prices due to lower supply in neighboring districts. Current price: ₹2,400/quintal.",
    timestamp: "2 hours ago",
    date: "Jan 10, 2026",
    type: "price_alert",
    isRead: false,
  },
  {
    id: "2",
    title: "New Message from Merchant",
    description: "Suresh Kumar sent you a proposal for your Organic Rice.",
    fullContent:
      "Merchant Suresh Kumar is interested in purchasing 500kg of your Organic Rice at ₹65/kg.",
    timestamp: "5 hours ago",
    date: "Jan 10, 2026",
    type: "message",
    isRead: false,
  },
  {
    id: "3",
    title: "System Update",
    description: "AgriBridge will be undergoing maintenance tonight.",
    fullContent:
      "AgriBridge will perform scheduled maintenance starting at 12:00 AM UTC.",
    timestamp: "1 day ago",
    date: "Jan 09, 2026",
    type: "system",
    isRead: true,
  },
];

const NotificationPage = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [filter, setFilter] = useState("all");

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") return notifications.filter((n) => !n.isRead);
    return notifications;
  }, [notifications, filter]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const openNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    handleMarkAsRead(notification.id);
  };

  const getIconStyles = (type: NotificationType, isRead: boolean) => {
    const base = "p-2.5 rounded-xl transition-colors ";
    switch (type) {
      case "price_alert":
        return {
          icon: <TrendingUp size={20} />,
          bg:
            base +
            (isRead
              ? "bg-emerald-50 text-emerald-600"
              : "bg-emerald-100 text-emerald-700"),
        };
      case "message":
        return {
          icon: <MessageSquare size={20} />,
          bg:
            base +
            (isRead ? "bg-blue-50 text-blue-600" : "bg-blue-100 text-blue-700"),
        };
      case "system":
        return {
          icon: <Info size={20} />,
          bg:
            base +
            (isRead
              ? "bg-amber-50 text-amber-600"
              : "bg-amber-100 text-amber-700"),
        };
      default:
        return {
          icon: <Bell size={20} />,
          bg: base + "bg-slate-100 text-slate-600",
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Dynamic Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            {/* <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary/70">
                Updates Area
              </span>
            </div> */}
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Notifications
            </h1>
            <p className="text-slate-500 font-medium">
              You have {notifications.filter((n) => !n.isRead).length} unread
              alerts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Tabs
              defaultValue="all"
              className="w-[200px]"
              onValueChange={setFilter}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-slate-500 hover:text-primary"
            >
              <CheckCheck className="h-4 w-4 mr-2" /> Mark all read
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto px-6 mt-8 space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => {
            const styles = getIconStyles(n.type, n.isRead);
            return (
              <Card
                key={n.id}
                className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-none ring-1 ${
                  n.isRead
                    ? "ring-slate-200 bg-white/60"
                    : "ring-primary/20 bg-white shadow-sm"
                }`}
                onClick={() => openNotification(n)}
              >
                {!n.isRead && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                )}

                <CardContent className="p-5 flex items-start gap-5 cursor-pointer">
                  <div className={styles.bg}>{styles.icon}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-bold tracking-tight ${
                            n.isRead
                              ? "text-slate-600"
                              : "text-slate-900 text-lg"
                          }`}
                        >
                          {n.title}
                        </h3>
                        {!n.isRead && (
                          <Circle className="w-2 h-2 fill-primary text-primary animate-pulse" />
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase">
                        {n.timestamp}
                      </span>
                    </div>

                    <p
                      className={`text-sm leading-relaxed line-clamp-2 ${
                        n.isRead ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {n.description}
                    </p>
                  </div>

                  <div className="flex items-center self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-slate-100 p-6 rounded-full mb-4">
              <Inbox className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
            <p className="text-slate-500">
              No {filter === "unread" ? "unread" : ""} notifications at the
              moment.
            </p>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedNotification}
        onOpenChange={() => setSelectedNotification(null)}
      >
        <DialogContent className="sm:max-w-[500px] border-none shadow-2xl p-0 overflow-hidden">
          {selectedNotification && (
            <div className="relative">
              <div className="h-2 bg-primary w-full" />
              <div className="p-8">
                <DialogHeader>
                  <div className="flex items-center justify-between mb-6">
                    <Badge
                      variant="outline"
                      className="px-3 py-1 border-primary/20 text-primary bg-primary/5 uppercase tracking-widest text-[10px]"
                    >
                      {selectedNotification.type.replace("_", " ")}
                    </Badge>
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <Calendar size={14} /> {selectedNotification.date}
                      </div>
                    </div>
                  </div>
                  <DialogTitle className="text-2xl font-black text-slate-900 leading-tight">
                    {selectedNotification.title}
                  </DialogTitle>
                </DialogHeader>

                <div className="my-8 relative">
                  <div className="absolute left-0 top-0 w-1 h-full bg-slate-100 rounded-full" />
                  <p className="pl-6 text-slate-600 leading-relaxed text-lg italic">
                    {selectedNotification.fullContent}
                  </p>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 py-6 border-slate-200"
                    onClick={() => setSelectedNotification(null)}
                  >
                    Dismiss
                  </Button>
                  <Button
                    className="flex-1 py-6 shadow-lg shadow-primary/20"
                    onClick={() => setSelectedNotification(null)}
                  >
                    Understand
                  </Button>
                </DialogFooter>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationPage;
