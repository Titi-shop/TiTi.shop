"use client";

import {
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useTranslationClient as useTranslation } from "@/app/lib/i18n/client";
import PiTradingChart from "./PiTradingChart";

interface PiPriceResponse {
  symbol: string;
  price_usd: number;
  change_24h: number | null;
  high_24h?: number;
  low_24h?: number;
  volume_24h?: number;
  updated_at?: string;
}

export default function PiPriceWidget() {
  const { t } = useTranslation();

  const [price, setPrice] = useState(0);
  const [change, setChange] = useState(0);
  const [high24h, setHigh24h] = useState(0);
  const [low24h, setLow24h] = useState(0);
  const [volume24h, setVolume24h] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [connected, setConnected] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(
    null
  );

  const [flash, setFlash] = useState<
    "up" | "down" | null
  >(null);

  const prevPriceRef = useRef(0);

  useEffect(() => {
    let mounted = true;

    let flashTimer:
      | ReturnType<typeof setTimeout>
      | null = null;

    const fetchPrice = async () => {
      try {
        const res = await fetch("/api/pi-price", {
          cache: "no-store",
        });

        if (!res.ok) {
          if (mounted) {
            setConnected(false);
          }

          return;
        }

        const data: PiPriceResponse =
          await res.json();

        if (!mounted) {
          return;
        }

        const nextPrice = Number(
          data.price_usd ?? 0
        );

        const nextChange = Number(
          data.change_24h ?? 0
        );

        const nextHigh = Number(
          data.high_24h ?? 0
        );

        const nextLow = Number(
          data.low_24h ?? 0
        );

        const nextVolume = Number(
          data.volume_24h ?? 0
        );

        const oldPrice =
          prevPriceRef.current;

        if (oldPrice > 0) {
          if (nextPrice > oldPrice) {
            setFlash("up");
          } else if (
            nextPrice < oldPrice
          ) {
            setFlash("down");
          }

          if (flashTimer) {
            clearTimeout(flashTimer);
          }

          flashTimer = setTimeout(() => {
            if (mounted) {
              setFlash(null);
            }
          }, 450);
        }

        prevPriceRef.current =
          nextPrice;

        setPrice(nextPrice);
        setChange(nextChange);
        setHigh24h(nextHigh);
        setLow24h(nextLow);
        setVolume24h(nextVolume);
        setConnected(true);
        setUpdatedAt(
          data.updated_at ?? null
        );

        setHistory((previous) =>
          [...previous, nextPrice].slice(-60)
        );
      } catch (error) {
        console.error(
          "PI_PRICE_WIDGET_ERROR",
          error
        );

        if (mounted) {
          setConnected(false);
        }
      }
    };

    fetchPrice();

    const interval = setInterval(
      fetchPrice,
      2500
    );

    return () => {
      mounted = false;

      clearInterval(interval);

      if (flashTimer) {
        clearTimeout(flashTimer);
      }
    };
  }, []);

  const isUp = change >= 0;

  const chartColor = isUp
    ? "#22a879"
    : "#ef4444";

  const directionColor = isUp
    ? "text-emerald-600"
    : "text-red-500";

  const directionBackground = isUp
    ? "bg-emerald-50"
    : "bg-red-50";

  const formattedPrice =
    price.toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });

  const formatPrice = (
    value: number
  ) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });

  const formatVolume = (
    value: number
  ) => {
    if (!value) {
      return "0";
    }

    if (value >= 1_000_000) {
      return `${(
        value / 1_000_000
      ).toFixed(2)}M`;
    }

    if (value >= 1_000) {
      return `${(
        value / 1_000
      ).toFixed(2)}K`;
    }

    return value.toLocaleString(
      undefined,
      {
        maximumFractionDigits: 2,
      }
    );
  };

  const updatedTime = updatedAt
    ? new Date(
        updatedAt
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

  return (
    <section
      aria-label="PI market price"
      className="
        w-full
        rounded-[18px]
        border
        border-slate-200
        bg-white
        shadow-[0_3px_14px_rgba(15,23,42,0.06)]
        dark:border-white/10
        dark:bg-[#11151d]
        dark:shadow-none
      "
    >
      <div className="p-3.5 sm:p-4">
        {/* =========================================
            HEADER
        ========================================= */}

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {/* PI LOGO */}

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#f7b900]
                text-white
                shadow-[inset_0_-2px_0_rgba(0,0,0,0.08)]
              "
            >
              <span className="text-[20px] font-black leading-none">
                π
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2
                  className="
                    truncate
                    text-[15px]
                    font-bold
                    tracking-tight
                    text-slate-900
                    dark:text-white
                  "
                >
                  PI / USDT
                </h2>

                <span
                  className={`
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    ${
                      connected
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }
                  `}
                />
              </div>

              <span
                className="
                  text-[10px]
                  font-medium
                  text-slate-400
                  dark:text-white/40
                "
              >
                {connected
                  ? t.realtime_connected ??
                    "Realtime"
                  : t.disconnected ??
                    "Disconnected"}
              </span>
            </div>
          </div>

          {/* 24H CHANGE */}

          <div
            className={`
              flex
              shrink-0
              items-center
              gap-1
              rounded-full
              px-2.5
              py-1.5
              text-[12px]
              font-bold
              ${directionBackground}
              ${directionColor}
            `}
          >
            {isUp ? (
              <TrendingUp size={13} />
            ) : (
              <TrendingDown size={13} />
            )}

            <span>
              {isUp ? "+" : ""}
              {change.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* =========================================
            PRICE + MINI CHART
        ========================================= */}

        <div className="mt-2.5 flex items-center gap-3">
          {/* PRICE */}

          <div className="min-w-[128px] shrink-0">
            <div
              className={`
                text-[27px]
                font-black
                leading-none
                tracking-[-0.04em]
                text-slate-950
                transition-transform
                duration-300
                dark:text-white
                ${
                  flash === "up"
                    ? "scale-[1.025]"
                    : ""
                }
                ${
                  flash === "down"
                    ? "scale-[0.975]"
                    : ""
                }
              `}
            >
              $
              {formattedPrice}
            </div>

            <div
              className={`
                mt-1
                flex
                items-center
                gap-1
                text-[13px]
                font-semibold
                ${directionColor}
              `}
            >
              {isUp ? "↗" : "↘"}

              <span>
                {isUp ? "+" : ""}
                {change.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* MINI CHART */}

          <div className="min-w-0 flex-1">
            <PiTradingChart
              data={history}
              color={chartColor}
            />
          </div>
        </div>

        {/* =========================================
            MARKET DATA
        ========================================= */}

        <div
          className="
            mt-2
            grid
            grid-cols-4
            items-center
            gap-2
            border-t
            border-slate-100
            pt-2.5
            dark:border-white/[0.07]
          "
        >
          {/* HIGH */}

          <div className="min-w-0">
            <div
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-wide
                text-slate-400
                dark:text-white/35
              "
            >
              H
            </div>

            <div
              className="
                mt-0.5
                truncate
                text-[11px]
                font-semibold
                text-slate-700
                dark:text-white/70
              "
            >
              {formatPrice(high24h)}
            </div>
          </div>

          {/* LOW */}

          <div className="min-w-0">
            <div
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-wide
                text-slate-400
                dark:text-white/35
              "
            >
              L
            </div>

            <div
              className="
                mt-0.5
                truncate
                text-[11px]
                font-semibold
                text-slate-700
                dark:text-white/70
              "
            >
              {formatPrice(low24h)}
            </div>
          </div>

          {/* VOLUME */}

          <div className="min-w-0">
            <div
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-wide
                text-slate-400
                dark:text-white/35
              "
            >
              Vol
            </div>

            <div
              className="
                mt-0.5
                truncate
                text-[11px]
                font-semibold
                text-slate-700
                dark:text-white/70
              "
            >
              {formatVolume(volume24h)}
            </div>
          </div>

          {/* UPDATED */}

          <div className="min-w-0 text-right">
            <div
              className="
                flex
                items-center
                justify-end
                gap-1
                text-[9px]
                font-medium
                text-slate-400
                dark:text-white/35
              "
            >
              <RefreshCw size={9} />

              <span>
                {updatedTime}
              </span>
            </div>

            <div
              className="
                mt-0.5
                flex
                items-center
                justify-end
                gap-1
                text-[10px]
                font-semibold
                text-emerald-600
                dark:text-emerald-400
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span>
                {connected
                  ? "LIVE"
                  : "OFFLINE"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
