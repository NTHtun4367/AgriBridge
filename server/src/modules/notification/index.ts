import { notificationService } from "./services/notification";

export const NotificationModule = {
  // Public method to send alerts
  send: (title: string, message: string, userIds: string[]) =>
    notificationService.createNotification(title, message, userIds),
};
