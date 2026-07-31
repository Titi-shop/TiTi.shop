/* =========================================================
   Pi Auth Utility
   - Client: get accessToken từ Pi Browser / OAuth storage
   - Server: verify accessToken với Pi API
   Architecture:
   NETWORK-FIRST + AUTH-CENTRIC
========================================================= */

import {
  logger,
  maskId,
} from "@/lib/logger";

let cachedToken: string | null = null;
let authPromise: Promise<string> | null = null;

/* =========================================================
   PI TYPES
========================================================= */

type PiIncompletePayment = {
  identifier?: string;
  amount?: number;
  memo?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
};


/* =========================================================
   CLIENT: GET PI ACCESS TOKEN
========================================================= */

export async function getPiAccessToken(
  forceRefresh = false
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("PI_BROWSER_REQUIRED");
  }

  const storedToken =
    localStorage.getItem("pi_access_token");

  /*
   * Browser thường / OAuth:
   * Không có Pi SDK.
   *
   * Token OAuth đã được callback lưu vào pi_access_token.
   * Trước khi sử dụng lại, xác minh token với Pi /v2/me.
   */
  if (
    !forceRefresh &&
    !window.Pi &&
    storedToken
  ) {
    try {
      const res = await fetch(
        "https://api.minepi.com/v2/me",
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (res.ok) {
        cachedToken = storedToken;
        return storedToken;
      }

      localStorage.removeItem(
        "pi_access_token"
      );
    } catch {
      /*
       * Không coi lỗi mạng là token hợp lệ.
       * Xóa token để tránh tiếp tục sử dụng credential
       * chưa xác minh.
       */
      localStorage.removeItem(
        "pi_access_token"
      );
    }
  }

  /*
   * Pi Browser:
   * Có thể sử dụng token hiện có khi không force refresh.
   */
  if (
    !forceRefresh &&
    window.Pi &&
    storedToken
  ) {
    cachedToken = storedToken;
    return storedToken;
  }

  // Cache trong bộ nhớ.
  if (!forceRefresh && cachedToken) {
    return cachedToken;
  }

  // Nếu authentication đang chạy thì dùng cùng Promise.
  if (authPromise) {
    return authPromise;
  }

  /*
   * Không có Pi SDK:
   * Browser OAuth phải chạy lại /pilogin,
   * không giả lập refresh token.
   */
  if (
    !window.Pi ||
    typeof window.Pi.authenticate !== "function"
  ) {
    throw new Error("PI_SDK_NOT_AVAILABLE");
  }

  const scopes = [
    "username",
    "payments",
  ];

  authPromise = (async () => {
    try {
      const auth =
        await window.Pi!.authenticate(
          scopes,
          async (
            payment: PiIncompletePayment
          ) => {
            const paymentId =
              typeof payment.identifier === "string"
                ? payment.identifier
                : "";

            const transaction =
              (
                payment as {
                  transaction?: {
                    txid?: string;
                  };
                }
              ).transaction;

            const txid =
              typeof transaction?.txid === "string"
                ? transaction.txid
                : "";

            logger.info(
              "PI.AUTH.INCOMPLETE_FOUND",
              {
                paymentId:
                  maskId(paymentId),
                hasTxid: !!txid,
              }
            );

            if (paymentId) {
              localStorage.setItem(
                "pi:lastPaymentId",
                paymentId
              );

              logger.debug(
                "PI.AUTH.PAYMENT_ID_SAVED"
              );
            }

            if (txid) {
              localStorage.setItem(
                "pi:lastTxid",
                txid
              );

              logger.debug(
                "PI.AUTH.TXID_SAVED"
              );
            }

            /*
             * AUTO COMPLETE incomplete payment.
             * Giữ nguyên hành vi hiện tại.
             */
            if (paymentId && txid) {
              try {
                logger.info(
                  "PI.AUTH.AUTO_COMPLETE_START",
                  {
                    paymentId:
                      maskId(paymentId),
                  }
                );

                const token =
                  await getPiAccessToken(true);

                const res = await fetch(
                  "/api/pi/complete-incomplete",
                  {
                    method: "POST",
                    headers: {
                      Authorization:
                        `Bearer ${token}`,
                      "Content-Type":
                        "application/json",
                    },
                    body: JSON.stringify({
                      paymentId,
                      txid,
                    }),
                  }
                );

                logger.info(
                  "PI.AUTH.AUTO_COMPLETE_RESULT",
                  {
                    paymentId:
                      maskId(paymentId),
                    status: res.status,
                    ok: res.ok,
                  }
                );
              } catch (err) {
                logger.error(
                  "PI.AUTH.AUTO_COMPLETE_ERROR",
                  {
                    paymentId:
                      maskId(paymentId),
                    message:
                      err instanceof Error
                        ? err.message
                        : "UNKNOWN_ERROR",
                  }
                );

                if (
                  process.env.NODE_ENV !==
                  "production"
                ) {
                  console.error(err);
                }
              }
            }
          }
        );

      logger.info(
        "PI.AUTH.SUCCESS",
        {
          hasUser: !!auth.user,
        }
      );

      logger.debug(
        "PI.AUTH.TOKEN_RECEIVED"
      );

      if (!auth?.accessToken) {
        throw new Error(
          "PI_AUTH_FAILED"
        );
      }

      cachedToken = auth.accessToken;

      /*
       * Thống nhất OAuth và Pi Browser cùng sử dụng
       * pi_access_token.
       */
      localStorage.setItem(
        "pi_access_token",
        auth.accessToken
      );

      return auth.accessToken;
    } finally {
      authPromise = null;
    }
  })();

  return authPromise;
}

/* =========================================================
   CLEAR TOKEN (LOGOUT)
========================================================= */

export function clearPiToken(): void {
  cachedToken = null;
  authPromise = null;

  if (typeof window !== "undefined") {
    localStorage.removeItem(
      "pi_access_token"
    );
  }

  logger.info(
    "PI.AUTH.CLEARED"
  );
}
