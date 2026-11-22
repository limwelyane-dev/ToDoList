import {
  createContext,
  useContext,
  useState,
} from "react";
import api, { setAuthToken } from "../api/axios";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const queryClient = useQueryClient();

  const saveSession = (data) => {
    setToken(data.token);
    setUser(data.user);
    setAuthToken(data.token);
  };

  const login = async (credentials) => {
    const { data } = await api.post(
      "/auth/login",
      credentials
    );

    saveSession(data);
    return data.user;
  };

  const register = async (details) => {
    const { data } = await api.post(
      "/auth/register",
      details
    );

    saveSession(data);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}