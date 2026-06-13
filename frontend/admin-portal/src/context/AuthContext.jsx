import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import api, { TOKEN_KEY, REFRESH_KEY } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem(TOKEN_KEY),
  );
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  // Session persistence: on mount, if a token exists, restore the user.
  useEffect(() => {
    async function restore() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/api/auth/me");
        setUser(data);
        setAccessToken(localStorage.getItem(TOKEN_KEY));
      } catch (_) {
        // refresh interceptor already attempted; clear on failure.
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
      } finally {
        setLoading(false);
      }
    }
    restore();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_KEY, data.refreshToken);
    setAccessToken(data.accessToken);
    setUser({
      id: data.user.id || data.user._id,
      email: data.user.email,
      role: data.user.role,
    });
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    try {
      if (refreshToken) {
        await api.post("/api/auth/logout", { refreshToken });
      }
    } catch (_) {
      // ignore network errors on logout
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setUser(null);
    setAccessToken(null);
  }, []);

  const value = {
    user,
    accessToken,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
