"use client";

import { apiAuthFetch } from "@/lib/api/apiAuthFetch";

/* =========================================================
TYPES
========================================================= */

export type PreviewKey = [
  url: string,
  address_id: string,
  quantity: number,
  product_id: string,
  variant_id: string | null
];

export interface PreviewResponse {
  buyer_zone: string;
  shipping_zone?: string;
  subtotal: number;
  shipping: number;
  shipping_fee?: number;
  total: number;
}

export interface AddressItem {
  id: string;
  full_name: string;
  phone: string;
  address_line: string;
  region: string;
  district?: string | null;
  ward?: string | null;
  country?: string | null;
  postal_code?: string | null;
  is_default: boolean;
}

export interface AddressResponse {
  items: AddressItem[];
}
export interface SaveAddressPayload {
  id?: string;
  full_name: string;
  phone: string;
  country: string;
  region: string;
  district: string;
  ward: string;
  address_line: string;
  postal_code: string | null;
  label: "home" | "office" | "other";
}
export interface ShippingAddress {
  id: string;
  name: string;
  phone: string;
  address_line: string;
  region: string;
  district: string;
  ward: string;
  country: string;
  postal_code: string | null;
}

/* =========================================================
PREVIEW FETCHER
========================================================= */

export async function previewFetcher(
  key: PreviewKey
): Promise<PreviewResponse> {
  const [
    url,
    address_id,
    quantity,
    product_id,
    variant_id,
  ] = key;

  if (process.env.NODE_ENV === "development") {
  console.log("[API PREVIEW CALL]", {
    address_id,
    quantity,
    product_id,
    variant_id,
  });
}
  
  const res = await apiAuthFetch(url, {
    method: "POST",
    body: JSON.stringify({
      address_id,
      items: [
        {
          product_id,
          variant_id,
          quantity,
        },
      ],
    }),
  });

  const data: PreviewResponse = await res.json();

  if (!res.ok) {
    throw new Error("PREVIEW_FAILED");
  }

  console.log("[PREVIEW RESPONSE]", data);

  return data;
}
/* =========================================================
MAP ADDRESS
========================================================= */

export function mapAddress(
  item: AddressItem
): ShippingAddress {
  return {
    id: item.id,
    name: item.full_name,
    phone: item.phone,
    address_line: item.address_line,
    region: item.region,
    district: item.district ?? "",
    ward: item.ward ?? "",
    country: item.country ?? "",
    postal_code: item.postal_code ?? null,
  };
}
/* =========================================================
DEFAULT ADDRESS
========================================================= */

export async function fetchDefaultAddress(): Promise<ShippingAddress | null> {
  try {
    const res = await apiAuthFetch("/api/address");

    if (!res.ok) {
      return null;
    }

    const data: AddressResponse = await res.json();
    const items = Array.isArray(data.items)
      ? data.items
      : [];

    const def = items.find(
    (a) =>
    a.is_default &&
    a.id &&
    a.country
    );

    if (!def) {
     return null;
     }

    return mapAddress(def);
  } catch (error) {
    console.error("[ADDRESS LOAD ERROR]", error);
    return null;
  }
}
 /* =========================================================
ALL ADDRESSES
========================================================= */

export async function fetchAddresses(): Promise<AddressItem[]> {
  const res = await apiAuthFetch("/api/address");

  if (!res.ok) {
    throw new Error("ADDRESS_LOAD_FAILED");
  }

  const data: AddressResponse =
    await res.json();

  return Array.isArray(data.items)
    ? data.items
    : [];
}

export async function createAddress(
  payload: SaveAddressPayload
): Promise<ShippingAddress> {
  const res = await apiAuthFetch(
    "/api/address",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error("CREATE_ADDRESS_FAILED");
  }

  const data: {
  address: AddressItem;
} = await res.json();

return mapAddress(data.address);
}

export async function updateAddress(
  payload: SaveAddressPayload
): Promise<ShippingAddress> {
  const res = await apiAuthFetch(
    "/api/address",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error("UPDATE_ADDRESS_FAILED");
  }

 const data: {
  address: AddressItem;
} = await res.json();

return mapAddress(data.address);
}

export async function setDefaultAddress(
  id: string
): Promise<void> {
  const res = await apiAuthFetch(
    "/api/address",
    {
      method: "PUT",
      body: JSON.stringify({
        id,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(
      "SET_DEFAULT_ADDRESS_FAILED"
    );
  }
}
export async function removeAddress(
  id: string
): Promise<void> {
  const res = await apiAuthFetch(
    `/api/address?id=${id}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error("DELETE_ADDRESS_FAILED");
  }
}

/* =========================================================
COUNTRY DISPLAY
========================================================= */

export function getCountryDisplay(
  country?: string | null
): string {
  return country?.toUpperCase() ?? "";
           }
