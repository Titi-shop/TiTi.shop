"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getPiAccessToken } from "@/lib/piAuth";

/* =========================
   TYPES
========================= */
export type PiUser = {
  pi_uid: string;
  username: string;
  wallet_address?: string | null;
  role: "customer" | "seller" | "admin";
};

type AuthContextType = {
  user: PiUser | null;
  loading: boolean;
  piReady: boolean;
  pilogin: () => Promise<void>;
  logout: () => void;
};

const USER_KEY = "pi_user";

// 🔑 DEV flag (localhost / web thường)
const DEV_LOGIN = process.env.NEXT_PUBLIC_DEV_LOGIN === "true";

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  piReady: false,
  pilogin: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [piReady, setPiReady] = useState(false);

  /* -------------------------
     INIT PI SDK (chỉ để biết Pi có sẵn hay không)
  ------------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = setInterval(() => {
      if ((window as any).Pi) {
        setPiReady(true);
        clearInterval(timer);
      }
    }, 300);

    return () => clearInterval(timer);
  }, []);

  /* -------------------------
     LOAD USER (BOOTSTRAP)
     - DEV  : auto login giả
     - PROD : load user thật
  ------------------------- */
  useEffect(() => {
    try {
      // ✅ DEV / localhost → LOGIN GIẢ
      if (DEV_LOGIN) {
        const fakeUser: PiUser = {
          pi_uid: "dev-local-001",
          username: "hung12345",
          wallet_address: null,
          role: "admin",
        };

        localStorage.setItem(USER_KEY, JSON.stringify(fakeUser));
        setUser(fakeUser);
        return;
      }

      // 🔒 PROD / Pi Browser → load user thật (nếu có)
      const rawUser = localStorage.getItem(USER_KEY);
      if (rawUser) {
        setUser(JSON.parse(rawUser));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /* -------------------------
     LOGIN
     - DEV  : login giả
     - PI   : login Pi thật
  ------------------------- */
  const pilogin = async () => {
    setLoading(true);

    try {
      // 🧪 DEV LOGIN (ngoài Pi Browser)
      if (DEV_LOGIN || !(window as any).Pi) {
        const fakeUser: PiUser = {
          pi_uid: "dev-login-001",
          username: "hung12345",
          wallet_address: null,
          role: "admin",
        };

        localStorage.setItem(USER_KEY, JSON.stringify(fakeUser));
        setUser(fakeUser);
        return;
      }

      // 🔐 PI LOGIN THẬT
      const token = await getPiAccessToken();

      const res = await fetch("/api/pi/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success || !data?.user) {
        alert("❌ Pi verify thất bại");
        return;
      }

      const verifiedUser: PiUser = data.user;

      localStorage.setItem(USER_KEY, JSON.stringify(verifiedUser));
      setUser(verifiedUser);
    } catch (err) {
      console.error("❌ Login error:", err);
      alert("❌ Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     LOGOUT
  ------------------------- */
  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, piReady, pilogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
