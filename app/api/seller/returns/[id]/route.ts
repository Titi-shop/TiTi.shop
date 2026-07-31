import { NextRequest, NextResponse } from "next/server";
import { requireSeller } from "@/lib/auth/guard";
import {
  getReturnDetail,
  updateReturnStatus,
} from "@/lib/services/returns/seller.service";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSeller();

  if (!auth.ok) {
    return auth.response;
  }

  const { id: returnId } = await params;

  const data = await getReturnDetail(
    auth.userId,
    returnId
  );

  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSeller();

  if (!auth.ok) {
    return auth.response;
  }

  const { id: returnId } = await params;

  const body = await req.json();

  await updateReturnStatus(
    auth.userId,
    returnId,
    body.action
  );

  return NextResponse.json({
    success: true,
  });
}


