import { createContext, useContext, useState, useCallback } from "react";
import { fetchMe, login as loginApi, logout as logoutApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);


  const checkSession = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMe();
      setAdmin(data.admin);
      return data.admin;
    } catch {
      setAdmin(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await loginApi({ email, password });
    setAdmin(data.admin);
    return data;
  };

  const logout = async () => {
    await logoutApi();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, checkSession }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
