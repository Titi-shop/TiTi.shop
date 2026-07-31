import { toUTCFromInput } from "@/lib/utils/time";

import type {
  ProductPayload,
  ProductVariant,
    ShippingRate,
    ShippingZone,
} from "@/types/Product";

/* =========================
   TYPES
========================= */

export interface ProductFormPayloadData {
  id?: unknown;

  name: string;

  category_id?:
    | string
    | number
    | null;

  description: string;
  detail: string;

  images: string[];

  is_active: boolean;

  price:
    | string
    | number;

  stock:
    | string
    | number;

  sale_enabled: boolean;

  sale_price?:
    | string
    | number
    | null;

  sale_stock?:
    | string
    | number
    | null;

  sale_start?:
    | string
    | null;

  sale_end?:
    | string
    | null;

  variants: ProductVariant[];

  shipping_rates: Record<
    string,
    string | number | null | undefined
  >;

  domestic_country_code?:
    | string
    | null;
}

/* =========================
   HELPERS
========================= */

const generateKey = (): string =>
  `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;

/* =========================
   BUILD PRODUCT PAYLOAD
========================= */

export function buildProductPayload(
  form: ProductFormPayloadData
): ProductPayload {
  const hasVariants =
    form.variants.length > 0;

  const hasSaleTime =
    Boolean(form.sale_start) &&
    Boolean(form.sale_end);

  const hasSalePrice =
    form.sale_price !== "" &&
    form.sale_price !== null &&
    form.sale_price !== undefined &&
    !Number.isNaN(
      Number(form.sale_price)
    );

  /* =========================
     SHIPPING
  ========================= */

  const shippingRatesPayload: ShippingRate[] =
    Object.entries(
      form.shipping_rates
    )
      .filter(([, price]) => {
        return (
          price !== "" &&
          price !== null &&
          price !== undefined
        );
      })
      .map(([zone, price]) => ({
        zone:
          zone as ShippingZone,

        price: Number(price),

        domestic_country_code:
          zone === "domestic"
            ? form.domestic_country_code ||
              null
            : null,
      }));

  /* =========================
     VARIANTS
  ========================= */

  const normalizedVariants: ProductVariant[] =
    form.variants.map((v) => ({
      ...v,

      sale_enabled:
        Boolean(v.sale_enabled),

      sale_price:
        v.sale_enabled &&
        v.sale_price !== null
          ? Number(v.sale_price)
          : null,

      sale_stock:
        v.sale_enabled
          ? Number(
              v.sale_stock || 0
            )
          : 0,

      sale_sold:
        Number(v.sale_sold || 0),

      final_price:
        v.sale_enabled &&
        v.sale_price !== null &&
        Number(v.sale_price) > 0 &&
        Number(v.sale_price) <
          Number(v.price)
          ? Number(v.sale_price)
          : Number(v.price),
    }));

  /* =========================
     VARIANT SALE
  ========================= */

  const hasVariantSale =
    normalizedVariants.some(
      (v) =>
        Boolean(v.sale_enabled) &&
        Number(v.sale_price) > 0
    );

  /* =========================
     PAYLOAD
  ========================= */

  const payload: ProductPayload = {
    ...(typeof form.id === "string"
      ? { id: form.id }
      : {}),
name: form.name,
    ...(form.category_id !== "" &&
    form.category_id !== null &&
    form.category_id !== undefined
      ? {
          category_id:
            Number(form.category_id),
        }
      : {}),
description:
      form.description,

    detail:
      form.detail,

    images:
      form.images,

    thumbnail:
      form.images[0] || null,

    is_active:
      form.is_active,

    has_variants:
      hasVariants,

    shipping_rates:
      shippingRatesPayload,

    domestic_country_code:
      form.domestic_country_code ||
      null,
      ...(!hasVariants
        ? {
            price:
              Number(form.price),

            stock:
              Number(form.stock || 0),
          }
        : {}),

    sale_enabled:
      hasVariants
        ? hasVariantSale
        : (
            form.sale_enabled &&
            hasSaleTime &&
            hasSalePrice
          ),

    sale_price:
      hasVariants
        ? null
        : !form.sale_enabled
          ? null
          : Number(
              form.sale_price
            ),

    sale_stock:
      hasVariants ||
      !form.sale_enabled
        ? 0
        : Number(
            form.sale_stock || 0
          ),

    sale_start:
      hasSaleTime &&
      form.sale_start
        ? toUTCFromInput(
            form.sale_start
          )
        : null,

    sale_end:
      hasSaleTime &&
      form.sale_end
        ? toUTCFromInput(
            form.sale_end
          )
        : null,

    variants:
      normalizedVariants,

    idempotency_key:
      generateKey(),
  };

  return payload;
}


