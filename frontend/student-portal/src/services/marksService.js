import api from "../api/client";

/**
 * Centralized Marks API client (Task 9.24).
 * Talks to the API Gateway (/api/marks and /api/results). Reusable across portals.
 */
const MARKS = "/api/marks";
const RESULTS = "/api/results";

export function createMarks(payload) {
  return api.post(MARKS, payload).then((r) => r.data);
}

export function bulkUploadMarks(payload) {
  return api.post(`${MARKS}/bulk`, payload).then((r) => r.data);
}

export function updateMarks(id, payload) {
  return api.put(`${MARKS}/${id}`, payload).then((r) => r.data);
}

export function deleteMarks(id) {
  return api.delete(`${MARKS}/${id}`).then((r) => r.data);
}

export function approveMarks(id) {
  return api.put(`${MARKS}/${id}/approve`).then((r) => r.data);
}

export function publishMarks(id) {
  return api.put(`${MARKS}/${id}/publish`).then((r) => r.data);
}

export function getStudentMarks(studentId, params = {}) {
  return api
    .get(`${MARKS}/student/${studentId}`, { params })
    .then((r) => r.data);
}

export function getSubjectMarks(subjectId) {
  return api.get(`${MARKS}/subject/${subjectId}`).then((r) => r.data);
}

export function createExam(payload) {
  return api.post(`${MARKS}/exams`, payload).then((r) => r.data);
}

export function getExams(params = {}) {
  return api.get(`${MARKS}/exams`, { params }).then((r) => r.data);
}

export function getResults(studentId) {
  return api.get(`${RESULTS}/student/${studentId}`).then((r) => r.data);
}

export function getAnalytics(params = {}) {
  return api.get(`${RESULTS}/analytics`, { params }).then((r) => r.data);
}

export function getSelfResults() {
  return api.get(`${RESULTS}/me`).then((r) => r.data);
}

export default {
  createMarks,
  bulkUploadMarks,
  updateMarks,
  deleteMarks,
  approveMarks,
  publishMarks,
  getStudentMarks,
  getSubjectMarks,
  createExam,
  getExams,
  getResults,
  getAnalytics,
  getSelfResults,
};
