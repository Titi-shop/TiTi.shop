// =====================================================
// lib/db/wallet/wallet.journal.ts
// =====================================================

import {
  query,
} from "@/lib/db";

import type {
  WalletJournalInput,
  WalletClient,
} from "./wallet.types";

function getDb(
  client?: WalletClient
): WalletClient {
  if (client) {
    return client;
  }

  return {
    query: async <T>(
      sql: string,
      params?: unknown[]
    ) => {
      const result =
        await query(sql, params);

      return {
        rows: result.rows as T[],
        rowCount: result.rowCount,
      };
    },
  };
}

export async function createWalletJournal(
  params: WalletJournalInput
) {

  const db =
    getDb(params.client);

  await db.query(
    `
    INSERT INTO wallet_journal (

      id,

      owner_id,
      owner_type,

      ref_id,
      ref_table,

      entry_type,
      direction,

      amount,
      currency,

      note,
      metadata,

      event_hash,
      created_by,

      created_at

    )
    VALUES (

      gen_random_uuid(),

      $1,
      $2,

      $3,
      $4,

      $5,
      $6,

      $7,
      'PI',

      $8,
      $9,

      $10,
      $11,

      NOW()
    )
    `,
    [
      params.ownerId,
      params.ownerType,

      params.refId ?? null,
      params.refTable ?? null,

      params.entryType,
      params.direction,

      params.amount,

      params.note ?? null,

      JSON.stringify(
        params.metadata ?? {}
      ),

      params.eventHash ?? null,
      params.createdBy ?? null,
    ]
  );
}
