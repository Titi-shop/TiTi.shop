import { query } from "@/lib/db";

import type {
  ProductRow,
  ProductRecord,
  RelatedProduct,
} from "@/types/Product";
import {
  isUUID,
  log,
  logError,
  maskId,
} from "./helpers";

import {
  mapRow,
} from "./mapper";

/* =========================================================
   GET ALL PRODUCTS
========================================================= */

export async function getAllProducts(
  limit = 20
): Promise<ProductRecord[]> {
  log(
    "GET_ALL_START",
    { limit }
  );

  try {
    const { rows } =
      await query<ProductRow>(
        `
        SELECT
  p.*,

  (
    SELECT COUNT(*)
    FROM product_favorites pf
    WHERE pf.product_id = p.id
  )::int AS favorite_count

FROM products p

WHERE p.deleted_at IS NULL
ORDER BY p.created_at DESC
LIMIT $1
        `,
        [limit]
      );

    log(
      "GET_ALL_SUCCESS",
      {
        count:
          rows.length,
      }
    );

    return rows.map(
      mapRow
    );
  } catch (error) {
    logError(
      "GET_ALL_ERROR",
      error
    );

    throw error;
  }
}

/* =========================================================
   GET PRODUCT BY ID
========================================================= */

export async function getProductById(
  productId: string,
  userId: string | null = null,
  caller: string = "UNKNOWN"
): Promise<ProductRecord | null> {
  log("GET_BY_ID_START", {
    productId: maskId(productId),
    caller,
  });
  try {
    if (!productId || !isUUID(productId)) {
      log("GET_BY_ID_INVALID_ID", {
        productId,
      });

      return null;
    }

    const { rows } = await query<ProductRow>(
      `
      SELECT
        p.*,

        (
          SELECT COUNT(*)
          FROM product_favorites pf
          WHERE pf.product_id = p.id
        )::int AS favorite_count,

        COALESCE(
          EXISTS (
            SELECT 1
            FROM product_favorites pf
            WHERE pf.product_id = p.id
              AND pf.user_id = $2
          ),
          FALSE
        ) AS is_favorite

      FROM products p

      WHERE p.id = $1
        AND p.deleted_at IS NULL

      LIMIT 1
      `,
      [
        productId,
        userId,
      ]
    );

    const row = rows[0] ?? null;

    if (!row) {
      log("GET_BY_ID_NOT_FOUND", {
        productId: maskId(productId),
      });

      return null;
    }

    const product = mapRow(row);

    log("GET_BY_ID_SUCCESS", {
      productId: maskId(productId),
    });

    return product;
  } catch (error) {
    logError("GET_BY_ID_ERROR", error);

    throw error;
  }
}
/* =========================================================
   GET PRODUCT METADATA
========================================================= */

export type ProductMetadataRecord = {
  name: string;
  short_description: string | null;
  description: string | null;
  thumbnail: string | null;
};

export async function getProductMetadata(
  productId: string
): Promise<ProductMetadataRecord | null> {
  if (!productId || !isUUID(productId)) {
    return null;
  }

  const { rows } = await query<ProductMetadataRecord>(
    `
    SELECT
      name,
      short_description,
      description,
      thumbnail
    FROM products
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [productId]
  );

  return rows[0] ?? null;
}
/* =========================================================
   GET PRODUCTS BY IDS
========================================================= */

export async function getProductsByIds(
  ids: string[]
): Promise<ProductRecord[]> {

  log(
    "GET_BY_IDS_START",
    {
      count: ids.length,
    }
  );

  try {

    if (!Array.isArray(ids)) {
      throw new Error(
        "INVALID_PRODUCT_IDS"
      );
    }

    const validIds =
      ids.filter(isUUID);

    if (
      validIds.length === 0
    ) {

      log(
        "GET_BY_IDS_EMPTY"
      );

      return [];
    }

    const result =
      await query<ProductRow>(
        `
        SELECT
          p.*,

          (
            SELECT COUNT(*)
            FROM product_favorites pf
            WHERE pf.product_id = p.id
          )::int AS favorite_count

        FROM products p

        WHERE p.id = ANY($1::uuid[])
          AND p.deleted_at IS NULL
        `,
        [validIds]
      );

    log(
      "GET_BY_IDS_SUCCESS",
      {
        count:
          result.rows.length,
      }
    );

    return result.rows.map(
      mapRow
    );

  } catch (error) {

    logError(
      "GET_BY_IDS_ERROR",
      error
    );

    throw error;
  }
}

/* =========================================================
   GET SELLER PRODUCTS
========================================================= */

export async function getSellerProducts(
  seller_id: string
): Promise<ProductRecord[]> {
  log(
    "GET_SELLER_PRODUCTS_START",
   {
  sellerId:
    maskId(seller_id),
}
  );

  try {
    if (!isUUID(seller_id)) {
      return [];
    }

    const result =
      await query<ProductRow>(
        `
        SELECT
  p.*,

  MIN(
    COALESCE(
      pv.final_price,
      pv.sale_price,
      pv.price
    )
  ) AS min_price,

  MIN(
    CASE
      WHEN pv.sale_enabled = true
      THEN pv.sale_price
      ELSE NULL
    END
  ) AS min_sale_price,

  up.shop_name,
  up.shop_banner,
  up.avatar_url,
  up.total_sales,
  up.shop_description

FROM products p

LEFT JOIN product_variants pv
  ON pv.product_id = p.id
 AND pv.deleted_at IS NULL

LEFT JOIN user_profiles up
  ON up.user_id = p.seller_id

WHERE p.seller_id = $1
  AND p.deleted_at IS NULL

GROUP BY
  p.id,
  up.shop_name,
  up.shop_banner,
  up.avatar_url,
  up.total_sales,
  up.shop_description

ORDER BY p.created_at DESC
        `,
        [seller_id]
      );

    log(
  "GET_SELLER_PRODUCTS_SUCCESS",
  {
    count:
      result.rows.length,
  }
);

    return result.rows.map(
      mapRow
    );
  } catch (error) {
    logError(
      "GET_SELLER_PRODUCTS_ERROR",
      error
    );

    throw error;
  }
}
/* =========================================================
   GET PRODUCTS BY CATEGORY
========================================================= */

export async function getProductsByCategory(
  categoryId: string,
  limit = 10
): Promise<ProductRecord[]> {

  log(
    "GET_BY_CATEGORY_START",
    {
      categoryId:
        maskId(categoryId),
      limit,
    }
  );

  try {

    const result =
      await query<ProductRow>(
        `
        SELECT
          p.*,

          (
            SELECT COUNT(*)
            FROM product_favorites pf
            WHERE pf.product_id = p.id
          )::int AS favorite_count

        FROM products p

        WHERE p.category_id = $1
  AND p.deleted_at IS NULL
  AND p.is_active = true

ORDER BY
  p.sold DESC,
  p.rating_avg DESC,
  p.created_at DESC

LIMIT $2
        `,
        [
          categoryId,
          limit,
        ]
      );

    log(
      "GET_BY_CATEGORY_SUCCESS",
      {
        count:
          result.rows.length,
      }
    );

    return result.rows.map(
      mapRow
    );

  } catch (error) {

    logError(
      "GET_BY_CATEGORY_ERROR",
      error
    );

    throw error;
  }
}
/* =========================================================
   GET RELATED PRODUCTS BY CATEGORY
   Lightweight query for product detail page
========================================================= */

export async function getRelatedProductsByCategory(
  categoryId: string,
  excludeProductId: string,
  limit = 10
): Promise<ProductRecord[]> {
  log("GET_RELATED_START", {
    categoryId: maskId(categoryId),
    productId: maskId(excludeProductId),
    limit,
  });

  try {
    const result = await query<ProductRow>(
      `
      SELECT
        p.*,

        (
          SELECT COUNT(*)
          FROM product_favorites pf
          WHERE pf.product_id = p.id
        )::int AS favorite_count,

        CASE
          WHEN p.has_variants = TRUE
          THEN (
            SELECT MIN(
              CASE
                WHEN pv.sale_enabled = TRUE
                  AND pv.sale_price IS NOT NULL
                  AND pv.sale_price < pv.price
                THEN pv.sale_price
                ELSE pv.price
              END
            )
            FROM product_variants pv
            WHERE pv.product_id = p.id
              AND pv.deleted_at IS NULL
          )
          ELSE
            CASE
              WHEN p.sale_enabled = TRUE
                AND p.sale_price IS NOT NULL
                AND p.sale_price < p.price
              THEN p.sale_price
              ELSE p.price
            END
        END AS final_price

      FROM products p

      WHERE p.category_id = $1
        AND p.id <> $2
        AND p.deleted_at IS NULL
        AND p.is_active = TRUE

      ORDER BY
        p.sold DESC,
        p.rating_avg DESC,
        p.created_at DESC

      LIMIT $3
      `,
      [
        categoryId,
        excludeProductId,
        limit,
      ]
    );

    log("GET_RELATED_SUCCESS", {
      count: result.rows.length,
    });

    return result.rows.map(
      mapRow
    );
  } catch (error) {
    logError(
      "GET_RELATED_ERROR",
      error
    );

    throw error;
  }
}