import api from "../api/client";

/**
 * Student API client (student-portal side).
 * Only self-service reads are needed here.
 */
const BASE = "/api/students";

export function getOwnProfile() {
  return api.get(`${BASE}/me`).then((r) => r.data);
}

export default { getOwnProfile };
