import type { WalletAddress } from "./types";

export type WalletAddressRow = {
  id: string;

  wallet_id: string;
  user_id: string;

  network: WalletAddress["network"];

  address: string;

  label: string | null;

  status: WalletAddress["status"];

  is_default: boolean;

  validation_status: WalletAddress["validation_status"];
  validation_error: string | null;

  validated_at: Date | null;

  is_verified: boolean;
  verified_at: Date | null;

  used_count: number | string | null;

  last_used_at: Date | null;

  created_at: Date;
  updated_at: Date;

  deleted_at: Date | null;

  created_by: string | null;
  updated_by: string | null;
};

export function mapWalletAddress(
  row: WalletAddressRow
): WalletAddress {
  return {
    id: row.id,

    wallet_id: row.wallet_id,
    user_id: row.user_id,

    network: row.network,

    address: row.address,

    label: row.label,

    status: row.status,

    is_default: row.is_default,

    validation_status: row.validation_status,
    validation_error: row.validation_error,

    validated_at: row.validated_at,

    is_verified: row.is_verified,
    verified_at: row.verified_at,

    used_count: Number(row.used_count ?? 0),

    last_used_at: row.last_used_at,

    created_at: row.created_at,
    updated_at: row.updated_at,

    deleted_at: row.deleted_at,

    created_by: row.created_by,
    updated_by: row.updated_by,
  };
}
