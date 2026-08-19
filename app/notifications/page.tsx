"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  BellOff,
  ChevronRight,
  CircleAlert,
  Package,
  RefreshCcw,
  RotateCcw,
  Star,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useTranslationClient as useTranslation } from "@/app/lib/i18n/client";
import { apiAuthFetch } from "@/lib/api/apiAuthFetch";
import { useAuth } from "@/context/AuthContext";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date?: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string | null;
  action_type?: string | null;
  action_url?: string | null;
  category?: string | null;
  type?: string | null;
  is_read?: boolean;
}

type NotificationVisual = {
  Icon: LucideIcon;
  accentClassName: string;
  surfaceClassName: string;
};

function getNotificationDateValue(
  notification: NotificationItem
) {
  return (
    notification.date ??
    notification.created_at ??
    notification.updated_at
  );
}

function formatDate(
  value: string | undefined,
  fallback: string
) {
  if (!value) {
    return fallback;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  return parsed.toLocaleString(
    undefined
  );
}

function getNotificationVisual(
  notification: NotificationItem
): NotificationVisual {
  const normalizedCategory =
    notification.category?.toLowerCase() ?? "";
  const normalizedType =
    notification.type?.toLowerCase() ?? "";

  if (
    normalizedCategory === "wallet"
  ) {
    return {
      Icon: Wallet,
      accentClassName:
        "text-emerald-600 dark:text-emerald-300",
      surfaceClassName:
        "bg-emerald-500/10 ring-1 ring-emerald-500/20",
    };
  }

  if (
    normalizedType.includes("return")
  ) {
    return {
      Icon: RotateCcw,
      accentClassName:
        "text-violet-600 dark:text-violet-300",
      surfaceClassName:
        "bg-violet-500/10 ring-1 ring-violet-500/20",
    };
  }

  if (
    normalizedType.includes("review")
  ) {
    return {
      Icon: Star,
      accentClassName:
        "text-amber-600 dark:text-amber-300",
      surfaceClassName:
        "bg-amber-500/10 ring-1 ring-amber-500/20",
    };
  }

  if (
    normalizedCategory === "order" ||
    normalizedType.includes("order")
  ) {
    return {
      Icon: Package,
      accentClassName:
        "text-sky-600 dark:text-sky-300",
      surfaceClassName:
        "bg-sky-500/10 ring-1 ring-sky-500/20",
    };
  }

  return {
    Icon: Bell,
    accentClassName:
      "text-orange-600 dark:text-orange-300",
    surfaceClassName:
      "bg-orange-500/10 ring-1 ring-orange-500/20",
  };
}

function NotificationSkeleton() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--nav-bg)]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3 rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-3 shadow-sm">
            <div className="h-11 w-11 shrink-0 rounded-2xl bg-[var(--card-secondary)]" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-5 w-36 animate-pulse rounded-full bg-[var(--card-secondary)]" />
              <div className="h-3 w-24 animate-pulse rounded-full bg-[var(--card-secondary)]" />
            </div>

            <div className="h-10 w-10 rounded-2xl bg-[var(--card-secondary)]" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-4 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-[var(--card-secondary)]" />

              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="h-4 w-40 rounded-full bg-[var(--card-secondary)]" />
                  <div className="h-4 w-24 rounded-full bg-[var(--card-secondary)]" />
                </div>

                <div className="space-y-2">
                  <div className="h-3 w-full rounded-full bg-[var(--card-secondary)]" />
                  <div className="h-3 w-4/5 rounded-full bg-[var(--card-secondary)]" />
                </div>

                <div className="flex gap-2">
                  <div className="h-8 w-20 rounded-full bg-[var(--card-secondary)]" />
                  <div className="h-8 w-24 rounded-full bg-[var(--card-secondary)]" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function NotificationErrorState({
  error,
  retryLabel,
  onRetry,
}: {
  error: string;
  retryLabel: string;
  onRetry: () => void;
}) {
  return (
    <section
      className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 shadow-sm"
      role="alert"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/15 text-red-500">
          <CircleAlert
            aria-hidden="true"
            size={20}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-red-600 dark:text-red-300">
            {error}
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-2xl border border-red-500/20 bg-[var(--card-bg)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-red-500/30 hover:bg-red-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
          >
            <RefreshCcw
              aria-hidden="true"
              size={16}
            />
            {retryLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

function NotificationEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-bg)] px-6 py-14 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/15">
        <BellOff
          aria-hidden="true"
          size={28}
        />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-[var(--foreground)]">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--text-muted)]">
        {description}
      </p>
    </section>
  );
}

function NotificationCard({
  notification,
  unknownTimeLabel,
  viewLabel,
}: {
  notification: NotificationItem;
  unknownTimeLabel: string;
  viewLabel: string;
}) {
  const isUnread =
    notification.is_read === false;
  const { Icon, accentClassName, surfaceClassName } =
    getNotificationVisual(notification);
  const formattedDate = formatDate(
    getNotificationDateValue(
      notification
    ),
    unknownTimeLabel
  );

  return (
    <article
      className={[
        "group rounded-[1.75rem] border bg-[var(--card-bg)] p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md",
        isUnread
          ? "border-orange-500/25 ring-1 ring-orange-500/10"
          : "border-[var(--border)]",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <div
            className={[
              "flex h-12 w-12 items-center justify-center rounded-2xl",
              surfaceClassName,
            ].join(" ")}
          >
            <Icon
              aria-hidden="true"
              size={20}
              className={accentClassName}
            />
          </div>

          {isUnread && (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-[var(--card-bg)] bg-orange-500"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2
                className={[
                  "text-sm leading-6 text-[var(--foreground)]",
                  isUnread
                    ? "font-semibold"
                    : "font-medium",
                ].join(" ")}
              >
                {notification.title}
              </h2>

              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--text-muted)]">
                {notification.message}
              </p>
            </div>

            <time
              dateTime={
                getNotificationDateValue(
                  notification
                ) ?? undefined
              }
              className="shrink-0 rounded-full bg-[var(--card-secondary)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)]"
            >
              {formattedDate}
            </time>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              aria-hidden="true"
              className={[
                "inline-flex min-h-9 items-center rounded-full px-3 py-1.5 text-xs font-semibold",
                isUnread
                  ? "bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/15 dark:text-orange-300"
                  : "bg-[var(--card-secondary)] text-[var(--text-muted)]",
              ].join(" ")}
            >
              <span
                className={[
                  "mr-2 inline-block h-2 w-2 rounded-full",
                  isUnread
                    ? "bg-orange-500"
                    : "bg-[var(--text-muted)]/50",
                ].join(" ")}
              />
            </span>

            {notification.action_url && (
              <Link
                href={notification.action_url}
                className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-orange-500/30 hover:bg-orange-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
              >
                {viewLabel}
                <ChevronRight
                  aria-hidden="true"
                  size={16}
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function NotificationsPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } =
    useAuth();
  const router = useRouter();

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");
  const isMountedRef =
    useRef(true);

  const notificationsLabel =
    t.notifications ??
    "Notifications";
  const noNotificationsLabel =
    t.no_notifications ??
    "No notifications";
  const noNotificationsDescription =
    t.no_notifications_desc ??
    "You do not have any notifications yet.";
  const unknownTimeLabel =
    t.unknown_time ??
    "Unknown time";
  const fetchErrorLabel =
    t.fetch_error ??
    "Failed to load notifications";
  const backLabel =
    t.back ?? "Back";
  const retryLabel =
    t.retry ?? "Retry";
  const viewLabel =
    t.view ?? "View";

  const fetchNotifications =
    useCallback(async () => {
      if (authLoading) {
        return;
      }

      if (!user) {
        if (isMountedRef.current) {
          setNotifications([]);
          setError("");
          setLoading(false);
        }
        return;
      }

      try {
        if (isMountedRef.current) {
          setLoading(true);
          setError("");
        }

        const res = await apiAuthFetch(
          "/api/notifications",
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(
            `HTTP_${res.status}`
          );
        }

        const data = await res.json();

        if (
          !data ||
          !Array.isArray(data.notifications)
        ) {
          throw new Error(
            "INVALID_RESPONSE"
          );
        }

        if (isMountedRef.current) {
          setNotifications(
            data.notifications
          );
        }

        await apiAuthFetch(
          "/api/notifications",
          {
            method: "POST",
          }
        );
      } catch (err) {
        console.error(
          "❌ Notifications fetch error:",
          err
        );

        if (isMountedRef.current) {
          setError(fetchErrorLabel);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    }, [
      authLoading,
      fetchErrorLabel,
      user,
    ]);

  useEffect(() => {
    isMountedRef.current = true;
    void fetchNotifications();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchNotifications]);

  const sortedNotifications =
    useMemo(() => {
      return [...notifications].sort(
        (a, b) => {
          const aTime = new Date(
            getNotificationDateValue(a) ??
              0
          ).getTime();
          const bTime = new Date(
            getNotificationDateValue(b) ??
              0
          ).getTime();

          return bTime - aTime;
        }
      );
    }, [notifications]);

  const unreadCount = useMemo(
    () =>
      sortedNotifications.filter(
        (notification) =>
          notification.is_read === false
      ).length,
    [sortedNotifications]
  );

  if (loading) {
    return <NotificationSkeleton />;
  }

  return (
    <main className="min-h-screen bg-[var(--background)] pb-32 text-[var(--foreground)] transition-colors duration-300">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--nav-bg)]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3 rounded-[1.75rem] border border-[var(--border)] bg-[var(--card-bg)] p-3 shadow-sm">
            <button
              type="button"
              aria-label={backLabel}
              onClick={() => router.back()}
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] transition hover:border-orange-500/30 hover:bg-orange-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 active:scale-95"
            >
              <ArrowLeft
                aria-hidden="true"
                size={18}
              />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/15">
                  <Bell
                    aria-hidden="true"
                    size={20}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="truncate text-lg font-semibold tracking-tight text-[var(--foreground)] sm:text-xl">
                    {notificationsLabel}
                  </h1>

                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {sortedNotifications.length}{" "}
                    {notificationsLabel}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={[
                "flex h-11 min-w-11 items-center justify-center rounded-2xl border px-3",
                unreadCount > 0
                  ? "border-orange-500/15 bg-orange-500/5"
                  : "border-[var(--border)] bg-[var(--background)]",
              ].join(" ")}
            >
              <span
                className={[
                  "text-sm font-semibold",
                  unreadCount > 0
                    ? "text-orange-600 dark:text-orange-300"
                    : "text-[var(--text-muted)]",
                ].join(" ")}
              >
                {sortedNotifications.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <section
          aria-live="polite"
          aria-label={notificationsLabel}
          className="space-y-4"
        >
          {error ? (
            <NotificationErrorState
              error={error}
              retryLabel={retryLabel}
              onRetry={() => {
                void fetchNotifications();
              }}
            />
          ) : null}

          {!error &&
          sortedNotifications.length === 0 ? (
            <NotificationEmptyState
              title={noNotificationsLabel}
              description={
                noNotificationsDescription
              }
            />
          ) : null}

          {!error &&
          sortedNotifications.length > 0 ? (
            <ul className="space-y-4">
              {sortedNotifications.map(
                (notification) => (
                  <li key={notification.id}>
                    <NotificationCard
                      notification={
                        notification
                      }
                      unknownTimeLabel={
                        unknownTimeLabel
                      }
                      viewLabel={
                        viewLabel
                      }
                    />
                  </li>
                )
              )}
            </ul>
          ) : null}
        </section>
      </div>
    </main>
  );
}