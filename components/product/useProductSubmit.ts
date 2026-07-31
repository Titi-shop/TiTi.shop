
"use client";

import {
  useCallback,
  type FormEvent,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  validateProductForm,
} from "./product-form.validation";

import {
  buildProductPayload,
} from "./product-form.payload";

import {
  notifyProductValidation,
  notifySubmitFailed,
} from "./product-notify";

import type {
  ProductPayload,
} from "@/types/Product";

import type {
  ProductFormErrors,
} from "./product-form.types";

import type {
  useProductForm,
} from "./useProductForm";

/* =========================
   TYPES
========================= */

type ProductSubmitTranslations =
  Parameters<
    typeof notifyProductValidation
  >[1];

interface UseProductSubmitParams {
  form: ReturnType<typeof useProductForm>;

  submitting: boolean;

  setSubmitting: Dispatch<
    SetStateAction<boolean>
  >;

  setErrors: Dispatch<
    SetStateAction<ProductFormErrors>
  >;

  onSubmit: (
    payload: ProductPayload
  ) => Promise<void>;

  t: ProductSubmitTranslations;
}

/* =========================
   HOOK
========================= */

export function useProductSubmit({
  form,
  submitting,
  setSubmitting,
  setErrors,
  onSubmit,
  t,
}: UseProductSubmitParams) {
  const handleSubmit = useCallback(
    async (
      e: FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault();

      if (submitting) {
        return;
      }

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
          "TEGORY:",
          form.category_id
        );

        console.log(
          " PAYLOAD:",
          payload
        );

        /* =========================
           SUBMIT
        ========================= */

        await onSubmit(payload);
      } catch (error) {
        console.error(
          " SUBMIT ERROR:",
          error
        );

        notifySubmitFailed(t);
      } finally {
        setSubmitting(false);
      }
    },
    [
      form,
      submitting,
      setSubmitting,
      setErrors,
      onSubmit,
      t,
    ]
  );

  return {
    handleSubmit,
  };
}


