import { NextRequest, NextResponse } from "next/server";

const PI_ONLY = process.env.PI_BROWSER_ONLY === "true";

// Heuristic UA check
function isPiBrowser(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  return /PiBrowser/i.test(ua);
}

export function middleware(req: NextRequest) {
  try {
    if (!PI_ONLY) return NextResponse.next();

    const { pathname } = req.nextUrl;

    // ✅ Allow dev login & account
    if (
      pathname.startsWith("/pilogin") ||
      pathname.startsWith("/account")
    ) {
      return NextResponse.next();
    }

    // Allow internals & static
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon") ||
      pathname.startsWith("/robots") ||
      pathname.startsWith("/sitemap")
    ) {
      return NextResponse.next();
    }

    // Safari / iOS có thể KHÔNG có header này
    const secFetchDest = req.headers.get("sec-fetch-dest");
    const isDocument = secFetchDest === "document" || secFetchDest === null;

    if (isDocument && !isPiBrowser(req)) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("reason", "pi_browser_required");
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    // 🔥 CỰC KỲ QUAN TRỌNG – middleware KHÔNG ĐƯỢC CRASH
    console.error("❌ Middleware error:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api/).*)"],
};
