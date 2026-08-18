// =====================================================
// lib/db/wallet-security/queries.write.ts
// =====================================================

import {
  query,
} from "@/lib/db";

import {
  mapWalletSecurity,
} from "./mapper";

import type {
  CreateWalletSecurityInput,
  SetWalletPinInput,
  ChangeWalletPinInput,
} from "./types";

/* =====================================================
   CREATE
===================================================== */

export async function createWalletSecurity(
  input: CreateWalletSecurityInput
) {

  const res =
    await query(
      `
      INSERT INTO wallet_security (

        user_id,

        created_by

      )

      VALUES (

        $1,

        $2

      )

      RETURNING *
      `,
      [

        input.user_id,

        input.created_by ??
          null,

      ]
    );

  const row = res.rows[0];

  if (!row) {
    throw new Error("WALLET_SECURITY_CREATE_FAILED");
  }

  return mapWalletSecurity(
    row
  );

}

/* =====================================================
   SET PIN
===================================================== */

export async function setWalletPin(
  input: SetWalletPinInput
) {

  const res =
    await query(
      `
      UPDATE wallet_security

      SET

        pin_hash = $2,

        pin_enabled = true,

        pin_created_at = NOW(),

        pin_changed_at = NOW(),

        updated_at = NOW(),

        updated_by = $3

      WHERE user_id = $1

      RETURNING *
      `,
      [

        input.user_id,

        input.pin_hash,

        input.updated_by ??
          null,

      ]
    );

  return res.rows[0]
    ? mapWalletSecurity(
        res.rows[0]
      )
    : null;

}

/* =====================================================
   CHANGE PIN
===================================================== */

export async function changeWalletPin(
  input: ChangeWalletPinInput
) {

  const res =
    await query(
      `
      UPDATE wallet_security

      SET

        pin_hash = $2,

        pin_changed_at = NOW(),

        updated_at = NOW(),

        updated_by = $3

      WHERE user_id = $1

      RETURNING *
      `,
      [

        input.user_id,

        input.pin_hash,

        input.updated_by ??
          null,

      ]
    );

  return res.rows[0]
    ? mapWalletSecurity(
        res.rows[0]
      )
    : null;

}

/* =====================================================
   ENABLE TOTP
===================================================== */


/* =====================================================
   BIOMETRIC
===================================================== */


/* =====================================================
   PASSKEY
===================================================== */
