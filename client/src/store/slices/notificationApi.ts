import type {
  AnnouncementRequest,
  NotificationResponse,
} from "@/types/notification";
import { apiSlice } from "./api";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // --- USER ENDPOINTS ---

    getNotifications: builder.query<NotificationResponse[], void>({
      query: () => "/notifications",
      providesTags: ["Notification"],
    }),

    markAsRead: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    markAllAsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: `/notifications/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteNotification: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

    // --- ADMIN ENDPOINTS ---

    /**
     * Creates a new broadcast announcement and triggers notifications for users.
     */
    createAnnouncement: builder.mutation<
      { success: boolean; data: any },
      AnnouncementRequest
    >({
      query: (announcement) => ({
        url: "/notifications/announcements",
        method: "POST",
        body: announcement,
      }),
      // Invalidates both history and notifications to keep UI in sync
      invalidatesTags: ["Announcement", "Notification"],
    }),

    /**
     * Fetches the history of sent announcements for the admin dashboard.
     */
    getAnnouncementHistory: builder.query<any[], void>({
      query: () => "/notifications/announcements/history",
      providesTags: ["Announcement"],
    }),
  }),
});

export const {
  // User Hooks
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  // Admin Hooks
  useCreateAnnouncementMutation,
  useGetAnnouncementHistoryQuery,
} = notificationApi;
