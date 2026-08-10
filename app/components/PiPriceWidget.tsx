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
import PiMarketScreen from "./PiMarket/PiMarketScreen";

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
const [marketOpen, setMarketOpen] = useState(false);
  const prevPriceRef = useRef(0);
  const fetchErrorLoggedRef = useRef(false);

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
          }, 400);
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
        fetchErrorLoggedRef.current = false;

        setHistory((previous) =>
          [...previous, nextPrice].slice(-50)
        );
      } catch (error) {
        if (!fetchErrorLoggedRef.current) {
          console.warn(
            "PI_PRICE_WIDGET_FETCH_FAILED",
            error instanceof Error
              ? error.message
              : "UNKNOWN_ERROR"
          );
          fetchErrorLoggedRef.current = true;
        }

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
  role="button"
  tabIndex={0}
  onClick={() => setMarketOpen(true)}
  onKeyDown={(event) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      setMarketOpen(true);
    }
  }}
  className="
    cursor-pointer
        relative
        left-1/2
        w-screen
        -translate-x-1/2
        border-y
        border-slate-200
        bg-white
        dark:border-white/[0.08]
        dark:bg-[#11151d]
        md:relative
        md:left-auto
        md:w-full
        md:translate-x-0
        md:rounded-2xl
        md:border
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          py-2
          sm:px-5
          md:px-4
        "
      >
        {/* MAIN ROW */}

        <div className="flex h-[47px] items-center gap-2.5">
          {/* PI MARK */}

          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#f7b900]
              text-white
            "
          >
            <span className="text-[16px] font-black">
              π
            </span>
          </div>

          {/* SYMBOL */}

          <div className="w-[66px] shrink-0">
            <div
              className="
                text-[12px]
                font-bold
                leading-none
                text-slate-900
                dark:text-white
              "
            >
              PI / USDT
            </div>

            <div
              className="
                mt-1
                flex
                items-center
                gap-1
                text-[8px]
                font-medium
                text-slate-400
              "
            >
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
                ? "LIVE"
                : "OFFLINE"}
            </div>
          </div>

          {/* PRICE */}

          <div
            className={`
              shrink-0
              text-[22px]
              font-black
              leading-none
              tracking-[-0.04em]
              text-slate-950
              transition-transform
              duration-300
              dark:text-white
              ${
                flash === "up"
                  ? "scale-[1.02]"
                  : ""
              }
              ${
                flash === "down"
                  ? "scale-[0.98]"
                  : ""
              }
            `}
          >
            ${formattedPrice}
          </div>

          {/* CHANGE */}

          <div
            className={`
              flex
              shrink-0
              items-center
              gap-0.5
              rounded-full
              px-1.5
              py-1
              text-[10px]
              font-bold
              ${directionBackground}
              ${directionColor}
            `}
          >
            {isUp ? (
              <TrendingUp size={10} />
            ) : (
              <TrendingDown size={10} />
            )}

            {isUp ? "+" : ""}
            {change.toFixed(2)}%
          </div>

          {/* CHART */}

          <div className="min-w-0 flex-1">
            <PiTradingChart
              data={history}
              color={chartColor}
            />
          </div>
        </div>

        {/* MARKET META */}

        <div
          className="
            flex
            h-[20px]
            items-center
            justify-between
            gap-2
            border-t
            border-slate-100
            pt-1
            text-[9px]
            font-medium
            text-slate-400
            dark:border-white/[0.06]
            dark:text-white/40
          "
        >
          <span>
            H {formatPrice(high24h)}
          </span>

          <span>
            L {formatPrice(low24h)}
          </span>

          <span className="hidden sm:inline">
            Vol {formatVolume(volume24h)}
          </span>

          <span className="flex items-center gap-1">
            <RefreshCw size={9} />
            {updatedTime}
          </span>

          <span
            className="
              flex
              items-center
              gap-1
              text-emerald-600
              dark:text-emerald-400
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            {connected
              ? t.realtime_connected ??
                "LIVE"
              : t.disconnected ??
                "OFFLINE"}
          </span>
        </div>
      </div>
        </section>

    {marketOpen && (
      <PiMarketScreen
        onClose={() => setMarketOpen(false)}
      />
    )}
  );
}
