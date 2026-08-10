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

export default function PiTradingChart({
  data,
}: Props) {
  const candles = useMemo<Candle[]>(() => {
    if (data.length < 2) {
      return [];
    }

    return data
      .slice(-28)
      .map((close, index, values) => {
        const previous =
          index === 0
            ? values[0] ?? close
            : values[index - 1] ?? close;

        const open = previous;

        /*
         * We only have ticker prices from the API.
         * Therefore we intentionally do not invent
         * high/low wick data.
         *
         * High/low are limited to the real observed
         * open/close prices of each update.
         */
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
          up: close >= open,
        };
      });
  }, [data]);

  if (candles.length < 2) {
    return (
      <div
        className="
          h-[36px]
          w-full
        "
        aria-label="PI price chart loading"
      />
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

  const range =
    maxPrice - minPrice || 1;

  const chartHeight = 30;

  const getY = (value: number) =>
    3 +
    ((maxPrice - value) /
      range) *
      chartHeight;

  return (
    <div
      className="
        flex
        h-[36px]
        w-full
        items-center
        overflow-hidden
      "
      aria-label="PI price mini candlestick chart"
    >
      <div
        className="
          flex
          h-full
          w-full
          items-center
          justify-between
          gap-[2px]
        "
      >
        {candles.map(
          (candle, index) => {
            const openY = getY(
              candle.open
            );

            const closeY = getY(
              candle.close
            );

            const highY = getY(
              candle.high
            );

            const lowY = getY(
              candle.low
            );

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

            const candleHeight =
              Math.max(
                lowY - highY,
                2
              );

            const isLast =
              index ===
              candles.length - 1;

            return (
              <div
                key={`${index}-${candle.close}`}
                className="
                  relative
                  h-[36px]
                  min-w-0
                  flex-1
                "
              >
                {/* Wick */}

                <span
                  className={`
                    absolute
                    left-1/2
                    w-[1px]
                    -translate-x-1/2
                    rounded-full
                    ${
                      candle.up
                        ? "bg-emerald-500/55"
                        : "bg-red-500/55"
                    }
                  `}
                  style={{
                    top: `${highY}px`,
                    height: `${candleHeight}px`,
                  }}
                />

                {/* Candle body */}

                <span
                  className={`
                    absolute
                    left-1/2
                    min-w-[3px]
                    -translate-x-1/2
                    rounded-[1px]
                    transition-all
                    duration-300
                    ${
                      candle.up
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }
                    ${
                      isLast
                        ? "shadow-[0_0_5px_rgba(16,185,129,0.35)]"
                        : ""
                    }
                  `}
                  style={{
                    top: `${bodyTop}px`,
                    height: `${bodyHeight}px`,
                  }}
                />
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
