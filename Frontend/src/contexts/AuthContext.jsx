/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";
import { authApi, removeToken } from "../lib/api";
import { connectSocket, disconnectSocket } from "../lib/socket";

export const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  guestLogin: () => {},
  setUser: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("focus_token");
      if (token) {
        try {
          const userData = await authApi.me();
          setUser(userData);
          // Connect socket on auth
          connectSocket(userData.id);
        } catch (error) {
          console.error("Auth check failed:", error);
          removeToken();
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  async function signIn({ email, password }) {
    const userData = await authApi.login(email, password);
    setUser(userData);
    // Connect socket on login
    connectSocket(userData.id);
    return userData;
  }

  async function signUp({ name, email, password }) {
    const userData = await authApi.signup(name, email, password);
    setUser(userData);
    // Connect socket on signup
    connectSocket(userData.id);
    return userData;
  }

  function signOut() {
    authApi.logout();
    disconnectSocket();
    setUser(null);
  }

  // Guest login for backwards compatibility
  async function guestLogin() {
    const guestUser = { name: "Guest", email: "", isGuest: true };
    setUser(guestUser);
    return guestUser;
  }

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        guestLogin,
        setUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
