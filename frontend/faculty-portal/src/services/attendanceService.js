import api from "../api/client";

/**
 * Centralized Attendance API client (Task 8.22).
 * Talks to the API Gateway (/api/attendance). Reusable across portals.
 */
const BASE = "/api/attendance";

export function markAttendance(payload) {
  return api.post(BASE, payload).then((r) => r.data);
}

export function bulkMarkAttendance(payload) {
  return api.post(`${BASE}/bulk`, payload).then((r) => r.data);
}

export function updateAttendance(id, payload) {
  return api.put(`${BASE}/${id}`, payload).then((r) => r.data);
}

export function getAttendance(params = {}) {
  return api.get(`${BASE}/reports`, { params }).then((r) => r.data);
}

export function getStudentAttendance(studentId, params = {}) {
  return api
    .get(`${BASE}/student/${studentId}`, { params })
    .then((r) => r.data);
}

export function getSubjectAttendance(subjectId) {
  return api.get(`${BASE}/subject/${subjectId}`).then((r) => r.data);
}

export function getAttendanceSummary(studentId) {
  return api.get(`${BASE}/summary/student/${studentId}`).then((r) => r.data);
}

export function getReports(params = {}) {
  return api.get(`${BASE}/reports`, { params }).then((r) => r.data);
}

export function getFacultyDashboard(params = {}) {
  return api.get(`${BASE}/dashboard/faculty`, { params }).then((r) => r.data);
}

export function getHODDashboard(params = {}) {
  return api.get(`${BASE}/dashboard/hod`, { params }).then((r) => r.data);
}

export function getSelfAttendance() {
  return api.get(`${BASE}/me`).then((r) => r.data);
}

export default {
  markAttendance,
  bulkMarkAttendance,
  updateAttendance,
  getAttendance,
  getStudentAttendance,
  getSubjectAttendance,
  getAttendanceSummary,
  getReports,
  getFacultyDashboard,
  getHODDashboard,
  getSelfAttendance,
};
