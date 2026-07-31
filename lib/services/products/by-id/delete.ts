import {
  getProductById,
  deleteProductById,
} from "@/lib/db/products";

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin";

import {
  log,
  logError,
  extractProductStoragePaths,
} from "./helpers";

/* =====================================================
   DELETE PRODUCT
===================================================== */

export async function deleteProductService(
  id: string,
  userId: string
) {
  log(
    "PRODUCT.DELETE",
    {
      event: "START",
      id,
    }
  );

  try {
    if (!id) {
      return {
        error:
          "INVALID_PRODUCT_ID",
      };
    }

    const product = await getProductById(
  id,
  null,
  "PRODUCT_DELETE"
);

    if (!product) {
      return {
        error:
          "PRODUCT_NOT_FOUND",
      };
    }

    log(
      "PRODUCT.DELETE",
      {
        event: "FOUND",
        id: product.id,
        imageCount:
          product.images
            ?.length ?? 0,
      }
    );

    const paths =
      extractProductStoragePaths(
        product.thumbnail,
        product.images
      );

    log(
      "PRODUCT.DELETE",
      {
        event: "STORAGE_PATHS",
        count:
          paths.length,
        paths,
      }
    );

    const result =
      await deleteProductById(
        id,
        userId
      );

    if (!result.ok) {
      return {
        error:
          "DELETE_FAILED",
      };
    }

    log(
      "PRODUCT.DELETE",
      {
        event: "DB_DELETE_SUCCESS",
        id,
      }
    );

    /* =========================
       DELETE STORAGE FILES
    ========================= */

    if (paths.length > 0) {
      const {
        data,
        error,
      } =
        await supabaseAdmin.storage
          .from("products")
          .remove(paths);

      if (error) {
        console.error(
          "💥 STORAGE_DELETE_ERROR",
          error
        );
      } else {
        log(
          "STORAGE.DELETE",
          {
            event: "DONE",
            count:
              paths.length,

            removed:
              data?.length ?? 0,
          }
        );
      }
    }

    log(
      "PRODUCT.DELETE",
      {
        event: "SUCCESS",
        id,
      }
    );

    return {
      success: true,
    };
  } catch (error) {
    logError(
      "PRODUCT.DELETE.ERROR",
      error
    );

    return {
      error:
        "INTERNAL_SERVER_ERROR",
    };
  }
}
