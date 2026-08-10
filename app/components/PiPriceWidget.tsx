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
  const [history, setHistory] = useState<number[]>([]);
  const [connected, setConnected] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [flash, setFlash] = useState<
    "up" | "down" | null
  >(null);

  const prevPriceRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    let flashTimer: ReturnType<typeof setTimeout> | null =
      null;

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

        if (!mounted) return;

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
        setConnected(true);
        setUpdatedAt(
          data.updated_at ?? null
        );

        setHistory((prev) =>
          [...prev, nextPrice].slice(-60)
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

  const graphColor = isUp
    ? "#10b981"
    : "#ef4444";

  const textColor = isUp
    ? "text-emerald-500"
    : "text-red-500";

  const formattedPrice =
    price.toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });

  const formatMarketValue = (
    value: number
  ) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });

  const updatedTime = updatedAt
    ? new Date(
        updatedAt
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-black/[0.06]
        bg-white
        shadow-sm
        dark:border-white/[0.08]
        dark:bg-[#11151d]
      "
    >
      <div className="relative z-10 px-3.5 py-3">
        <div className="flex items-center gap-3">
          {/* PI ICON */}
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#f5b800]
              text-white
              shadow-sm
            "
          >
            <span className="text-lg font-black">
              π
            </span>
          </div>

          {/* MARKET INFO */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className="
                  text-sm
                  font-bold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                "
              >
                PI / USDT
              </span>

              <span
                className={`
                  h-1.5
                  w-1.5
                  rounded-full
                  ${
                    connected
                      ? "bg-emerald-500"
                      : "bg-red-500"
                  }
                `}
              />
            </div>

            <div className="mt-0.5 flex items-baseline gap-2">
              <span
                className={`
                  text-xl
                  font-black
                  tracking-tight
                  text-slate-950
                  transition-transform
                  duration-300
                  dark:text-white
                  ${
                    flash === "up"
                      ? "scale-[1.03]"
                      : ""
                  }
                  ${
                    flash === "down"
                      ? "scale-[0.97]"
                      : ""
                  }
                `}
              >
                $
                {formattedPrice}
              </span>

              <span
                className={`
                  text-xs
                  font-bold
                  ${textColor}
                `}
              >
                {isUp ? "+" : ""}
                {change.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* MINI CHANGE */}
          <div
            className={`
              flex
              shrink-0
              items-center
              gap-1
              rounded-full
              px-2
              py-1
              text-xs
              font-bold
              ${
                isUp
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              }
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

        {/* MINI CHART */}
        <div className="mt-2">
          <PiTradingChart
            data={history}
            color={graphColor}
          />
        </div>

        {/* MARKET META */}
        <div
          className="
            mt-1
            flex
            items-center
            justify-between
            gap-2
            border-t
            border-black/[0.06]
            pt-2
            text-[10px]
            font-medium
            text-slate-500
            dark:border-white/[0.06]
            dark:text-white/45
          "
        >
          <span>
            H {formatMarketValue(high24h)}
          </span>

          <span>
            L {formatMarketValue(low24h)}
          </span>

          <span className="flex items-center gap-1">
            <span
              className={`
                h-1.5
                w-1.5
                rounded-full
                ${
                  connected
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }
              `}
            />

            {connected
              ? t.realtime_connected ??
                "LIVE"
              : t.disconnected ??
                "OFFLINE"}
          </span>

          <span className="flex items-center gap-1">
            <RefreshCw size={10} />
            {updatedTime}
          </span>
        </div>
      </div>
    </div>
  );
}
