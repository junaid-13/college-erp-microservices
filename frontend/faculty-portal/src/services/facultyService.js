import api from "../api/client";

/**
 * Centralized Faculty API client (Task 5.21).
 * Talks to the API Gateway (/api/faculties). Reusable across portals.
 */
const BASE = "/api/faculties";

export function createFaculty(payload) {
  return api.post(BASE, payload).then((r) => r.data);
}

export function getFaculties(params = {}) {
  return api.get(BASE, { params }).then((r) => r.data);
}

export function getFaculty(id) {
  return api.get(`${BASE}/${id}`).then((r) => r.data);
}

export function updateFaculty(id, payload) {
  return api.put(`${BASE}/${id}`, payload).then((r) => r.data);
}

export function deleteFaculty(id) {
  return api.delete(`${BASE}/${id}`).then((r) => r.data);
}

export function changeStatus(id, status) {
  return api.patch(`${BASE}/${id}/status`, { status }).then((r) => r.data);
}

export function setHODEligibility(id, isHODEligible) {
  return api
    .patch(`${BASE}/${id}/hod-eligibility`, { isHODEligible })
    .then((r) => r.data);
}

export function getOwnProfile() {
  return api.get(`${BASE}/me`).then((r) => r.data);
}

export default {
  createFaculty,
  getFaculties,
  getFaculty,
  updateFaculty,
  deleteFaculty,
  changeStatus,
  setHODEligibility,
  getOwnProfile,
};
