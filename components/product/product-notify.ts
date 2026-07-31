import type {
  ProductFormValidationMessage,
} from "./product-form.validation";

/* =========================
   TYPES
========================= */

export type ProductNotifyTranslations =
  Record<string, string>;

/* =========================
   BASIC NOTIFY
========================= */

export function notifyUploadFailed(
  t: ProductNotifyTranslations
): void {
  alert(t.upload_failed);
}

export function notifySubmitFailed(
  t: ProductNotifyTranslations
): void {
  alert(t.submit_failed);
}

export function notifySaleStockExceeded(
  t: ProductNotifyTranslations
): void {
  alert(t.sale_stock_exceed);
}

/* =========================
   VALIDATION NOTIFY
========================= */

export function notifyProductValidation(
  message:
    | ProductFormValidationMessage
    | undefined,
  t: ProductNotifyTranslations
): void {
  if (!message) {
    return;
  }

  switch (message) {
    case "sale_price_less_than_price":
      alert(
        t.sale_price_less_than_price
      );
      return;

    case "invalid_sale_time":
      alert(
        t.invalid_sale_time
      );
      return;

    case "sale_price_required":
      alert(
        t.sale_price_required
      );
      return;

    case "sale_date_required":
      alert(
        t.sale_date_required ??
          "Please select sale start and end date"
      );
      return;
  }
}
