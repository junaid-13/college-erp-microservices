import api from "../api/client";

const BASE = "/api/students";

export function getOwnProfile() {
  return api.get(`${BASE}/me`).then((r) => r.data);
}

export default { getOwnProfile };
