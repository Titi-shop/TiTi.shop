import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 10;

type Timeframe =
  | "1H"
  | "4H"
  | "1D"
  | "7D"
  | "1M";

interface OkxCandlesResponse {
  code?: string;
  msg?: string;
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

interface TimeframeConfig {
  bar: string;
  limit: number;
}

const TIMEFRAME_MAP: Record<
  Timeframe,
  TimeframeConfig
> = {
  "1H": {
    bar: "1m",
    limit: 60,
  },

  "4H": {
    bar: "5m",
    limit: 48,
  },

  "1D": {
    bar: "15m",
    limit: 96,
  },

  "7D": {
    bar: "1H",
    limit: 168,
  },

  "1M": {
    bar: "4H",
    limit: 180,
  },
};

const UPSTREAM_TIMEOUT_MS = 5000;

function toFiniteNumber(
  value: unknown
): number | null {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function isTimeframe(
  value: string
): value is Timeframe {
  return Object.prototype.hasOwnProperty.call(
    TIMEFRAME_MAP,
    value
  );
}

function parseCandle(
  row: string[]
): CandlePoint | null {
  /*
   * OKX candle format:
   *
   * [
   *   0: ts,
   *   1: open,
   *   2: high,
   *   3: low,
   *   4: close,
   *   5: volume,
   *   6: volCcy,
   *   7: volCcyQuote,
   *   8: confirm
   * ]
   *
   * For SPOT, vol is the base-currency volume.
   */

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

  if (tsMs <= 0) {
    return null;
  }

  if (
    open <= 0 ||
    high <= 0 ||
    low <= 0 ||
    close <= 0
  ) {
    return null;
  }

  if (high < low) {
    return null;
  }

  if (high < open || high < close) {
    return null;
  }

  if (low > open || low > close) {
    return null;
  }

  if (volume < 0) {
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

function buildErrorResponse(
  error: string,
  status: number,
  extra?: Record<string, unknown>
) {
  return NextResponse.json(
    {
      error,
      ...extra,
    },
    {
      status,
      headers: {
        "Cache-Control":
          "no-store",
      },
    }
  );
}

export async function GET(
  request: NextRequest
) {
  const requestedTimeframe =
    request.nextUrl.searchParams.get(
      "timeframe"
    ) ?? "1D";

  /*
   * Validate timeframe before calling OKX.
   */
  if (!isTimeframe(requestedTimeframe)) {
    return buildErrorResponse(
      "INVALID_TIMEFRAME",
      400,
      {
        timeframe: requestedTimeframe,
        allowed: Object.keys(
          TIMEFRAME_MAP
        ),
      }
    );
  }

  const {
    bar,
    limit,
  } = TIMEFRAME_MAP[
    requestedTimeframe
  ];

  /*
   * Use OKX latest candlesticks endpoint.
   *
   * This endpoint supports up to 300 recent
   * candles per request, so every Pi Market
   * timeframe can be loaded in one request.
   */
  const upstream = new URL(
    "https://www.okx.com/api/v5/market/candles"
  );

  upstream.searchParams.set(
    "instId",
    "PI-USDT"
  );

  upstream.searchParams.set(
    "bar",
    bar
  );

  upstream.searchParams.set(
    "limit",
    String(limit)
  );

  const controller =
    new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, UPSTREAM_TIMEOUT_MS);

  try {
    const response = await fetch(
      upstream.toString(),
      {
        method: "GET",

        signal:
          controller.signal,

        headers: {
          Accept:
            "application/json",
        },

        next: {
          revalidate: 10,
        },
      }
    );

    if (!response.ok) {
      return buildErrorResponse(
        "UPSTREAM_HTTP_ERROR",
        502,
        {
          status:
            response.status,
        }
      );
    }

    const json =
      (await response.json()) as OkxCandlesResponse;

    /*
     * OKX code "0" means success.
     */
    if (json.code !== "0") {
      return buildErrorResponse(
        "OKX_CANDLE_API_ERROR",
        502,
        {
          code:
            json.code ??
            "UNKNOWN",
          message:
            json.msg ??
            null,
        }
      );
    }

    if (
      !Array.isArray(
        json.data
      ) ||
      json.data.length === 0
    ) {
      return buildErrorResponse(
        "EMPTY_CANDLE_DATA",
        502
      );
    }

    /*
     * OKX normally returns newest → oldest.
     *
     * The chart expects oldest → newest,
     * so normalize the order here.
     */
    const candles = json.data
      .map(parseCandle)
      .filter(
        (
          item
        ): item is CandlePoint =>
          item !== null
      )
      .sort(
        (a, b) =>
          a.time - b.time
      );

    if (
      candles.length === 0
    ) {
      return buildErrorResponse(
        "INVALID_CANDLE_DATA",
        502
      );
    }

    /*
     * Remove duplicate timestamps defensively.
     */
    const uniqueCandles: CandlePoint[] =
      [];

    const seenTimes =
      new Set<number>();

    for (const candle of candles) {
      if (
        seenTimes.has(
          candle.time
        )
      ) {
        continue;
      }

      seenTimes.add(
        candle.time
      );

      uniqueCandles.push(
        candle
      );
    }

    if (
      uniqueCandles.length === 0
    ) {
      return buildErrorResponse(
        "EMPTY_NORMALIZED_CANDLE_DATA",
        502
      );
    }

    /*
     * Do not silently return more candles
     * than requested if OKX ever changes
     * its response behavior.
     */
    const normalizedCandles =
      uniqueCandles.slice(
        -limit
      );

    return NextResponse.json(
      {
        symbol:
          "PI/USDT",

        timeframe:
          requestedTimeframe,

        interval:
          bar,

        source:
          "OKX",

        candles:
          normalizedCandles,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=10, stale-while-revalidate=20",
        },
      }
    );
  } catch (error) {
    const isAbort =
      error instanceof Error &&
      error.name ===
        "AbortError";

    if (isAbort) {
      return buildErrorResponse(
        "UPSTREAM_TIMEOUT",
        504
      );
    }

    console.error(
      "PI_CANDLES_API_ERROR",
      error
    );

    return buildErrorResponse(
      "CANDLE_SOURCE_UNAVAILABLE",
      503
    );
  } finally {
    clearTimeout(
      timeout
    );
  }
}
