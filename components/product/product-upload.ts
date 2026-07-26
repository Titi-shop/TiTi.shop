import { compressImage } from "@/lib/upload/imageUtils";
import { apiAuthFetch } from "@/lib/api/apiAuthFetch";
import { supabase } from "@/lib/supabase/client";

import type {
  SignedUrlResponse,
} from "./product-form.types";

/* =========================
   SIGNED URL
========================= */

export async function getProductSignedUrl(): Promise<SignedUrlResponse> {
  const res = await apiAuthFetch(
    "/api/upload-url",
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    const text = await res.text();

    console.error(
      "❌ SIGNED URL FAIL:",
      text
    );

    throw new Error(
      "SIGNED_URL_FAILED"
    );
  }

  const data: SignedUrlResponse =
    await res.json();

  if (
    !data.uploadUrl ||
    !data.publicUrl
  ) {
    throw new Error(
      "NO_UPLOAD_URL"
    );
  }

  return data;
}

/* =========================
   UPLOAD WITH PROGRESS
========================= */

export function uploadProductWithProgress(
  url: string,
  file: File,
  index: number
): Promise<void> {
  return new Promise(
    (resolve, reject) => {
      const xhr =
        new XMLHttpRequest();

      xhr.open(
        "PUT",
        url
      );

      xhr.upload.onprogress = (
        event
      ) => {
        if (
          event.lengthComputable
        ) {
          const percent =
            Math.round(
              (
                event.loaded /
                event.total
              ) * 100
            );

          console.log(
            `📊 [${index}] ${percent}%`
          );
        }
      };

      xhr.onload = () => {
        if (
          xhr.status >= 200 &&
          xhr.status < 300
        ) {
          resolve();
          return;
        }

        reject(
          new Error(
            `UPLOAD_FAILED_${xhr.status}`
          )
        );
      };

      xhr.onerror = () => {
        reject(
          new Error(
            "NETWORK_ERROR"
          )
        );
      };

      xhr.setRequestHeader(
        "Content-Type",
        file.type
      );

      xhr.send(file);
    }
  );
}

/* =========================
   MAIN PRODUCT IMAGES
========================= */

export async function uploadProductImages(
  files: File[]
): Promise<string[]> {
  if (!files.length) {
    return [];
  }

  const uploads =
    files.map(
      async (
        file,
        index
      ) => {
        const compressed =
          await compressImage(
            file
          );

        const {
          uploadUrl,
          publicUrl,
        } =
          await getProductSignedUrl();

        await uploadProductWithProgress(
          uploadUrl,
          compressed,
          index
        );

        return publicUrl;
      }
    );

  return Promise.all(
    uploads
  );
}

/* =========================
   DETAIL IMAGES
========================= */

export async function uploadProductDetailImages(
  files: File[],
  userId: string
): Promise<string[]> {
  if (!files.length) {
    return [];
  }

  const uploads =
    files.map(
      async (
        file,
        index
      ) => {
        /*
         * Include index/random suffix so
         * multiple files cannot receive
         * the same path.
         */
        const path =
          `products/${userId}/detail-${Date.now()}-${index}-${Math.random()
            .toString(36)
            .slice(2)}.jpg`;

        const {
          error,
        } =
          await supabase.storage
            .from("products")
            .upload(
              path,
              file
            );

        if (error) {
          throw error;
        }

        const {
          data,
        } =
          supabase.storage
            .from("products")
            .getPublicUrl(
              path
            );

        if (
          !data.publicUrl
        ) {
          throw new Error(
            "NO_DETAIL_PUBLIC_URL"
          );
        }

        return data.publicUrl;
      }
    );

  return Promise.all(
    uploads
  );
}
