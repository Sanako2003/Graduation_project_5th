"use client";

import { createContext, useContext, useEffect, useState } from "react";

type UserData = { name: string; email: string; role?: string };

type AuthContextType = {
  user: UserData | null;
  setUser: (u: UserData | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUserState(JSON.parse(stored));
  }, []);

  const setUser = (u: UserData | null) => {
    setUserState(u);
    if (u) {
      localStorage.setItem("user", JSON.stringify(u));
      // نحط الـ user في cookie عشان الـ middleware يقدر يقراه
      document.cookie = `user=${encodeURIComponent(JSON.stringify(u))}; path=/; max-age=${60 * 60 * 24 * 7}`;
    } else {
      localStorage.removeItem("user");
      document.cookie = "user=; path=/; max-age=0";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "user=; path=/; max-age=0";
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
