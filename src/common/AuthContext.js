"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  loginWithEmailPassword,
  loginWithOtp,
  loginWithOAuth,
  logoutService,
} from "@/services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const saveSession = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const emailLogin = async (identifier, password) => {
    const data = await loginWithEmailPassword(identifier, password);
    if (data?.success) {
      saveSession(data.user, data.accessToken);
    }
    return data;
  };

  const otpLogin = async (mobile, otp) => {
    const data = await loginWithOtp(mobile, otp);
    if (data?.success) saveSession(data.user, data.accessToken);
    return data;
  };

  const oAuthLogin = async (provider, providerToken) => {
    const data = await loginWithOAuth(provider, providerToken);
    if (data?.success) saveSession(data.user, data.accessToken);
    return data;
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  const logout = async () => {
    try {
      const data = await logoutService();
      clearSession();
      return data;
    } catch (error) {
      clearSession();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, emailLogin, otpLogin, oAuthLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
};