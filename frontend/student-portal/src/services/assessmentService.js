import api from "../api/client";

/**
 * Centralized Assessment API client (Task 13.25).
 * Talks to the API Gateway (/api/assessments and /api/submissions). Reusable across portals.
 */
const A = "/api/assessments";
const S = "/api/submissions";

export function createAssessment(payload) {
  return api.post(A, payload).then((r) => r.data);
}

export function updateAssessment(id, payload) {
  return api.put(`${A}/${id}`, payload).then((r) => r.data);
}

export function deleteAssessment(id) {
  return api.delete(`${A}/${id}`).then((r) => r.data);
}

export function publishAssessment(id) {
  return api.post(`${A}/${id}/publish`).then((r) => r.data);
}

export function getAssessments(params = {}) {
  return api.get(A, { params }).then((r) => r.data);
}

export function getAssessment(id) {
  return api.get(`${A}/${id}`).then((r) => r.data);
}

export function uploadAttachment(id, file) {
  const form = new FormData();
  form.append("file", file);
  return api
    .post(`${A}/${id}/attachment`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
}

export function submitAssessment(id, file) {
  const form = new FormData();
  form.append("file", file);
  return api
    .post(`${A}/${id}/submissions`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
}

export function getSubmissions(id) {
  return api.get(`${A}/${id}/submissions`).then((r) => r.data);
}

export function getMySubmission(id) {
  return api.get(`${A}/${id}/my-submission`).then((r) => r.data);
}

export function getSubmissionHistory(id) {
  return api.get(`${A}/${id}/history`).then((r) => r.data);
}

export function gradeSubmission(submissionId, payload) {
  return api.put(`${S}/${submissionId}/grade`, payload).then((r) => r.data);
}

export function getAnalytics(params = {}) {
  return api.get(`${A}/analytics`, { params }).then((r) => r.data);
}

export default {
  createAssessment,
  updateAssessment,
  deleteAssessment,
  publishAssessment,
  getAssessments,
  getAssessment,
  uploadAttachment,
  submitAssessment,
  getSubmissions,
  getMySubmission,
  getSubmissionHistory,
  gradeSubmission,
  getAnalytics,
};
