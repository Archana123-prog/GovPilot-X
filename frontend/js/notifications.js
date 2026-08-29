// export function notify(message,type='info'){document.dispatchEvent(new CustomEvent('govpilot:notification',{detail:{message,type}}))}


import { api } from "./api";

export async function getNotifications(userId) {
  return api.get(`/notifications/user/${userId}`);
}

export async function markAsRead(notificationId) {
  return api.put(
    `/notifications/${notificationId}/read`
  );
}

export async function markAllAsRead(userId) {
  return api.put(
    `/notifications/user/${userId}/read-all`
  );
}

export function getNotificationIcon(type) {
  const icons = {
    application: "📄",
    evaluation: "⭐",
    pilot: "🚀",
    procurement: "🏛️",
    message: "💬",
    system: "🔔",
  };

  return icons[type] || "🔔";
}