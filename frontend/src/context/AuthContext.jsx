import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("mm_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("mm_user");
    return raw ? JSON.parse(raw) : null;
  });

  const persist = (data) => {
    localStorage.setItem("mm_token", data.token);
    localStorage.setItem("mm_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    persist(res.data);
  };

  const signup = async (email, password, confirmPassword) => {
    const res = await registerUser({ email, password, confirmPassword });
    persist(res.data);
  };

  const logout = () => {
    localStorage.removeItem("mm_token");
    localStorage.removeItem("mm_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
