import api from "../api/client";

/**
 * Centralized Department API client (Task 3.18).
 * Talks to the API Gateway (/api/departments). Reusable across modules.
 */
const BASE = "/api/departments";

export function getDepartments(params = {}) {
  return api.get(BASE, { params }).then((r) => r.data);
}

export function getDepartment(id) {
  return api.get(`${BASE}/${id}`).then((r) => r.data);
}

export function createDepartment(payload) {
  return api.post(BASE, payload).then((r) => r.data);
}

export function updateDepartment(id, payload) {
  return api.put(`${BASE}/${id}`, payload).then((r) => r.data);
}

export function deleteDepartment(id) {
  return api.delete(`${BASE}/${id}`).then((r) => r.data);
}

export function assignHOD(id, hodId) {
  return api.put(`${BASE}/${id}/assign-hod`, { hodId }).then((r) => r.data);
}

export default {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  assignHOD,
};
