"use client";

import { useMemo } from "react";

interface Props {
  data: number[];
  color?: string;
}

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
  up: boolean;
}

const UP_COLOR = "#10b981";
const DOWN_COLOR = "#ef4444";

export default function PiTradingChart({
  data,
}: Props) {
  const candles = useMemo<Candle[]>(() => {
    const prices = data
      .filter(
        (value) =>
          Number.isFinite(value) &&
          value > 0
      )
      .slice(-32);

    if (prices.length < 2) {
      return [];
    }

    return prices.map((close, index) => {
      const open =
        index === 0
          ? prices[0] ?? close
          : prices[index - 1] ?? close;

      const high = Math.max(
        open,
        close
      );

      const low = Math.min(
        open,
        close
      );

      return {
        open,
        close,
        high,
        low,
        up: close > open,
      };
    });
  }, [data]);

  if (candles.length < 2) {
    return (
      <div
        className="
          h-[52px]
          w-full
          overflow-hidden
          rounded-xl
        "
        aria-label="PI price chart loading"
      >
        <div className="flex h-full items-center gap-1 px-1 opacity-30">
          {Array.from({ length: 18 }).map(
            (_, index) => (
              <span
                key={index}
                className="
                  h-5
                  flex-1
                  animate-pulse
                  rounded-sm
                  bg-slate-300
                "
              />
            )
          )}
        </div>
      </div>
    );
  }

  const prices = candles.flatMap(
    (candle) => [
      candle.high,
      candle.low,
    ]
  );

  const maxPrice = Math.max(
    ...prices
  );

  const minPrice = Math.min(
    ...prices
  );

  const rawRange =
    maxPrice - minPrice;

  const padding =
    rawRange > 0
      ? rawRange * 0.08
      : Math.max(
          maxPrice * 0.001,
          0.0001
        );

  const chartMax =
    maxPrice + padding;

  const chartMin =
    Math.max(
      0,
      minPrice - padding
    );

  const range =
    chartMax - chartMin || 1;

  const chartHeight = 36;

  const getY = (
    value: number
  ) =>
    4 +
    ((chartMax - value) /
      range) *
      chartHeight;

  const latest =
    candles[candles.length - 1];

  const previous =
    candles[candles.length - 2];

  const isLatestUp =
    latest.close > latest.open;

  const latestChange =
    previous.close !== 0
      ? ((latest.close -
          previous.close) /
          previous.close) *
        100
      : 0;

  /*
   * IMPORTANT:
   *
   * Candle colors are determined by
   * each candle's own open/close.
   *
   * Do NOT use the current price color
   * for all candles.
   */
  const lineColor =
    isLatestUp
      ? UP_COLOR
      : DOWN_COLOR;

  const linePoints = candles
    .map((candle, index) => {
      const x =
        candles.length === 1
          ? 50
          : (index /
              (candles.length - 1)) *
            100;

      const y =
        (getY(candle.close) /
          44) *
        100;

      return `${x},${y}`;
    })
    .join(" ");

  const latestY =
    getY(latest.close);

  return (
    <div
      className="
        relative
        h-[52px]
        w-full
        overflow-hidden
        rounded-xl
        border
        border-slate-200/70
        bg-white/80
        dark:border-white/10
        dark:bg-white/[0.025]
      "
      aria-label="PI price mini candlestick chart"
    >
      {/* GRID */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-60
        "
        aria-hidden="true"
      >
        <div
          className="
            absolute
            inset-x-0
            top-1/3
            border-t
            border-dashed
            border-slate-200/70
            dark:border-white/[0.06]
          "
        />

        <div
          className="
            absolute
            inset-x-0
            top-2/3
            border-t
            border-dashed
            border-slate-200/70
            dark:border-white/[0.06]
          "
        />
      </div>

      {/* PRICE TREND */}

      <svg
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-1
          h-[44px]
          w-full
          opacity-20
        "
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline
          points={linePoints}
          fill="none"
          stroke={lineColor}
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* CANDLES */}

      <div
        className="
          absolute
          inset-x-1
          top-1
          flex
          h-[44px]
          items-stretch
          justify-between
          gap-[2px]
        "
      >
        {candles.map(
          (candle, index) => {
            const openY =
              getY(candle.open);

            const closeY =
              getY(candle.close);

            const highY =
              getY(candle.high);

            const lowY =
              getY(candle.low);

            const bodyTop =
              Math.min(
                openY,
                closeY
              );

            const bodyHeight =
              Math.max(
                Math.abs(
                  closeY - openY
                ),
                3
              );

            const wickHeight =
              Math.max(
                lowY - highY,
                2
              );

            const isLast =
              index ===
              candles.length - 1;

            /*
             * THIS is the important part.
             *
             * Every candle independently
             * decides whether it is green
             * or red.
             */
            const candleColor =
              candle.up
                ? UP_COLOR
                : DOWN_COLOR;

            return (
              <div
                key={`${candle.open}-${candle.close}-${index}`}
                className="
                  relative
                  h-[44px]
                  min-w-0
                  flex-1
                "
              >
                {/* WICK */}

                <span
                  className="
                    absolute
                    left-1/2
                    w-px
                    -translate-x-1/2
                    rounded-full
                  "
                  style={{
                    top: `${highY}px`,
                    height: `${wickHeight}px`,
                    backgroundColor:
                      candleColor,
                    opacity:
                      isLast
                        ? 0.9
                        : 0.55,
                  }}
                />

                {/* BODY */}

                <span
                  className="
                    absolute
                    left-1/2
                    min-w-[3px]
                    -translate-x-1/2
                    rounded-[2px]
                    transition-all
                    duration-300
                  "
                  style={{
                    top: `${bodyTop}px`,
                    height: `${bodyHeight}px`,
                    backgroundColor:
                      candleColor,
                    opacity:
                      isLast
                        ? 1
                        : 0.95,
                    boxShadow:
                      isLast
                        ? `0 0 7px ${candleColor}66`
                        : undefined,
                  }}
                />

                {/* LAST CANDLE */}

                {isLast && (
                  <span
                    className="
                      absolute
                      left-1/2
                      top-1/2
                      h-2
                      w-2
                      -translate-x-1/2
                      -translate-y-1/2
                      rounded-full
                      border-2
                      border-white
                      dark:border-[#0f1117]
                    "
                    style={{
                      backgroundColor:
                        candleColor,
                      boxShadow:
                        `0 0 0 2px ${candleColor}33`,
                    }}
                  />
                )}
              </div>
            );
          }
        )}
      </div>

      {/* CURRENT PRICE DOT */}

      <span
        className="
          pointer-events-none
          absolute
          right-1
          h-1.5
          w-1.5
          rounded-full
        "
        style={{
          top: `${Math.max(
            2,
            Math.min(
              latestY,
              42
            )
          )}px`,
          backgroundColor:
            isLatestUp
              ? UP_COLOR
              : DOWN_COLOR,
          boxShadow:
            `0 0 0 3px ${
              isLatestUp
                ? UP_COLOR
                : DOWN_COLOR
            }22`,
        }}
        aria-hidden="true"
      />

      {/* CHANGE */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0.5
          left-1.5
          rounded-md
          bg-white/80
          px-1
          py-0.5
          text-[8px]
          font-semibold
          leading-none
          backdrop-blur-sm
          dark:bg-[#0f1117]/80
        "
        style={{
          color:
            latestChange >= 0
              ? UP_COLOR
              : DOWN_COLOR,
        }}
      >
        {latestChange >= 0
          ? "+"
          : ""}
        {latestChange.toFixed(2)}%
      </div>
    </div>
  );
}
