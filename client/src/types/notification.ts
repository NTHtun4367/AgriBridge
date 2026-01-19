// Define interfaces for better TypeScript support
export interface AnnouncementRequest {
  title: string;
  content: string;
  target: string; // "All" | "Farmers" | "Merchants"
}

export interface NotificationResponse {
  _id: string;
  notificationId: {
    _id: string;
    title: string;
    message: string;
    createdAt: string;
  };
  isRead: boolean;
  createdAt: string;
}
