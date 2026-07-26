import { NextResponse } from "next/server";
import { Horizon } from "@stellar/stellar-sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const horizonUrl = process.env.PI_HORIZON_URL;

    if (!horizonUrl) {
      return NextResponse.json(
        { ok: false, error: "PI_HORIZON_URL is not configured" },
        { status: 500 }
      );
    }

    const server = new Horizon.Server(horizonUrl);

    const ledger = await server.ledgers()
      .order("desc")
      .limit(1)
      .call();

    return NextResponse.json({
      ok: true,
      horizon: horizonUrl,
      latestLedger: ledger.records[0]?.sequence ?? null,
    });
  } catch (error) {
    console.error("[HORIZON_ERROR]", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
