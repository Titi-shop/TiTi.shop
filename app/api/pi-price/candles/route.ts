import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 30;

type Timeframe = "1H" | "4H" | "1D" | "7D" | "1M";

interface OkxCandlesResponse {
  code?: string;
  data?: string[][];
}

interface CandlePoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const TIMEFRAME_MAP: Record<
  Timeframe,
  { bar: string; limit: number }
> = {
  "1H": { bar: "1m", limit: 60 },
  "4H": { bar: "5m", limit: 48 },
  "1D": { bar: "15m", limit: 96 },
  "7D": { bar: "1H", limit: 168 },
  "1M": { bar: "4H", limit: 180 },
};

function toFiniteNumber(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function isTimeframe(value: string): value is Timeframe {
  return Object.prototype.hasOwnProperty.call(
    TIMEFRAME_MAP,
    value
  );
}

function parseCandle(row: string[]): CandlePoint | null {
  if (row.length < 6) {
    return null;
  }

  const tsMs = toFiniteNumber(row[0]);
  const open = toFiniteNumber(row[1]);
  const high = toFiniteNumber(row[2]);
  const low = toFiniteNumber(row[3]);
  const close = toFiniteNumber(row[4]);
  const volume = toFiniteNumber(row[5]);

  if (
    tsMs === null ||
    open === null ||
    high === null ||
    low === null ||
    close === null ||
    volume === null
  ) {
    return null;
  }

  if (
    open <= 0 ||
    high <= 0 ||
    low <= 0 ||
    close <= 0 ||
    high < low
  ) {
    return null;
  }

  return {
    time: Math.floor(tsMs / 1000),
    open,
    high,
    low,
    close,
    volume,
  };
}

export async function GET(request: NextRequest) {
  const requestedTimeframe =
    request.nextUrl.searchParams.get("timeframe") ?? "1D";

  if (!isTimeframe(requestedTimeframe)) {
    return NextResponse.json(
      {
        error: "INVALID_TIMEFRAME",
      },
      { status: 400 }
    );
  }

  const { bar, limit } =
    TIMEFRAME_MAP[requestedTimeframe];

  const upstream = new URL(
    "https://www.okx.com/api/v5/market/history-candles"
  );
  upstream.searchParams.set("instId", "PI-USDT");
  upstream.searchParams.set("bar", bar);
  upstream.searchParams.set("limit", String(limit));

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  try {
    const res = await fetch(upstream.toString(), {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "UPSTREAM_HTTP_ERROR",
          status: res.status,
        },
        { status: 502 }
      );
    }

    const json: OkxCandlesResponse = await res.json();

    if (!json.data?.length) {
      return NextResponse.json(
        {
          error: "EMPTY_CANDLE_DATA",
        },
        { status: 502 }
      );
    }

    const candles = json.data
      .map(parseCandle)
      .filter(
        (item): item is CandlePoint => item !== null
      )
      .sort((a, b) => a.time - b.time);

    if (candles.length === 0) {
      return NextResponse.json(
        {
          error: "INVALID_CANDLE_DATA",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        symbol: "PI/USDT",
        timeframe: requestedTimeframe,
        interval: bar,
        source: "OKX",
        candles,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=20, stale-while-revalidate=40",
        },
      }
    );
  } catch (error) {
    const isAbort =
      error instanceof Error &&
      error.name === "AbortError";

    return NextResponse.json(
      {
        error: isAbort
          ? "UPSTREAM_TIMEOUT"
          : "CANDLE_SOURCE_UNAVAILABLE",
      },
      { status: isAbort ? 504 : 503 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
