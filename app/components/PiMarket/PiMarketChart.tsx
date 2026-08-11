"use client";

import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  HistogramSeries,
  createChart,
} from "lightweight-charts";

import type {
  CandlestickData,
  IChartApi,
  ISeriesApi,
  Time,
  UTCTimestamp,
} from "lightweight-charts";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

export interface PiMarketCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CrosshairSnapshot {
  timeLabel: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PiMarketChartProps {
  candles: PiMarketCandle[];
  onCrosshairChange?: (
    snapshot: CrosshairSnapshot | null
  ) => void;
}

function formatTimeLabel(
  time: Time
): string {
  if (typeof time === "number") {
    return new Date(
      time * 1000
    ).toLocaleString();
  }

  if (typeof time === "string") {
    const parsed = new Date(time);

    return Number.isNaN(
      parsed.getTime()
    )
      ? time
      : parsed.toLocaleString();
  }

  const month =
    typeof time.month === "number"
      ? time.month - 1
      : 0;

  return new Date(
    Date.UTC(
      time.year,
      month,
      time.day
    )
  ).toLocaleDateString();
}

function normalizeCandles(
  candles: PiMarketCandle[]
): PiMarketCandle[] {
  const valid = candles.filter(
    (item) =>
      Number.isFinite(item.time) &&
      item.time > 0 &&
      Number.isFinite(item.open) &&
      Number.isFinite(item.high) &&
      Number.isFinite(item.low) &&
      Number.isFinite(item.close) &&
      Number.isFinite(item.volume) &&
      item.open > 0 &&
      item.high > 0 &&
      item.low > 0 &&
      item.close > 0 &&
      item.volume >= 0 &&
      item.high >= item.open &&
      item.high >= item.close &&
      item.low <= item.open &&
      item.low <= item.close
  );

  valid.sort(
    (a, b) => a.time - b.time
  );

  const unique: PiMarketCandle[] = [];
  const seen = new Set<number>();

  for (const item of valid) {
    if (seen.has(item.time)) {
      continue;
    }

    seen.add(item.time);
    unique.push(item);
  }

  return unique;
}

export default function PiMarketChart({
  candles,
  onCrosshairChange,
}: PiMarketChartProps) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const chartRef =
    useRef<IChartApi | null>(null);

  const candleSeriesRef =
    useRef<ISeriesApi<"Candlestick"> | null>(
      null
    );

  const volumeSeriesRef =
    useRef<ISeriesApi<"Histogram"> | null>(
      null
    );

  const initializedRef =
    useRef(false);

  const normalizedCandles = useMemo(
    () =>
      normalizeCandles(candles),
    [candles]
  );

  const chartData = useMemo(
    () =>
      normalizedCandles.map(
        (
          item
        ): CandlestickData<UTCTimestamp> => ({
          time:
            item.time as UTCTimestamp,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        })
      ),
    [normalizedCandles]
  );

  const volumeData = useMemo(
    () =>
      normalizedCandles.map(
        (item) => ({
          time:
            item.time as UTCTimestamp,

          value: item.volume,

          color:
            item.close >= item.open
              ? "rgba(16, 185, 129, 0.5)"
              : "rgba(239, 68, 68, 0.5)",
        })
      ),
    [normalizedCandles]
  );

  /*
   * CREATE CHART
   */
  useEffect(() => {
    const container =
      containerRef.current;

    if (!container) {
      return;
    }

    const chart = createChart(
      container,
      {
        width:
          container.clientWidth,
        height:
          container.clientHeight,

        layout: {
          background: {
            type:
              ColorType.Solid,
            color:
              "transparent",
          },

          textColor:
            "#334155",
        },

        grid: {
          vertLines: {
            color:
              "rgba(148, 163, 184, 0.12)",
          },

          horzLines: {
            color:
              "rgba(148, 163, 184, 0.12)",
          },
        },

        rightPriceScale: {
          borderColor:
            "rgba(148, 163, 184, 0.25)",

          scaleMargins: {
            top: 0.08,
            bottom: 0.30,
          },
        },

        timeScale: {
          borderColor:
            "rgba(148, 163, 184, 0.25)",

          timeVisible: true,

          secondsVisible:
            false,

          rightOffset: 2,

          barSpacing: 6,

          minBarSpacing: 2,
        },

        crosshair: {
          mode:
            CrosshairMode.Normal,

          vertLine: {
            color:
              "rgba(100, 116, 139, 0.9)",

            width: 1,

            style: 0,
          },

          horzLine: {
            color:
              "rgba(100, 116, 139, 0.35)",

            width: 1,

            style: 0,
          },
        },

        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: false,
        },

        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },

        kineticScroll: {
          touch: true,
          mouse: true,
        },
      }
    );

    /*
     * CANDLESTICK
     */
    const candleSeries =
      chart.addSeries(
        CandlestickSeries,
        {
          upColor:
            "#10b981",

          downColor:
            "#ef4444",

          borderVisible:
            false,

          wickUpColor:
            "#10b981",

          wickDownColor:
            "#ef4444",
        }
      );

    /*
     * VOLUME
     */
    const volumeSeries =
      chart.addSeries(
        HistogramSeries,
        {
          priceFormat: {
            type: "volume",
          },

          priceScaleId:
            "volume",

          lastValueVisible:
            false,

          priceLineVisible:
            false,
        }
      );

    chart
      .priceScale("volume")
      .applyOptions({
        scaleMargins: {
          top: 0.75,
          bottom: 0,
        },

        borderVisible:
          false,
      });

    chartRef.current =
      chart;

    candleSeriesRef.current =
      candleSeries;

    volumeSeriesRef.current =
      volumeSeries;

    /*
     * RESPONSIVE RESIZE
     */
    const resizeObserver =
      new ResizeObserver(
        (entries) => {
          const entry =
            entries[0];

          if (!entry) {
            return;
          }

          const width =
            Math.floor(
              entry.contentRect
                .width
            );

          const height =
            Math.floor(
              entry.contentRect
                .height
            );

          if (
            width <= 0 ||
            height <= 0
          ) {
            return;
          }

          chart.applyOptions({
            width,
            height,
          });
        }
      );

    resizeObserver.observe(
      container
    );

    /*
     * CROSSHAIR
     */
    const handleCrosshairMove =
      (param: Parameters<
        IChartApi["subscribeCrosshairMove"]
      >[0]) => {
        if (
          !param.time ||
          !param.seriesData.size
        ) {
          onCrosshairChange?.(
            null
          );

          return;
        }

        const candleData =
          param.seriesData.get(
            candleSeries
          ) as
            | CandlestickData<Time>
            | undefined;

        const volumeDataPoint =
          param.seriesData.get(
            volumeSeries
          ) as
            | {
                value: number;
              }
            | undefined;

        if (!candleData) {
          onCrosshairChange?.(
            null
          );

          return;
        }

        onCrosshairChange?.({
          timeLabel:
            formatTimeLabel(
              param.time
            ),

          open:
            candleData.open,

          high:
            candleData.high,

          low:
            candleData.low,

          close:
            candleData.close,

          volume:
            volumeDataPoint?.value ??
            0,
        });
      };

    chart.subscribeCrosshairMove(
      handleCrosshairMove
    );

    /*
     * INITIALIZED
     */
    initializedRef.current =
      true;

    /*
     * CLEANUP
     */
    return () => {
      resizeObserver.disconnect();

      chart.unsubscribeCrosshairMove(
        handleCrosshairMove
      );

      chart.remove();

      chartRef.current =
        null;

      candleSeriesRef.current =
        null;

      volumeSeriesRef.current =
        null;

      initializedRef.current =
        false;
    };
  }, [onCrosshairChange]);

  /*
   * UPDATE DATA
   */
  useEffect(() => {
    const chart =
      chartRef.current;

    const candleSeries =
      candleSeriesRef.current;

    const volumeSeries =
      volumeSeriesRef.current;

    if (
      !chart ||
      !candleSeries ||
      !volumeSeries
    ) {
      return;
    }

    if (
      chartData.length === 0
    ) {
      candleSeries.setData(
        []
      );

      volumeSeries.setData(
        []
      );

      onCrosshairChange?.(
        null
      );

      return;
    }

    candleSeries.setData(
      chartData
    );

    volumeSeries.setData(
      volumeData
    );

    /*
     * Only fit the chart when data
     * is first loaded or replaced by
     * a different timeframe.
     *
     * This prevents unnecessary
     * viewport jumps during normal
     * component updates.
     */
    if (
      !initializedRef.current
    ) {
      return;
    }

    chart
      .timeScale()
      .fitContent();
  }, [
    chartData,
    volumeData,
    onCrosshairChange,
  ]);

  /*
   * EMPTY STATE
   */
  if (
    normalizedCandles.length === 0
  ) {
    return (
      <div
        ref={containerRef}
        className="
          relative
          flex
          h-[52vh]
          min-h-[320px]
          w-full
          items-center
          justify-center
          text-sm
          text-slate-500
        "
      >
        No market data.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="
        h-[52vh]
        min-h-[320px]
        w-full
      "
    />
  );
}
