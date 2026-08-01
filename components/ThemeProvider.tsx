"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  applyTheme,
  getSavedMode,
  ThemeRole,
} from "@/lib/theme";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const role: ThemeRole =
      pathname.startsWith("/seller")
        ? "seller"
        : "customer";

    // áp dụng ngay khi mount hoặc đổi route
    applyTheme(
      role,
      getSavedMode()
    );

    const onStorage = () => {
      applyTheme(
        role,
        getSavedMode()
      );
    };

    window.addEventListener(
      "storage",
      onStorage
    );

    return () =>
      window.removeEventListener(
        "storage",
        onStorage
      );
  }, [pathname]);

  return <>{children}</>;
}