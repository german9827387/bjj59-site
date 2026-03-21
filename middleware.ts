import { NextRequest, NextResponse } from "next/server";

/** Verify HMAC-signed session token using Web Crypto API (Edge-compatible). */
async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const dotIdx = token.lastIndexOf(".");
    if (dotIdx === -1) return false;
    const payload = token.slice(0, dotIdx);
    const sig = token.slice(dotIdx + 1);

    // Re-compute HMAC
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const mac = await crypto.subtle.sign(
      "HMAC",
      keyMaterial,
      new TextEncoder().encode(payload)
    );
    const expected = Array.from(new Uint8Array(mac))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Constant-time comparison via subtle.verify instead of string equality
    const sigBytes = Uint8Array.from(
      sig.match(/.{2}/g)?.map((h) => parseInt(h, 16)) ?? []
    );
    const ok = await crypto.subtle.verify(
      "HMAC",
      keyMaterial,
      sigBytes,
      new TextEncoder().encode(payload)
    );
    if (!ok) return false;

    // Декодируем base64url вручную (atob понимает только стандартный base64)
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(b64);
    const { exp } = JSON.parse(json);
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const token = req.cookies.get("admin_session")?.value;
  const valid = token ? await verifyToken(token, secret) : false;

  if (!valid) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
