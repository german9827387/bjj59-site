import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Verify HMAC-signed session token using Web Crypto API (Edge-compatible). */
async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const dotIdx = token.lastIndexOf(".");
    if (dotIdx === -1) return false;
    const payload = token.slice(0, dotIdx);
    const sigHex = token.slice(dotIdx + 1);

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBytes = new Uint8Array(
      sigHex.match(/.{2}/g)?.map((h) => parseInt(h, 16)) ?? []
    );

    const ok = await crypto.subtle.verify(
      "HMAC",
      keyMaterial,
      sigBytes,
      new TextEncoder().encode(payload)
    );
    if (!ok) return false;

    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(b64);
    const { exp } = JSON.parse(json);
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const token = request.cookies.get("admin_session")?.value;
  const valid = token ? await verifyToken(token, secret) : false;

  if (!valid) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: ["/admin/:path*"],
};
