"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

import {
  getPiAccessToken,
  clearPiToken,
} from "@/lib/piAuth";

/* ========================= TYPES ========================= */

export type PiUser = {
  id: string;
  pi_uid: string;
  username: string;
  wallet_address?: string | null;
  role?: string;
};

type AuthContextType = {
  user: PiUser | null;
  loading: boolean;
  piReady: boolean;
  pilogin: () => Promise<void>;
  logout: () => void;
};

const USER_KEY = "pi_user";
const TOKEN_KEY = "pi_access_token";

const AuthContext =
  createContext<AuthContextType>({
    user: null,
    loading: true,
    piReady: false,
    pilogin: async () => {},
    logout: () => {},
  });

/* ========================= PROVIDER ========================= */

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<PiUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [piReady, setPiReady] =
    useState(false);

  const loginRef = useRef(false);

  /* ================= PI READY ================= */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    /*
     * Pi Browser SDK có thể được load sau React.
     * piReady chỉ biểu thị SDK sẵn sàng,
     * không quyết định OAuth browser có đăng nhập hay không.
     */
    if (window.Pi) {
      setPiReady(true);
      return;
    }

    const timer = window.setInterval(
      () => {
        if (window.Pi) {
          setPiReady(true);
          window.clearInterval(timer);
        }
      },
      300
    );

    return () =>
      window.clearInterval(timer);
  }, []);

  /* ================= VERIFY USER ================= */

  const verifyToken = async (
    token: string
  ): Promise<PiUser> => {
    const res = await fetch(
      "/api/pi/verify",
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(
        "VERIFY_FAILED"
      );
    }

    const data: unknown =
      await res.json();

    if (
      typeof data !== "object" ||
      data === null ||
      !("user" in data)
    ) {
      throw new Error(
        "VERIFY_FAILED"
      );
    }

    const verifiedUser =
      (data as { user: PiUser }).user;

    if (!verifiedUser) {
      throw new Error(
        "VERIFY_FAILED"
      );
    }

    return verifiedUser;
  };

  /* ================= INIT ================= */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const initAuth = async () => {
      try {
        /*
         * Không tự bật Pi.authenticate khi người dùng
         * chưa có phiên đăng nhập.
         *
         * Pi Browser mới vẫn phải đăng nhập qua pilogin().
         * Browser OAuth callback cũng lưu token ở đây.
         */
        const storedToken =
          localStorage.getItem(
            TOKEN_KEY
          );

        if (!storedToken) {
          setUser(null);
          return;
        }

        /*
         * getPiAccessToken() sẽ:
         *
         * - Browser OAuth:
         *   verify stored token qua Pi /v2/me.
         *
         * - Pi Browser:
         *   sử dụng stored token hiện tại.
         */
        const token =
          await getPiAccessToken();

        const verifiedUser =
          await verifyToken(token);

        setUser(verifiedUser);

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(
            verifiedUser
          )
        );
      } catch {
        /*
         * Token cũ/không hợp lệ.
         * Không gọi logout() vì logout xóa cả cart.
         */
        clearPiToken();

        localStorage.removeItem(
          USER_KEY
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void initAuth();
  }, []);

  /* ================= LOGIN ================= */

  const pilogin = async () => {
    /*
     * pilogin() này là Pi SDK login.
     * Browser thường bắt đầu OAuth tại /pilogin/page.tsx,
     * không đi qua hàm này nếu không có SDK.
     */
    if (!piReady || !window.Pi) {
      return;
    }

    if (loginRef.current) {
      return;
    }

    loginRef.current = true;

    try {
      setLoading(true);

      const token =
        await getPiAccessToken();

      const verifiedUser =
        await verifyToken(token);

      setUser(verifiedUser);

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(
          verifiedUser
        )
      );

      sessionStorage.removeItem(
        "cart_merged"
      );

      console.log(
        "🟢 LOGIN SUCCESS"
      );
    } catch (err) {
      console.error(
        "❌ LOGIN ERROR:",
        err
      );
    } finally {
      loginRef.current = false;
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */

  const logout = () => {
    console.log("🔴 LOGOUT");

    localStorage.removeItem(
      USER_KEY
    );

    localStorage.removeItem(
      "cart"
    );

    sessionStorage.removeItem(
      "cart_merged"
    );

    clearPiToken();

    setUser(null);
  };

  /* ================= PROVIDER ================= */

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        piReady,
        pilogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================= HOOK ================= */

export const useAuth = () =>
  useContext(AuthContext);
