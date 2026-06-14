import api from "../api/client";

/**
 * Centralized Subject API client (Task 6.20).
 * Talks to the API Gateway (/api/subjects). Reusable across portals.
 */
const BASE = "/api/subjects";

export function createSubject(payload) {
  return api.post(BASE, payload).then((r) => r.data);
}

export function getSubjects(params = {}) {
  return api.get(BASE, { params }).then((r) => r.data);
}

export function getSubject(id) {
  return api.get(`${BASE}/${id}`).then((r) => r.data);
}

export function updateSubject(id, payload) {
  return api.put(`${BASE}/${id}`, payload).then((r) => r.data);
}

export function deleteSubject(id) {
  return api.delete(`${BASE}/${id}`).then((r) => r.data);
}

export function assignFaculty(id, facultyId) {
  return api
    .put(`${BASE}/${id}/assign-faculty`, { facultyId })
    .then((r) => r.data);
}

export function getFacultySubjects() {
  return api.get(`${BASE}/faculty/me`).then((r) => r.data);
}

export function getStudentSubjects() {
  return api.get(`${BASE}/student/me`).then((r) => r.data);
}

export default {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
  assignFaculty,
  getFacultySubjects,
  getStudentSubjects,
};
