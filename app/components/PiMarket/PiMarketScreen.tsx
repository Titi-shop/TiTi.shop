"use client";

import { Circle, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

import PiMarketChart, {
  PiMarketCandle,
} from "./PiMarketChart";

type Timeframe = "1H" | "4H" | "1D" | "7D" | "1M";

interface CandleResponse {
  symbol: string;
  timeframe: Timeframe;
  interval: string;
  source: string;
  candles: PiMarketCandle[];
}

interface CrosshairSnapshot {
  timeLabel: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PiMarketScreenProps {
  open: boolean;
  onClose: () => void;
  currentPrice: number;
  change24h: number;
}

const TIMEFRAMES: Timeframe[] = [
  "1H",
  "4H",
  "1D",
  "7D",
  "1M",
];

function formatPrice(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

function formatVolume(value: number): string {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

export default function PiMarketScreen({
  open,
  onClose,
  currentPrice,
  change24h,
}: PiMarketScreenProps) {
  const [timeframe, setTimeframe] =
    useState<Timeframe>("1D");

  const [candles, setCandles] = useState<
    PiMarketCandle[]
  >([]);

  const [selected, setSelected] =
    useState<CrosshairSnapshot | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  const fetchCandles = useCallback(
    async (
      signal: AbortSignal,
      nextTimeframe: Timeframe
    ) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/pi-price/candles?timeframe=${nextTimeframe}`,
          {
            method: "GET",
            cache: "no-store",
            signal,
          }
        );

        const payload = (await res.json()) as
          | CandleResponse
          | { error?: string };

        if (!res.ok) {
          throw new Error(
            "error" in payload && payload.error
              ? payload.error
              : "CANDLE_FETCH_FAILED"
          );
        }

        if (
          !("candles" in payload) ||
          !Array.isArray(payload.candles)
        ) {
          throw new Error("INVALID_CANDLE_RESPONSE");
        }

        setCandles(payload.candles);

        const latest =
          payload.candles[
            payload.candles.length - 1
          ];

        if (latest) {
          setSelected({
            timeLabel: new Date(
              latest.time * 1000
            ).toLocaleString(),
            open: latest.open,
            high: latest.high,
            low: latest.low,
            close: latest.close,
            volume: latest.volume,
          });
        } else {
          setSelected(null);
        }
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
          return;
        }

        setCandles([]);
        setSelected(null);
        setError(
          "Unable to load PI market candles."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const controller = new AbortController();

    fetchCandles(
      controller.signal,
      timeframe
    );

    return () => controller.abort();
  }, [
    open,
    timeframe,
    fetchCandles,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  const isPositive = change24h >= 0;

  const changeClass = isPositive
    ? "text-emerald-600"
    : "text-red-600";

  const selectedStats = useMemo(
    () => selected,
    [selected]
  );

  if (!open) {
    return null;
  }

  const screen = (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        bg-slate-900/40
      "
    >
      {/* BACKDROP */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* PI MARKET PANEL */}
      <div
        className="
          relative
          z-[10000]
          mx-auto
          flex
          h-dvh
          w-full
          max-w-[560px]
          flex-col
          overflow-hidden
          bg-white
          shadow-2xl
          pt-[env(safe-area-inset-top)]
          pb-[env(safe-area-inset-bottom)]
          dark:bg-[#0f1117]
        "
      >
        {/* HEADER */}
        <header
          className="
            relative
            z-10
            shrink-0
            border-b
            border-slate-200
            px-3
            pb-1.5
            pt-2
            dark:border-white/10
          "
        >
          <div className="flex items-center justify-between gap-3">
            {/* CLOSE */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng biểu đồ PI"
              className="
                relative
                z-20
                inline-flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-slate-200
                bg-white
                text-slate-700
                shadow-sm
                transition
                hover:bg-slate-50
                active:scale-95
                dark:border-white/10
                dark:bg-white/5
                dark:text-white
              "
            >
              <X
                size={20}
                strokeWidth={2.5}
              />
            </button>

            {/* TITLE */}
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Pi Market
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                PI / USDT
              </h2>
            </div>

            {/* LIVE */}
            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              <Circle
                size={8}
                className="fill-emerald-500 text-emerald-500"
              />
              Live
            </div>
          </div>

          <div className="mt-1">
            <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              ${formatPrice(currentPrice)}
            </p>

            <p
              className={`mt-1 text-sm font-semibold ${changeClass}`}
            >
              {change24h >= 0 ? "+" : ""}
              {change24h.toFixed(2)}% (24h)
            </p>
          </div>
        </header>

        {/* TIMEFRAME */}
        <div className="relative z-10 shrink-0 border-b border-slate-200 px-2 py-1.5 dark:border-white/10">
          <div className="grid grid-cols-5 gap-2">
            {TIMEFRAMES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setTimeframe(item)
                }
                className={`h-8 rounded-xl text-sm font-semibold transition ${
                  timeframe === item
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            px-2
            pb-3
            pt-1.5
          "
        >
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {loading ? (
              <div className="flex h-[46vh] min-h-[280px] items-center justify-center text-sm text-slate-500">
                Loading candles...
              </div>
            ) : error ? (
              <div className="flex h-[46vh] min-h-[280px] flex-col items-center justify-center gap-2 px-6 text-center">
                <p className="text-sm font-semibold text-slate-800">
                  {error}
                </p>

                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                  onClick={() => {
                    const controller =
                      new AbortController();

                    fetchCandles(
                      controller.signal,
                      timeframe
                    );
                  }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <PiMarketChart
                candles={candles}
                onCrosshairChange={
                  setSelected
                }
              />
            )}
          </section>

          {/* STATS */}
          <section className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {selectedStats
                ? `Selected ${selectedStats.timeLabel}`
                : "Latest candle"}
            </p>

            <div className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
              <div className="rounded-lg bg-white p-2">
                <p className="text-xs text-slate-500">
                  Open
                </p>

                <p className="font-semibold text-slate-900">
                  $
                  {formatPrice(
                    selectedStats?.open ?? 0
                  )}
                </p>
              </div>

              <div className="rounded-lg bg-white p-2">
                <p className="text-xs text-slate-500">
                  High
                </p>

                <p className="font-semibold text-emerald-600">
                  $
                  {formatPrice(
                    selectedStats?.high ?? 0
                  )}
                </p>
              </div>

              <div className="rounded-lg bg-white p-2">
                <p className="text-xs text-slate-500">
                  Low
                </p>

                <p className="font-semibold text-red-600">
                  $
                  {formatPrice(
                    selectedStats?.low ?? 0
                  )}
                </p>
              </div>

              <div className="rounded-lg bg-white p-2">
                <p className="text-xs text-slate-500">
                  Close
                </p>

                <p className="font-semibold text-slate-900">
                  $
                  {formatPrice(
                    selectedStats?.close ?? 0
                  )}
                </p>
              </div>

              <div className="rounded-lg bg-white p-2 sm:col-span-2">
                <p className="text-xs text-slate-500">
                  Volume
                </p>

                <p className="font-semibold text-slate-900">
                  {formatVolume(
                    selectedStats?.volume ?? 0
                  )}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  return createPortal(
    screen,
    document.body
  );
}
