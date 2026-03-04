import api from "./client";

// --- Types ---

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface PaginatedNotifications {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
}

export interface UnreadCount {
  count: number;
}

// --- API Functions ---

/**
 * Get paginated notifications for the current user.
 */
export async function getNotifications(params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}): Promise<PaginatedNotifications> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.unreadOnly) query.set("unreadOnly", "true");

  const qs = query.toString();
  const url = `/api/v1/notifications${qs ? `?${qs}` : ""}`;
  const res = await api.get(url);
  return res.data?.data ?? res.data;
}

/**
 * Get unread notification count (for bell badge).
 */
export async function getUnreadCount(): Promise<UnreadCount> {
  const res = await api.get("/api/v1/notifications/unread-count");
  return res.data?.data ?? res.data;
}

/**
 * Mark a single notification as read.
 */
export async function markAsRead(
  notificationId: string,
): Promise<Notification> {
  const res = await api.patch(`/api/v1/notifications/${notificationId}/read`);
  return res.data?.data ?? res.data;
}

/**
 * Mark all notifications as read.
 */
export async function markAllAsRead(): Promise<{ count: number }> {
  const res = await api.patch("/api/v1/notifications/read-all");
  return res.data?.data ?? res.data;
}

/**
 * Delete a notification.
 */
export async function deleteNotification(
  notificationId: string,
): Promise<void> {
  await api.delete(`/api/v1/notifications/${notificationId}`);
}
