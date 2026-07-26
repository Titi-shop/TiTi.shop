import type {
  ProductVariant,
} from "@/types/product";

import type {
  ProductFormErrors,
} from "./product-form.types";

/* =========================
   TYPES
========================= */

export interface ProductFormValidationData {
  name: string;

  category_id?:
    | string
    | number
    | null;

  images: string[];

  price:
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
}

export type ProductFormValidationMessage =
  | "sale_price_less_than_price"
  | "invalid_sale_time"
  | "sale_price_required"
  | "sale_date_required";

export interface ProductFormValidationResult {
  valid: boolean;

  errors: ProductFormErrors;

  message?: ProductFormValidationMessage;

  hasVariants: boolean;

  hasSaleTime: boolean;

  hasSalePrice: boolean;

  hasVariantSale: boolean;
}

/* =========================
   VARIANT NORMALIZATION
========================= */

export function normalizeProductVariants(
  variants: ProductVariant[]
): ProductVariant[] {
  return variants.map((variant) => ({
    ...variant,

    sale_enabled:
      Boolean(variant.sale_enabled),

    sale_price:
      variant.sale_enabled &&
      variant.sale_price !== null
        ? Number(variant.sale_price)
        : null,

    sale_stock:
      variant.sale_enabled
        ? Number(variant.sale_stock || 0)
        : 0,

    sale_sold:
      Number(variant.sale_sold || 0),

    final_price:
      variant.sale_enabled &&
      variant.sale_price !== null &&
      Number(variant.sale_price) > 0 &&
      Number(variant.sale_price) <
        Number(variant.price)
        ? Number(variant.sale_price)
        : Number(variant.price),
  }));
}

/* =========================
   VALIDATE PRODUCT FORM
========================= */

export function validateProductForm(
  form: ProductFormValidationData
): ProductFormValidationResult {
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

  const normalizedVariants =
    normalizeProductVariants(
      form.variants
    );

  const hasVariantSale =
    normalizedVariants.some(
      (variant) =>
        Boolean(
          variant.sale_enabled
        ) &&
        Number(
          variant.sale_price
        ) > 0
    );

  const baseResult = {
    hasVariants,
    hasSaleTime,
    hasSalePrice,
    hasVariantSale,
  };

  /* =========================
     NAME
  ========================= */

  if (!form.name.trim()) {
    return {
      valid: false,
      errors: {
        name: true,
      },
      ...baseResult,
    };
  }

  /* =========================
     CATEGORY
  ========================= */

  if (
    !form.category_id ||
    Number(form.category_id) <= 0
  ) {
    return {
      valid: false,
      errors: {
        category: true,
      },
      ...baseResult,
    };
  }

  /* =========================
     IMAGES
  ========================= */

  if (!form.images.length) {
    return {
      valid: false,
      errors: {
        images: true,
      },
      ...baseResult,
    };
  }

  /* =========================
     STANDARD PRODUCT SALE
  ========================= */

  if (
    !hasVariants &&
    form.sale_enabled
  ) {
    const sale =
      Number(form.sale_price);

    const price =
      Number(form.price);

    /* =====================
       SALE PRICE
    ===================== */

    if (
      Number.isNaN(sale) ||
      sale < 0.00001
    ) {
      return {
        valid: false,
        errors: {
          sale_price: true,
        },
        ...baseResult,
      };
    }

    /* =====================
       SALE STOCK
    ===================== */

    if (
      !form.sale_stock ||
      Number(form.sale_stock) <= 0
    ) {
      return {
        valid: false,
        errors: {
          sale_stock: true,
        },
        ...baseResult,
      };
    }

    /* =====================
       SALE TIME
    ===================== */

    if (!hasSaleTime) {
      return {
        valid: false,
        errors: {
          sale_start:
            !form.sale_start,

          sale_end:
            !form.sale_end,
        },
        ...baseResult,
      };
    }

    /* =====================
       SALE PRICE < PRICE
    ===================== */

    if (sale >= price) {
      return {
        valid: false,
        errors: {},
        message:
          "sale_price_less_than_price",
        ...baseResult,
      };
    }

    /* =====================
       INVALID SALE RANGE
    ===================== */

    if (
      form.sale_start &&
      form.sale_end &&
      new Date(
        form.sale_start
      ).getTime() >=
        new Date(
          form.sale_end
        ).getTime()
    ) {
      return {
        valid: false,
        errors: {},
        message:
          "invalid_sale_time",
        ...baseResult,
      };
    }
  }

  /* =========================
     SALE TIME BUT NO PRICE
  ========================= */

  if (
    !hasVariants &&
    hasSaleTime &&
    !hasSalePrice
  ) {
    return {
      valid: false,
      errors: {},
      message:
        "sale_price_required",
      ...baseResult,
    };
  }

  /* =========================
     VARIANT SALE DATE
  ========================= */

  if (
    hasVariantSale &&
    (
      !form.sale_start ||
      !form.sale_end
    )
  ) {
    return {
      valid: false,

      errors: {
        sale_start:
          !form.sale_start,

        sale_end:
          !form.sale_end,
      },

      message:
        "sale_date_required",

      ...baseResult,
    };
  }

  /* =========================
     VARIANT SALE RANGE
  ========================= */

  if (
    hasVariantSale &&
    form.sale_start &&
    form.sale_end &&
    new Date(
      form.sale_start
    ).getTime() >=
      new Date(
        form.sale_end
      ).getTime()
  ) {
    return {
      valid: false,
      errors: {},
      message:
        "invalid_sale_time",
      ...baseResult,
    };
  }

  /* =========================
     VALID
  ========================= */

  return {
    valid: true,
    errors: {},
    ...baseResult,
  };
}
