// =====================================================
// lib/db/wallet-security/queries.verify.ts
// =====================================================

import {
  query,
} from "@/lib/db";

import {
  mapWalletSecurity,
} from "./mapper";

/* =====================================================
   MARK PIN VERIFIED
===================================================== */

export async function markWalletPinVerified(
  userId: string
) {

  const res =
    await query(
      `
      UPDATE wallet_security

      SET

        last_verified_at = NOW(),

        failed_attempts = 0,

        locked_until = NULL,

        updated_at = NOW()

      WHERE user_id = $1

      RETURNING *
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
   MARK PIN CHANGED
===================================================== */


/* =====================================================
   MARK TOTP VERIFIED
===================================================== */


/* =====================================================
   RESET VERIFY STATE
===================================================== */
