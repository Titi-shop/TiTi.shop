import type {
  ProductRequestBody,
} from "./types";

import type {
  Region,
  ShippingRateInput,
} from "@/lib/db/shipping";

/* =========================================================
   CATEGORY
========================================================= */

export function getCategoryId(
  body: ProductRequestBody
): number | null {
  return body.category_id ?? null;
}

/* =========================================================
   SHIPPING
========================================================= */

export function normalizeShippingRates(
  body: ProductRequestBody,
  primaryCountry?: string
): ShippingRateInput[] {
  const rates =
    body.shipping_rates ?? [];

  const validRegions = new Set<Region>([
    "domestic",
    "sea",
    "asia",
    "europe",
    "north_america",
    "rest_of_world",
  ]);

  return rates.flatMap(
    (rate): ShippingRateInput[] => {
      if (
        !validRegions.has(
          rate.zone as Region
        )
      ) {
        return [];
      }

      if (
        rate.price === null ||
        rate.price === undefined
      ) {
        return [];
      }

      const price =
        Number(rate.price);

      if (
        !Number.isFinite(price) ||
        price < 0
      ) {
        return [];
      }

      return [
        {
          zone:
            rate.zone as Region,

          price,

          domestic_country_code:
            rate.zone === "domestic"
              ? (
                  rate.domestic_country_code ??
                  primaryCountry ??
                  body.primary_shipping_country ??
                  body.domestic_country_code ??
                  null
                )
              : null,
        },
      ];
    }
  );
}

/* =========================================================
   SALE RULES
========================================================= */

export function buildSaleFields(
  body: ProductRequestBody,
  hasVariants: boolean
) {
  const sale_enabled =
    hasVariants
      ? false
      : Boolean(
          body.sale_enabled
        );

  const sale_price =
    hasVariants
      ? null
      : body.sale_price ?? null;

  const sale_stock =
    hasVariants
      ? null
      : Number(
          body.sale_stock ?? 0
        );

  const sale_start =
    hasVariants
      ? null
      : body.sale_start ?? null;

  const sale_end =
    hasVariants
      ? null
      : body.sale_end ?? null;

  return {
    sale_enabled,
    sale_price,
    sale_stock,
    sale_start,
    sale_end,
  };
}

/* =========================================================
   PRODUCT PRICE
========================================================= */

export function buildProductFields(
  body: ProductRequestBody,
  hasVariants: boolean
) {
  return {
    price: hasVariants
      ? null
      : Number(
          body.price ?? 0
        ),

    stock: hasVariants
      ? null
      : Number(
          body.stock ?? 0
        ),
  };
}
