import { createContext, useContext, useEffect, useState } from "react";

import api, { extractErrorMessage } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("pulse_token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("pulse_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(Boolean(token));

  const persistSession = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem("pulse_user", JSON.stringify(nextUser));
    localStorage.setItem("pulse_token", nextToken);
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("pulse_user");
    localStorage.removeItem("pulse_token");
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/users/me");
      const profile = response.data.data;
      setUser(profile);
      localStorage.setItem("pulse_user", JSON.stringify(profile));
      return profile;
    } catch (error) {
      clearSession();
      throw error;
    }
  };

  const login = async (values) => {
    const response = await api.post("/auth/login", values);
    const payload = response.data.data;
    persistSession(payload.user, payload.token);
    await fetchCurrentUser();
    return payload.user;
  };

  const register = async (values) => {
    const response = await api.post("/auth/register", values);
    const payload = response.data.data;
    persistSession(payload.user, payload.token);
    await fetchCurrentUser();
    return payload.user;
  };

  const logout = () => {
    clearSession();
  };

  const refreshUser = async () => {
    if (!token) {
      return null;
    }

    return fetchCurrentUser();
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        await fetchCurrentUser();
      } catch (error) {
        console.error(extractErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
