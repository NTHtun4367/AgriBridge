import React, { useState } from 'react';
import { Bell, MessageSquare, TrendingUp, Info, CheckCheck, Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

// --- Types & Mock Data ---
export type NotificationType = 'price_alert' | 'message' | 'system' | 'payment';

export interface Notification {
  id: string;
  title: string;
  description: string;
  fullContent: string; // Added for the detailed view
  timestamp: string;
  date: string;
  type: NotificationType;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Wheat Prices Up 5%',
    description: 'The market price for Wheat in your region has increased.',
    fullContent: 'Market analysis shows a 5% increase in Wheat prices due to lower supply in neighboring districts. Current price: ₹2,400/quintal. We recommend checking with your local merchants for the best closing deals today.',
    timestamp: '2 hours ago',
    date: 'Dec 28, 2025',
    type: 'price_alert',
    isRead: false,
  },
  {
    id: '2',
    title: 'New Message from Merchant',
    description: 'Suresh Kumar sent you a proposal for your Organic Rice.',
    fullContent: 'Merchant Suresh Kumar is interested in purchasing 500kg of your Organic Rice. He has offered a premium price of ₹65/kg with pick-up included. Please respond within 24 hours to secure this offer.',
    timestamp: '5 hours ago',
    date: 'Dec 28, 2025',
    type: 'message',
    isRead: false,
  },
  {
    id: '3',
    title: 'System Update',
    description: 'AgriBridge will be undergoing maintenance tonight.',
    fullContent: 'To improve your experience, AgriBridge will perform scheduled database maintenance starting at 12:00 AM UTC. The dashboard might be unreachable for approximately 30 minutes.',
    timestamp: '1 day ago',
    date: 'Dec 27, 2025',
    type: 'system',
    isRead: true,
  },
];

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const openNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    handleMarkAsRead(notification.id);
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'price_alert': return <TrendingUp className="text-green-600" size={18} />;
      case 'message': return <MessageSquare className="text-blue-600" size={18} />;
      case 'system': return <Info className="text-amber-600" size={18} />;
      default: return <Bell size={18} />;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your alerts and merchant updates</p>
        </div>
        <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-slate-600 hover:text-green-700">
          <CheckCheck className="mr-2 h-4 w-4" /> Mark all as read
        </Button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <Card 
            key={n.id} 
            className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${
              n.isRead ? 'bg-white border-l-slate-200 opacity-80' : 'bg-green-50/40 border-l-green-600 shadow-sm'
            }`}
            onClick={() => openNotification(n)}
          >
            <CardContent className="p-4 flex items-start gap-4">
              <div className={`p-2.5 rounded-full ${n.isRead ? 'bg-slate-100' : 'bg-green-100'}`}>
                {getIcon(n.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-sm font-semibold truncate ${n.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                    {n.title}
                  </h3>
                  <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap uppercase tracking-wider">
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">
                  {n.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedNotification && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={selectedNotification.type === 'price_alert' ? 'default' : 'secondary'} className="bg-green-600 hover:bg-green-700">
                    {selectedNotification.type.replace('_', ' ')}
                  </Badge>
                </div>
                <DialogTitle className="text-xl text-slate-900">{selectedNotification.title}</DialogTitle>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                  <div className="flex items-center gap-1"><Calendar size={12}/> {selectedNotification.date}</div>
                  <div className="flex items-center gap-1"><Clock size={12}/> {selectedNotification.timestamp}</div>
                </div>
              </DialogHeader>
              <div className="py-4 border-t border-b border-slate-50 my-2">
                <p className="text-slate-600 leading-relaxed">
                  {selectedNotification.fullContent}
                </p>
              </div>
              <DialogFooter>
                <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" onClick={() => setSelectedNotification(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationPage;