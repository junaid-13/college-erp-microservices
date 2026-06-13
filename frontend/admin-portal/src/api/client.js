import axios from "axios";

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || "http://localhost:4000";

export const TOKEN_KEY = "erp_access_token";
export const REFRESH_KEY = "erp_refresh_token";

const api = axios.create({
  baseURL: GATEWAY_URL,
});

// Attach the access token to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, attempt one refresh-token flow, then retry the original request.
let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const refreshToken = localStorage.getItem(REFRESH_KEY);

    if (
      error.response &&
      error.response.status === 401 &&
      !original._retry &&
      refreshToken &&
      !original.url.includes("/api/auth/refresh-token")
    ) {
      original._retry = true;
      try {
        refreshing =
          refreshing ||
          axios.post(`${GATEWAY_URL}/api/auth/refresh-token`, {
            refreshToken,
          });
        const { data } = await refreshing;
        refreshing = null;
        localStorage.setItem(TOKEN_KEY, data.accessToken);
        localStorage.setItem(REFRESH_KEY, data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (e) {
        refreshing = null;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
