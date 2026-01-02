import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  user: null,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("focus_user_v1");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.error("Error loading user:", e);
    }
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem("focus_user_v1", JSON.stringify(user));
      else localStorage.removeItem("focus_user_v1");
    } catch (e) {
      console.error("Error saving user:", e);
    }
  }, [user]);

  function signIn({ name, email }) {
    setUser({ name, email });
  }

  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
