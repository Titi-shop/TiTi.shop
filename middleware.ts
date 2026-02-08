import { NextRequest, NextResponse } from "next/server";

/**
 * Bật / tắt Pi Browser guard
 * - PI_BROWSER_ONLY=false  → cho phép Chrome (DEV)
 * - mặc định / production  → chỉ Pi Browser
 */
const ENABLE_PI_GUARD = process.env.PI_BROWSER_ONLY !== "false";

// Heuristic User-Agent check
function isPiBrowser(req: NextRequest): boolean {
  const ua = req.headers.get("user-agent") || "";
  return /PiBrowser/i.test(ua);
}

export function middleware(req: NextRequest) {
  // Guard bị tắt → cho qua tất cả
  if (!ENABLE_PI_GUARD) {
    return NextResponse.next();
  }

  const { pathname, searchParams } = req.nextUrl;

  // Bỏ qua tài nguyên nội bộ của Next + static
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap")
  ) {
    return NextResponse.next();
  }

  // Chỉ chặn navigation document (không chặn fetch/XHR)
  const secFetchDest = req.headers.get("sec-fetch-dest") || "";
  const isDocument = secFetchDest === "document";

  // Nếu không phải Pi Browser
  if (isDocument && !isPiBrowser(req)) {
    // ❗️Tránh redirect loop
    if (pathname === "/" && searchParams.has("reason")) {
      return NextResponse.next();
    }

    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("reason", "pi_browser_required");

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/).*)"],
};
