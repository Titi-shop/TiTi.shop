// =========================================================
// app/api/notifications/route.ts
// =========================================================

import { NextResponse } from "next/server";

import {
  getUserFromBearer,
} from "@/lib/auth/getUserFromBearer";

import {
  getNotificationsByUserId,
  getUnreadNotificationCount,
  markAllNotificationsRead,
} from "@/lib/db/notifications";

export const runtime = "nodejs";

export const dynamic =
  "force-dynamic";

export async function GET() {

  try {

    const user =
      await getUserFromBearer();

    if (!user) {

      return NextResponse.json(
        {
          error:
            "UNAUTHORIZED",
        },
        {
          status: 401,
        }
      );

    }

    const [
  notifications,
  unreadCount,
] = await Promise.all([
  getNotificationsByUserId(
    user.userId
  ),
  getUnreadNotificationCount(
    user.userId
  ),
]);

return NextResponse.json({
  notifications,
  unreadCount,
});

  } catch (err) {

    console.error(
      "[NOTIFICATIONS]",
      err
    );

    return NextResponse.json(
      {
        error:
          "SERVER_ERROR",
      },
      {
        status: 500,
      }
    );

  }

}
export async function POST() {
  try {
    const user =
      await getUserFromBearer();

    if (!user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    await markAllNotificationsRead(
      user.userId
    );

    return NextResponse.json({
  ok: true,
  unreadCount: 0,
});

  } catch (err) {

    console.error(
      "[NOTIFICATIONS]",
      err
    );

    return NextResponse.json(
      {
        error: "SERVER_ERROR",
      },
      {
        status: 500,
      }
    );
  }
}