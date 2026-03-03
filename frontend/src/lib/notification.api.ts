import { apiFetch } from "./api";

export type NotificationItem = {
  id: string;
  title: string;
  body: string | null;
  url: string | null;
  read_at: string | null;
  created_at: string;
};

export type NotificationListResponse = {
  items: NotificationItem[];
  unread_count: number;
};

export function getMyNotifications() {
  return apiFetch<NotificationListResponse>("/notifications");
}

export function markNotificationAsRead(id: string) {
  return apiFetch<{ ok: true }>(`/notifications/${id}/read`, {
    method: "PATCH",
  });
}
