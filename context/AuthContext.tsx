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
  is_admin: boolean;
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
     * Pi Browser SDK cĂ³ thá»ƒ Ä‘Æ°á»£c load sau React.
     * piReady chá»‰ biá»ƒu thá»‹ SDK sáºµn sĂ ng,
     * khĂ´ng quyáº¿t Ä‘á»‹nh OAuth browser cĂ³ Ä‘Äƒng nháº­p hay khĂ´ng.
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
         * KhĂ´ng tá»± báº­t Pi.authenticate khi ngÆ°á»i dĂ¹ng
         * chÆ°a cĂ³ phiĂªn Ä‘Äƒng nháº­p.
         *
         * Pi Browser má»›i váº«n pháº£i Ä‘Äƒng nháº­p qua pilogin().
         * Browser OAuth callback cÅ©ng lÆ°u token á»Ÿ Ä‘Ă¢y.
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
         * getPiAccessToken() sáº½:
         *
         * - Browser OAuth:
         *   verify stored token qua Pi /v2/me.
         *
         * - Pi Browser:
         *   sá»­ dá»¥ng stored token hiá»‡n táº¡i.
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
         * Token cÅ©/khĂ´ng há»£p lá»‡.
         * KhĂ´ng gá»i logout() vĂ¬ logout xĂ³a cáº£ cart.
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
     * pilogin() nĂ y lĂ  Pi SDK login.
     * Browser thÆ°á»ng báº¯t Ä‘áº§u OAuth táº¡i /pilogin/page.tsx,
     * khĂ´ng Ä‘i qua hĂ m nĂ y náº¿u khĂ´ng cĂ³ SDK.
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
        "đŸŸ¢ LOGIN SUCCESS"
      );
    } catch (err) {
      console.error(
        "âŒ LOGIN ERROR:",
        err
      );
    } finally {
      loginRef.current = false;
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */

  const logout = () => {
    console.log("đŸ”´ LOGOUT");

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

