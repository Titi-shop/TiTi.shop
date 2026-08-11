

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Grid2X2,
  Search,
  Bell,
  User,
} from "lucide-react";

import {
  useTranslationClient as useTranslation,
} from "@/app/lib/i18n/client";

import {
  useEffect,
  useState,
} from "react";

import { apiAuthFetch } from "@/lib/api/apiAuthFetch";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
  badge?: number;
}

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const {
    user,
    loading,
  } = useAuth();

  const [hidden, setHidden] =
    useState(false);

  const [unreadCount, setUnreadCount] =
    useState(0);

  /*
   * =====================================================
   * UNREAD NOTIFICATIONS
   * =====================================================
   */

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      setUnreadCount(0);
      return;
    }

    let cancelled = false;

    async function loadUnreadCount() {
      try {
        const res =
          await apiAuthFetch(
            "/api/notifications"
          );

        if (!res.ok) {
          return;
        }

        const data =
          await res.json();

        if (cancelled) {
          return;
        }

        const count = Number(
          data.unreadCount ?? 0
        );

        setUnreadCount(
          Number.isFinite(count) &&
            count > 0
            ? count
            : 0
        );
      } catch (err) {
        if (!cancelled) {
          console.error(
            "[BOTTOM_NAV]",
            err
          );
        }
      }
    }

    void loadUnreadCount();

    return () => {
      cancelled = true;
    };
  }, [
    loading,
    user,
  ]);

  /*
   * =====================================================
   * HIDE ON DOWN-SCROLL
   * =====================================================
   */

  useEffect(() => {
    let lastScrollY =
      window.scrollY;

    const onScroll = () => {
      const current =
        window.scrollY;

      /*
       * Ignore tiny movements.
       * This prevents the navbar from
       * flickering on mobile browsers.
       */
      const delta =
        current - lastScrollY;

      if (Math.abs(delta) < 8) {
        return;
      }

      if (
        current > lastScrollY &&
        current > 80
      ) {
        setHidden(true);
      } else if (
        current < lastScrollY
      ) {
        setHidden(false);
      }

      lastScrollY = current;
    };

    window.addEventListener(
      "scroll",
      onScroll,
      {
        passive: true,
      }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        onScroll
      );
  }, []);

  /*
   * =====================================================
   * NAVIGATION
   * =====================================================
   */

  const navItems: NavItem[] = [
    {
      href: "/",
      label:
        t.home || "Home",
      icon: Home,
    },
    {
      href: "/categories",
      label:
        t.categories ||
        "Categories",
      icon: Grid2X2,
    },
    {
      href: "/search",
      label:
        t.search || "Search",
      icon: Search,
    },
    {
      href: "/notifications",
      label:
        t.notifications ||
        "Notifications",
      icon: Bell,
      badge:
        unreadCount > 0
          ? unreadCount
          : undefined,
    },
    {
      href: "/account",
      label:
        t.me || "Me",
      icon: User,
    },
  ];

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <>
      {/*
       * Reserve exactly the same minimum
       * space as the fixed navigation.
       *
       * This prevents page content from
       * being hidden behind the navbar.
       */}
      <div
        className="
          h-[82px]
          w-full
          shrink-0
        "
        aria-hidden="true"
      />

      <nav
        aria-label="Bottom navigation"
        className={`
          fixed
          bottom-0
          left-0
          right-0
          z-[80]
          transform-gpu
          transition-transform
          duration-300
          ease-out
          ${
            hidden
              ? "translate-y-full"
              : "translate-y-0"
          }
        `}
        style={{
          backgroundColor:
            "var(--nav-bg)",

          color:
            "var(--nav-text)",

          borderTop:
            "1px solid var(--nav-border)",

          paddingBottom:
            "env(safe-area-inset-bottom)",
        }}
      >
        <div
          className="
            mx-auto
            w-full
            max-w-md
          "
        >
          <div
            className="
              grid
              h-[76px]
              w-full
              grid-cols-5
              items-stretch
              px-1
            "
          >
            {navItems.map(
              ({
                href,
                label,
                icon: Icon,
                badge,
              }) => {
                const active =
                  pathname === href ||
                  (
                    href !== "/" &&
                    pathname.startsWith(
                      href
                    )
                  );

                const iconColor =
                  active
                    ? "var(--nav-active)"
                    : "var(--nav-muted)";

                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={
                      active
                        ? "page"
                        : undefined
                    }
                    className="
                      relative
                      flex
                      min-w-0
                      flex-1
                      flex-col
                      items-center
                      justify-center
                      gap-1
                      rounded-xl
                      px-0.5
                      py-2
                      transition
                      active:scale-95
                    "
                  >
                    {/* ACTIVE BACKGROUND */}

                    <span
                      className={`
                        absolute
                        inset-x-1
                        top-1/2
                        h-11
                        -translate-y-1/2
                        rounded-2xl
                        transition
                        ${
                          active
                            ? "bg-[var(--nav-active)]/10"
                            : "bg-transparent"
                        }
                      `}
                      aria-hidden="true"
                    />

                    {/* ICON */}

                    <span
                      className="
                        relative
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                      "
                    >
                      <Icon
                        size={24}
                        strokeWidth={
                          active
                            ? 2.5
                            : 2
                        }
                        style={{
                          color:
                            iconColor,
                        }}
                      />

                      {/* BADGE */}

                      {badge !==
                        undefined &&
                        badge > 0 && (
                          <span
                            className="
                              absolute
                              -right-1
                              -top-1
                              flex
                              h-[17px]
                              min-w-[17px]
                              items-center
                              justify-center
                              rounded-full
                              bg-red-500
                              px-1
                              text-[9px]
                              font-bold
                              leading-none
                              text-white
                              shadow-sm
                            "
                          >
                            {badge >
                            99
                              ? "99+"
                              : badge}
                          </span>
                        )}
                    </span>

                    {/* LABEL */}

                    <span
                      className="
                        relative
                        max-w-full
                        truncate
                        px-0.5
                        text-center
                        text-[11px]
                        font-medium
                        leading-tight
                      "
                      style={{
                        color:
                          iconColor,
                      }}
                    >
                      {label}
                    </span>
                  </Link>
                );
              }
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
