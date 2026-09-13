import type { Notification } from "../types";
import { api, getErrorMessage } from "./client";
import { MOCK_MODE, mockDelay, mockDelayFast } from "./mockMode";
import { MOCK_NOTIFICATIONS } from "../data";

let unreadSeed = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

export interface NotificationResponse {
  success: boolean;
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}

// Get all notifications for current user
export async function getNotificationsApi(
  limit: number = 20,
  skip: number = 0,
): Promise<NotificationResponse> {
  if (MOCK_MODE) {
    await mockDelay();
    const page = MOCK_NOTIFICATIONS.slice(skip, skip + limit);
    return {
      success: true,
      notifications: page,
      unreadCount: unreadSeed,
      pagination: { limit, skip, hasMore: skip + limit < MOCK_NOTIFICATIONS.length },
    };
  }
  try {
    const { data } = await api.get<NotificationResponse>(
      `/notifications?limit=${limit}&skip=${skip}`,
    );
    return data;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to fetch notifications"));
  }
}

// Get unread count
export async function getUnreadCountApi(): Promise<number> {
  if (MOCK_MODE) {
    await mockDelayFast();
    return unreadSeed;
  }
  try {
    const { data } = await api.get<{ success: boolean; unreadCount: number }>(
      "/notifications/unread-count",
    );
    return data.unreadCount;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to get unread count"));
  }
}

// Mark single notification as read
export async function markNotificationAsReadApi(
  notificationId: string,
): Promise<Notification> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const n = MOCK_NOTIFICATIONS.find((x) => x._id === notificationId);
    if (n && !n.read) {
      n.read = true;
      unreadSeed = Math.max(0, unreadSeed - 1);
    }
    return n ?? MOCK_NOTIFICATIONS[0];
  }
  try {
    const { data } = await api.put<{
      success: boolean;
      notification: Notification;
    }>(`/notifications/${notificationId}/read`);
    return data.notification;
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to mark as read"));
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsReadApi(): Promise<void> {
  if (MOCK_MODE) {
    await mockDelayFast();
    MOCK_NOTIFICATIONS.forEach((n) => (n.read = true));
    unreadSeed = 0;
    return;
  }
  try {
    await api.put("/notifications/read-all");
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to mark all as read"));
  }
}

// Delete notification
export async function deleteNotificationApi(
  notificationId: string,
): Promise<void> {
  if (MOCK_MODE) {
    await mockDelayFast();
    const idx = MOCK_NOTIFICATIONS.findIndex((n) => n._id === notificationId);
    if (idx >= 0) {
      const [removed] = MOCK_NOTIFICATIONS.splice(idx, 1);
      if (!removed.read) unreadSeed = Math.max(0, unreadSeed - 1);
    }
    return;
  }
  try {
    await api.delete(`/notifications/${notificationId}`);
  } catch (e) {
    throw new Error(getErrorMessage(e, "Failed to delete notification"));
  }
}