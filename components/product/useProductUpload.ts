"use client";

import {
  useState,
} from "react";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import {
  uploadProductImages,
  uploadProductDetailImages,
} from "./product-upload";

import {
  notifyUploadFailed,
} from "./product-notify";

import type {
  ProductFormErrors,
} from "./product-form.types";

import type {
  useProductForm,
} from "./useProductForm";

/* =========================
   TYPES
========================= */

type ProductUploadTranslations =
  Parameters<
    typeof notifyUploadFailed
  >[0];

type ProductFormController =
  ReturnType<typeof useProductForm>;

interface UseProductUploadParams {
  form: ProductFormController;

  userId?: string;

  setErrors: Dispatch<
    SetStateAction<ProductFormErrors>
  >;

  t: ProductUploadTranslations;
}

/* =========================
   HOOK
========================= */

export function useProductUpload({
  form,
  userId,
  setErrors,
  t,
}: UseProductUploadParams) {
  const [
    uploading,
    setUploading,
  ] = useState(false);

  /* =========================
     MAIN IMAGE UPLOAD
  ========================= */

  const handleUpload = async (
    files: File[]
  ) => {
    if (!files.length) {
      return;
    }

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
      !userId
    ) {
      return;
    }

    try {
      const urls =
        await uploadProductDetailImages(
          files,
          userId
        );

      form.setDetail(
        (prev: string) => {
          const html = urls
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

  return {
    uploading,
    handleUpload,
    uploadDetailImages,
  };
}
