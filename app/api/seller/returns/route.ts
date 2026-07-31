import { NextRequest, NextResponse } from "next/server";
import { requireSeller } from "@/lib/auth/guard";
import { getReturnsBySeller } from "@/lib/services/returns/seller.service";

export const runtime = "nodejs";

/* =====================================================
   GET /api/seller/returns
===================================================== */

export async function GET(req: NextRequest) {
  console.log("đŸ€ [SELLER RETURNS API] START");

  try {
    /* ================= AUTH ================= */
    const auth = await requireSeller();

    if (!auth.ok) {
      return auth.response;
    }

    const sellerId = auth.userId;

    console.log("đŸ‘¤ SELLER:", sellerId);

    /* ================= QUERY PARAM ================= */
    const url = new URL(req.url);
    const rawStatus = url.searchParams.get("status");

    const allowedStatuses = [
      "pending",
      "approved",
      "shipping_back",
      "received",
      "refunded",
      "rejected",
    ] as const;

    const status =
      rawStatus !== null &&
      allowedStatuses.some((value) => value === rawStatus)
        ? (rawStatus as (typeof allowedStatuses)[number])
        : null;

    console.log("đŸ” FILTER STATUS:", status);

    /* ================= DB ================= */
    const items = await getReturnsBySeller(
      sellerId,
      status // đŸ‘ˆ TRUYá»€N XUá»NG DB
    );

    console.log("đŸ“¦ RETURNS:", items.length);

    return NextResponse.json({
      items,
    });

  } catch (err) {
    console.error("đŸ’¥ API ERROR:", err);

    return NextResponse.json(
      { error: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
