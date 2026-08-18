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


/* =====================================================
   IS LOCKED
===================================================== */


/* =====================================================
   FAILED ATTEMPTS
===================================================== */
