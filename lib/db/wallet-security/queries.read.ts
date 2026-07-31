// =====================================================
// lib/db/wallet-security/queries.read.ts
// =====================================================

import { query } from "@/lib/db";

import {
  mapWalletSecurity,
} from "./mapper";

/* =====================================================
   GET BY USER
===================================================== */

export async function getWalletSecurityByUserId(
  userId: string
) {

  const res =
    await query(
      `
      SELECT *
      FROM wallet_security
      WHERE user_id = $1
      LIMIT 1
      `,
      [
        userId,
      ]
    );

  return res.rows[0]
    ? mapWalletSecurity(
        res.rows[0]
      )
    : null;

}

/* =====================================================
   HAS PIN
===================================================== */

export async function hasWalletPin(
  userId: string
) {

  const res =
    await query(
      `
      SELECT
        pin_enabled
      FROM wallet_security
      WHERE user_id = $1
      LIMIT 1
      `,
      [
        userId,
      ]
    );

  const row = res.rows[0];

  if (!row) {
    return false;
  }

  return Boolean(
    row.pin_enabled
  );

}

/* =====================================================
   IS LOCKED
===================================================== */

export async function isWalletLocked(
  userId: string
) {

  const res =
    await query(
      `
      SELECT
        locked_until
      FROM wallet_security
      WHERE user_id = $1
      LIMIT 1
      `,
      [
        userId,
      ]
    );

  const row = res.rows[0];

  if (!row) {
    return false;
  }

  const lockedUntil =
    row.locked_until;

  if (
    !lockedUntil
  ) {
    return false;
  }

  return (
    new Date(
      lockedUntil
    ) >
    new Date()
  );

}

/* =====================================================
   FAILED ATTEMPTS
===================================================== */

export async function getWalletFailedAttempts(
  userId: string
) {

  const res =
    await query(
      `
      SELECT
        failed_attempts
      FROM wallet_security
      WHERE user_id = $1
      LIMIT 1
      `,
      [
        userId,
      ]
    );

  const row = res.rows[0];

  if (!row) {
    return 0;
  }

  return Number(
    row.failed_attempts ??
      0
  );

}
