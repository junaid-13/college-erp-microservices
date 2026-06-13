import api from "../api/client";

/**
 * Centralized Timetable API client (Task 7.22).
 * Talks to the API Gateway. Reusable across portals.
 */
const BASE = "/api/timetables";
const SLOTS = "/api/timetable-slots";

export function createTimetable(payload) {
  return api.post(BASE, payload).then((r) => r.data);
}

export function getTimetables(params = {}) {
  return api.get(BASE, { params }).then((r) => r.data);
}

export function getTimetable(id) {
  return api.get(`${BASE}/${id}`).then((r) => r.data);
}

export function updateTimetable(id, payload) {
  return api.put(`${BASE}/${id}`, payload).then((r) => r.data);
}

export function deleteTimetable(id) {
  return api.delete(`${BASE}/${id}`).then((r) => r.data);
}

export function addSlot(timetableId, payload) {
  return api.post(`${BASE}/${timetableId}/slots`, payload).then((r) => r.data);
}

export function updateSlot(slotId, payload) {
  return api.put(`${SLOTS}/${slotId}`, payload).then((r) => r.data);
}

export function deleteSlot(slotId) {
  return api.delete(`${SLOTS}/${slotId}`).then((r) => r.data);
}

export function getFacultyTimetable() {
  return api.get(`${BASE}/faculty/me`).then((r) => r.data);
}

export function getStudentTimetable() {
  return api.get(`${BASE}/student/me`).then((r) => r.data);
}

export function getTodaySchedule(role) {
  const path =
    role === "FACULTY" ? `${BASE}/faculty/today` : `${BASE}/student/today`;
  return api.get(path).then((r) => r.data);
}

export default {
  createTimetable,
  getTimetables,
  getTimetable,
  updateTimetable,
  deleteTimetable,
  addSlot,
  updateSlot,
  deleteSlot,
  getFacultyTimetable,
  getStudentTimetable,
  getTodaySchedule,
};
