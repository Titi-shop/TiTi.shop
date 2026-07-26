
"use client";

import { FormEvent, useState } from "react";
import { useTranslationClient as useTranslation } from "@/app/lib/i18n/client";
import { useAuth } from "@/context/AuthContext";
import { useProductForm } from "./product/useProductForm";
import ShippingRates from "./product/ShippingRates";
import VariantEditor from "./product/VariantEditor";
import { buildProductPayload } from "./product/product-form.payload";

import {
  inputClass,
  inputStyle,
  cardStyle,
  getDateTimeInputStyle,
  imagePreviewStyle,
  imageRemoveButtonStyle,
  getImageUploadStyle,
  detailImageUploadStyle,
  loadingStyle,
  getSubmitButtonStyle,
} from "./product/product-form.styles";

import {
  validateProductForm,
} from "./product/product-form.validation";

import {
  notifyProductValidation,
  notifyUploadFailed,
  notifySubmitFailed,
  notifySaleStockExceeded,
} from "./product/product-notify";

import type {
  ProductFormProps,
  ProductFormErrors,
} from "./product/product-form.types";
import {
  uploadProductImages,
  uploadProductDetailImages,
} from "./product/product-upload";

/* =========================
   COMPONENT
========================= */

export default function ProductForm({
  categories,
  initialData,
  onSubmit,
}: ProductFormProps) {
  const { t } = useTranslation();

  const { user, loading } = useAuth();
  const form = useProductForm(initialData);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] =
  useState<ProductFormErrors>({});

  
  /* =========================
     HELPERS
  ========================= */

  const toNumber = (value: string): number => {
    if (value.trim() === "") return 0;

    const n = Number(value);
    return Number.isNaN(n) ? 0 : n;
  };

  /* =========================
     MAIN IMAGE UPLOAD
  ========================= */

  const handleUpload = async (
  files: File[]
) => {
  if (!files.length) return;

  try {
    setUploading(true);

    const urls =
      await uploadProductImages(
        files
      );

    form.setImages(
      (prev: string[]) => [
        ...prev,
        ...urls,
      ]
    );

    setErrors((prev) => ({
      ...prev,
      images: false,
    }));
  } catch (error) {
    console.error(
      "💥 UPLOAD ERROR:",
      error
    );

    notifyUploadFailed(t);
  } finally {
    setUploading(false);
  }
};

  /* =========================
     DETAIL IMAGE UPLOAD
  ========================= */

  const uploadDetailImages = async (
  files: File[]
) => {
  if (
    !files.length ||
    !user
  ) {
    return;
  }

  try {
    const urls =
      await uploadProductDetailImages(
        files,
        user.id
      );

    form.setDetail(
      (prev: string) => {
        const html =
          urls
            .map(
              (url) =>
                `<img src="${url}" />`
            )
            .join("\n");

        return `${prev}\n${html}`;
      }
    );
  } catch (error) {
    console.error(
      "💥 DETAIL IMAGE ERROR:",
      error
    );

    notifyUploadFailed(t);
  }
};

  /* =========================
     LOADING
  ========================= */

  if (loading || !user) {
  return (
    <div
      className="p-8 text-center"
      style={loadingStyle}
    >
      {t.loading}
    </div>
  );
}

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);

    try {
  /* =========================
     VALIDATION
  ========================= */

  const validation =
    validateProductForm(form);

  if (!validation.valid) {
  setErrors(
    validation.errors
  );

  notifyProductValidation(
    validation.message,
    t
  );

  return;
}

  setErrors({});

  /* =========================
     BUILD PAYLOAD
  ========================= */

  const payload =
    buildProductPayload(form);

  console.log(
    "🧪 FORM CATEGORY:",
    form.category_id
  );

  console.log(
    "📦 PRODUCT PAYLOAD:",
    payload
  );

  console.log(
    "📦 PRODUCT PAYLOAD",
    JSON.stringify(
      payload,
      null,
      2
    )
  );

  /* =========================
     SUBMIT
  ========================= */

} catch (error) {
  console.error(error);
  notifySubmitFailed(t);
} finally {
  setSubmitting(false);
}
};

/* =========================
   UI
========================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
  
  {/* CATEGORY */}
<select
  required
  value={form.category_id ?? ""}
  onChange={(e) => {
    setErrors((prev) => ({
      ...prev,
      category: false,
    }));

    form.setCategory_id(
      e.target.value
        ? Number(e.target.value)
        : ""
    );
  }}
 className={`w-full border p-2 rounded ${
  errors.category ? "border-red-500" : ""
}`}
style={inputStyle}
>
  <option value="">
    {t.select_category}
  </option>

  {categories.map((category) => (
    <option
      key={category.id}
      value={category.id}
    >
      {t[
        category.key as keyof typeof t
      ] || category.key}
    </option>
  ))}
</select>
      {/* NAME */}
      <input
  required
  value={form.name}
  onChange={(e) => {
    setErrors((prev) => ({
      ...prev,
      name: false,
    }));

    form.setName(
      e.target.value
    );
  }}
  placeholder={t.product_name}
  className={`w-full border p-2 rounded ${
  errors.name ? "border-red-500" : ""
}`}
style={inputStyle}
/>

      {/* IMAGES */}
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {form.images.map((img: string, i: number) => (
            <div
              key={`${img}-${i}`}
              className="relative group"
            >
             <img
  src={img}
  alt=""
  className="h-24 w-full object-cover rounded-lg border"
  style={imagePreviewStyle}
/>

              <button
                type="button"
                onClick={() =>
                  form.setImages((prev: string[]) =>
                    prev.filter(
                      (_, idx) => idx !== i
                    )
                  )
                }
               className="absolute top-1 right-1 px-2 rounded text-xs opacity-0 group-hover:opacity-100"
style={imageRemoveButtonStyle}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

       <label
  className="flex flex-col items-center justify-center border-2 border-dashed h-28 rounded-xl cursor-pointer transition-colors"
  style={getImageUploadStyle(
    Boolean(errors.images)
  )}
>
          {uploading
            ? t.uploading
            : t.upload_image}

          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={(e) =>
              handleUpload(
                Array.from(
                  e.target.files || []
                )
              )
            }
          />
        </label>
      </div>

      {/* PRICE */}
      {form.variants.length === 0 && (
        <>
         <input
  required
  type="number"
  step="0.00001"
  min="0.00001"
  inputMode="decimal"
  value={form.price}
  onChange={(e) => {
    setErrors((prev) => ({
      ...prev,
      price: false,
    }));

    form.setPrice(
      e.target.value
        ? Number(e.target.value)
        : ""
    );
  }}
  placeholder={t.price}
  className={`w-full border p-2 rounded ${
    errors.price
      ? "border-red-500"
      : ""
  }`}
  style={inputStyle}
/>

          {/* STOCK */}
          <input
            type="number"
            value={form.stock}
            onChange={(e) =>
              form.setStock(
                toNumber(e.target.value)
              )
            }
            placeholder={t.stock}
           className={inputClass}
            style={inputStyle}
          />

          {/* SALE ENABLE */}
          <label
  className="flex justify-between border p-2 rounded"
  style={cardStyle}
>
            <span>{t.enable_sale}</span>

            <input
              type="checkbox"
              checked={Boolean(form.sale_enabled)}
              onChange={(e) => {
                const checked =
                  e.target.checked;

                form.setSale_enabled(checked);
                if (!checked) {
                  form.setSale_start("");
                    form.setSale_end("");
                  form.setSale_price("");
                  form.setSale_stock(0);
                }
              }}
            />
          </label>

          {/* SALE PRICE */}
          {form.sale_enabled && (
            <input
  type="number"
  step="0.00001"
  min="0.00001"
  inputMode="decimal"
  value={
    form.sale_price === ""
      ? ""
      : form.sale_price
  }
  onChange={(e) => {
    setErrors((prev) => ({
      ...prev,
      sale_price: false,
    }));

    const value =
      e.target.value;

    if (value === "") {
      form.setSale_price("");
      return;
    }

    form.setSale_price(
      Number(value)
    );
  }}
  placeholder={t.sale_price}
  className={`w-full border p-2 rounded ${
  errors.sale_price
    ? "border-red-500"
    : ""
}`}
style={inputStyle}
/>
          )}

          {/* SALE STOCK */}
      {form.sale_enabled && (
        <input
          type="number"
          value={form.sale_stock || 0}
          onChange={(e) => {
            setErrors((prev) => ({
              ...prev,
              sale_stock: false,
            }));

            const value = Number(
              e.target.value
            );

            if (value > form.stock) {
        notifySaleStockExceeded(t);
     return;
     }

            form.setSale_stock(value);
          }}
          placeholder={t.sale_stock}
          className={`w-full border p-2 rounded ${
  errors.sale_stock
    ? "border-red-500"
    : ""
}`}
style={inputStyle}
/>
      )}
</>
)}
      {/* SALE TIME */}
<div className="grid grid-cols-2 gap-2">
  <input
  type="datetime-local"
  value={form.sale_start || ""}
  onChange={(e) => {
    setErrors((prev) => ({
      ...prev,
      sale_start: false,
    }));

    form.setSale_start(e.target.value);
  }}
  className={`border p-2 rounded ${
    errors.sale_start ? "border-red-500" : ""
  }`}
  style={getDateTimeInputStyle()}
/>

 <input
  type="datetime-local"
  value={form.sale_end || ""}
  onChange={(e) => {
    setErrors((prev) => ({
      ...prev,
      sale_end: false,
    }));

    form.setSale_end(e.target.value);
  }}
  className={`border p-2 rounded ${
    errors.sale_end ? "border-red-500" : ""
  }`}
  style={getDateTimeInputStyle()}
/>
</div>
  
      {/* SHIPPING */}
      <ShippingRates
  shipping_rates={form.shipping_rates}
  setShipping_rates={form.setShipping_rates}
  domestic_country_code={
    form.domestic_country_code
  }
  setDomestic_country_code={
    form.setDomestic_country_code
  }
/>
      {/* ACTIVE */}
      <label
  className="flex justify-between border p-3 rounded"
  style={cardStyle}
>
        <span>{t.active}</span>

        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) =>
            form.setIs_active(
              e.target.checked
            )
          }
        />
      </label>

      {/* VARIANTS */}
      <VariantEditor
        variants={form.variants}
        setVariants={form.setVariants}
      />

      {/* DESCRIPTION */}
      <textarea
        value={form.description}
        onChange={(e) =>
          form.setDescription(
            e.target.value
          )
        }
        placeholder={t.description}
       className="w-full border p-2 rounded min-h-[80px]"
style={inputStyle}
      />

      {/* DETAIL */}
      <textarea
        value={form.detail}
        onChange={(e) =>
          form.setDetail(
            e.target.value
          )
        }
        placeholder={t.product_detail}
       className="w-full border p-2 rounded min-h-[120px]"
style={inputStyle}
      />

      {/* DETAIL IMAGE */}
     <label
  className="border-2 border-dashed h-20 flex items-center justify-center rounded cursor-pointer"
  style={detailImageUploadStyle}
>
        {t.upload_detail_image}

        <input
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={(e) =>
            uploadDetailImages(
              Array.from(
                e.target.files || []
              )
            )
          }
        />
      </label>

      {/* SUBMIT */}
     <button
  type="submit"
  disabled={submitting}
  className="w-full py-3 rounded transition-all duration-200 active:scale-95"
  style={getSubmitButtonStyle(submitting)}
>
  {submitting
    ? t.submitting
    : t.submit_product}
</button>
    </form>
  );
}
