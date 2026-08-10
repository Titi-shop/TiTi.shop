"use client";

import {
  createChart,
  LineSeries,
} from "lightweight-charts";

import type {
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
} from "lightweight-charts";

import {
  useEffect,
  useRef,
} from "react";

interface Props {
  data: number[];
  color?: string;
}

export default function PiTradingChart({
  data,
  color = "#10b981",
}: Props) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const chartRef =
    useRef<IChartApi | null>(null);

  const seriesRef =
    useRef<ISeriesApi<"Line"> | null>(null);

  /*
   * Create chart only once.
   * Realtime price updates should update
   * the existing series instead of destroying
   * and recreating the whole chart.
   */
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container =
      containerRef.current;

    const chart = createChart(
      container,
      {
        width: container.clientWidth,
        height: 54,

        layout: {
          background: {
            color: "transparent",
          },

          textColor:
            "rgba(100,116,139,0.35)",
        },

        grid: {
          vertLines: {
            visible: false,
          },

          horzLines: {
            visible: false,
          },
        },

        leftPriceScale: {
          visible: false,
        },

        rightPriceScale: {
          visible: false,
        },

        timeScale: {
          visible: false,
          borderVisible: false,
          timeVisible: false,
          secondsVisible: false,
        },

        crosshair: {
          vertLine: {
            visible: false,
          },

          horzLine: {
            visible: false,
          },
        },

        handleScroll: false,
        handleScale: false,
      }
    );

    const series =
      chart.addSeries(LineSeries, {
        color,
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      });

    chartRef.current = chart;
    seriesRef.current = series;

    const resize = () => {
      if (!containerRef.current) {
        return;
      }

      chart.applyOptions({
        width:
          containerRef.current
            .clientWidth,
      });
    };

    const observer =
      new ResizeObserver(resize);

    observer.observe(container);

    window.addEventListener(
      "resize",
      resize
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "resize",
        resize
      );

      chart.remove();

      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  /*
   * Update chart data without recreating
   * the chart instance.
   */
  useEffect(() => {
    const series =
      seriesRef.current;

    if (!series || data.length < 2) {
      return;
    }

    const chartData = data.map(
      (price, index) => ({
        time:
          (index + 1) as UTCTimestamp,
        value: price,
      })
    );

    series.setData(chartData);

    chartRef.current
      ?.timeScale()
      .fitContent();
  }, [data]);

  /*
   * Update line color independently.
   */
  useEffect(() => {
    seriesRef.current?.applyOptions({
      color,
    });
  }, [color]);

  return (
    <div
      ref={containerRef}
      className="
        h-[54px]
        w-full
      "
      aria-label="PI price chart"
    />
  );
}
