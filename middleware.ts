export function middleware(req: NextRequest) {
  if (!PI_ONLY) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // ✅ THÊM ĐOẠN NÀY (CHO PHÉP LOGIN GIẢ KHI DEV)
  if (
    pathname.startsWith("/pilogin") ||
    pathname.startsWith("/account")
  ) {
    return NextResponse.next();
  }

  // ----- PHẦN DƯỚI GIỮ NGUYÊN -----

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap")
  ) {
    return NextResponse.next();
  }

  const secFetchDest = req.headers.get("sec-fetch-dest") || "";
  const isDocument = secFetchDest === "document";

  if (isDocument && !isPiBrowser(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("reason", "pi_browser_required");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
