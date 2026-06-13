import api from "../api/client";

/**
 * Centralized Notification API client (Task 15.22).
 * Talks to the API Gateway (/api/notifications). Reusable across portals.
 */
const BASE = "/api/notifications";

export function getNotifications(params = {}) {
  return api.get(BASE, { params }).then((r) => r.data);
}

export function markAsRead(id) {
  return api.put(`${BASE}/${id}/read`).then((r) => r.data);
}

export function markAllAsRead() {
  return api.put(`${BASE}/read-all`).then((r) => r.data);
}

export function getUnreadCount() {
  return api.get(`${BASE}/unread/count`).then((r) => r.data);
}

export function getPreferences() {
  return api.get(`${BASE}/preferences`).then((r) => r.data);
}

export function updatePreferences(patch) {
  return api.put(`${BASE}/preferences`, patch).then((r) => r.data);
}

export function getAnalytics() {
  return api.get(`${BASE}/analytics`).then((r) => r.data);
}

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getPreferences,
  updatePreferences,
  getAnalytics,
};
