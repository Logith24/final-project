import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      localStorage.removeItem("auth");
    }
  }, []);

  const login = useCallback((data) => {
    const payload = { name: data.name, email: data.email, loggedIn: true };
    localStorage.setItem("auth", JSON.stringify(payload));
    setUser(payload);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
