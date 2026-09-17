import { createContext, useContext, useState } from "react";
import { setAccessToken } from "../api/axiosInstance";
import { logoutUser } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Called once verify-otp or login succeeds. The refresh token itself is
  // an httpOnly cookie set by the server — only the access token and user
  // are handled here.
  const login = (userData, accessToken) => {
    setAccessToken(accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    // Best-effort — revokes the refresh token server-side, but the client
    // is always logged out locally regardless of whether this succeeds.
    logoutUser().catch(() => {});
    setAccessToken(null);
    localStorage.removeItem("user");
    setUser(null);
  };

  // Merge partial updates (e.g. after a resume/identity upload) into the
  // stored user object without needing a full re-login.
  const updateUser = (patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
