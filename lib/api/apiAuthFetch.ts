import {
  getPiAccessToken,
  clearPiToken,
} from "@/lib/piAuth";

export async function apiAuthFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  if (typeof window === "undefined") {
    throw new Error("PI_BROWSER_REQUIRED");
  }

  let token =
    localStorage.getItem(
      "pi_access_token"
    );

  /*
   * Nếu chưa có token:
   * - Pi Browser: getPiAccessToken() có thể authenticate.
   * - Browser thường: token OAuth phải được lấy qua /pilogin.
   */
  if (!token) {
    try {
      token =
        await getPiAccessToken();
    } catch (err) {
      if (
        err instanceof Error &&
        err.message ===
          "PI_SDK_NOT_AVAILABLE"
      ) {
        throw new Error(
          "PI_REAUTH_REQUIRED"
        );
      }

      throw err;
    }
  }

  const doFetch = (
    tk: string
  ): Promise<Response> =>
    fetch(input, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization:
          `Bearer ${tk}`,
      },
    });

  let res =
    await doFetch(token);

  /*
   * 401:
   * Token hiện tại không còn được API chấp nhận.
   */
  if (res.status === 401) {
    clearPiToken();

    /*
     * Browser thường không có Pi SDK.
     * Không có refresh token để lấy token mới.
     * UI phải chạy lại OAuth qua /pilogin.
     */
    if (
      !window.Pi ||
      typeof window.Pi.authenticate !==
        "function"
    ) {
      throw new Error(
        "PI_REAUTH_REQUIRED"
      );
    }

    /*
     * Pi Browser:
     * chạy lại Pi authentication để lấy token mới.
     */
    const newToken =
      await getPiAccessToken(true);

    localStorage.setItem(
      "pi_access_token",
      newToken
    );

    /*
     * Chỉ retry đúng một lần.
     */
    res =
      await doFetch(newToken);
  }

  return res;
}
