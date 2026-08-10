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

function formatTimeLabel(time: Time): string {
  if (typeof time === "number") {
    return new Date(time * 1000).toLocaleString();
  }

  if (typeof time === "string") {
    const parsed = new Date(time);
    return Number.isNaN(parsed.getTime())
      ? time
      : parsed.toLocaleString();
  }

  const month =
    typeof time.month === "number"
      ? time.month - 1
      : 0;
  return new Date(
    Date.UTC(time.year, month, time.day)
  ).toLocaleDateString();
}

export default function PiMarketChart({
  candles,
  onCrosshairChange,
}: PiMarketChartProps) {
  const containerRef =
    useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef =
    useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef =
    useRef<ISeriesApi<"Histogram"> | null>(null);

  const chartData = useMemo(
    () =>
      candles.map(
        (item): CandlestickData<UTCTimestamp> => ({
          time: item.time as UTCTimestamp,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        })
      ),
    [candles]
  );

  const volumeData = useMemo(
    () =>
      candles.map((item) => ({
        time: item.time as UTCTimestamp,
        value: item.volume,
        color:
          item.close >= item.open
            ? "rgba(16, 185, 129, 0.5)"
            : "rgba(239, 68, 68, 0.5)",
      })),
    [candles]
  );

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: {
        background: {
          type: ColorType.Solid,
          color: "transparent",
        },
        textColor: "#334155",
      },
      grid: {
        vertLines: { color: "rgba(148, 163, 184, 0.12)" },
        horzLines: { color: "rgba(148, 163, 184, 0.12)" },
      },
      rightPriceScale: {
        borderColor: "rgba(148, 163, 184, 0.25)",
        scaleMargins: {
          top: 0.08,
          bottom: 0.3,
        },
      },
      timeScale: {
        borderColor: "rgba(148, 163, 184, 0.25)",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "rgba(100, 116, 139, 0.9)",
          width: 1,
          style: 0,
        },
        horzLine: {
          color: "rgba(100, 116, 139, 0.35)",
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
    });

    const candleSeries = chart.addSeries(
      CandlestickSeries,
      {
        upColor: "#10b981",
        downColor: "#ef4444",
        borderVisible: false,
        wickUpColor: "#10b981",
        wickDownColor: "#ef4444",
      }
    );

    const volumeSeries = chart.addSeries(
      HistogramSeries,
      {
        priceFormat: {
          type: "volume",
        },
        priceScaleId: "volume",
      }
    );

    chart.priceScale("volume").applyOptions({
      scaleMargins: {
        top: 0.75,
        bottom: 0,
      },
      borderVisible: false,
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current) {
        return;
      }
      chart.applyOptions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    });

    resizeObserver.observe(containerRef.current);

    chart.subscribeCrosshairMove((param) => {
      if (
        !param.time ||
        !param.seriesData.size ||
        !onCrosshairChange
      ) {
        onCrosshairChange?.(null);
        return;
      }

      const candleData = param.seriesData.get(
        candleSeries
      ) as
        | CandlestickData<Time>
        | undefined;
      const volumeDataPoint = param.seriesData.get(
        volumeSeries
      ) as { value: number } | undefined;

      if (!candleData) {
        onCrosshairChange(null);
        return;
      }

      onCrosshairChange({
        timeLabel: formatTimeLabel(param.time),
        open: candleData.open,
        high: candleData.high,
        low: candleData.low,
        close: candleData.close,
        volume: volumeDataPoint?.value ?? 0,
      });
    });

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, [onCrosshairChange]);

  useEffect(() => {
    const chart = chartRef.current;
    const candleSeries = candleSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;

    if (!chart || !candleSeries || !volumeSeries) {
      return;
    }

    candleSeries.setData(chartData);
    volumeSeries.setData(volumeData);
    chart.timeScale().fitContent();
  }, [chartData, volumeData]);

  return (
    <div
      ref={containerRef}
      className="h-[52vh] min-h-[320px] w-full"
    />
  );
}
