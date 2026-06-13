import api from "../api/client";

/**
 * Centralized Leave API client (Task 10.21).
 * Talks to the API Gateway (/api/leaves). Reusable across portals.
 */
const BASE = "/api/leaves";

export function applyLeave(payload) {
  return api.post(BASE, payload).then((r) => r.data);
}

export function cancelLeave(id) {
  return api.put(`${BASE}/${id}/cancel`).then((r) => r.data);
}

export function approveLeave(id, remarks = "") {
  return api.put(`${BASE}/${id}/approve`, { remarks }).then((r) => r.data);
}

export function rejectLeave(id, remarks) {
  return api.put(`${BASE}/${id}/reject`, { remarks }).then((r) => r.data);
}

export function getMyLeaves() {
  return api.get(`${BASE}/me`).then((r) => r.data);
}

export function getPendingLeaves(params = {}) {
  return api.get(`${BASE}/pending`, { params }).then((r) => r.data);
}

export function getAnalytics(params = {}) {
  return api.get(`${BASE}/analytics`, { params }).then((r) => r.data);
}

export function getReports(params = {}) {
  return api.get(`${BASE}/reports`, { params }).then((r) => r.data);
}

export function getLeave(id) {
  return api.get(`${BASE}/${id}`).then((r) => r.data);
}

export function uploadAttachment(file) {
  const form = new FormData();
  form.append("file", file);
  return api
    .post(`${BASE}/attachment`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
}

export default {
  applyLeave,
  cancelLeave,
  approveLeave,
  rejectLeave,
  getMyLeaves,
  getPendingLeaves,
  getAnalytics,
  getReports,
  getLeave,
  uploadAttachment,
};
