import crypto from "crypto";

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET env var is required");
  return s;
}

/** Creates a signed HMAC session token: base64url(payload).hex(signature) */
export function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + SESSION_DURATION_MS })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

/** Verifies the token signature and expiry. Constant-time comparison. */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const dotIdx = token.lastIndexOf(".");
    if (dotIdx === -1) return false;
    const payload = token.slice(0, dotIdx);
    const sig = token.slice(dotIdx + 1);
    const expected = crypto
      .createHmac("sha256", getSecret())
      .update(payload)
      .digest("hex");
    const sigBuf = Buffer.from(sig.padEnd(expected.length, "0"), "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length) return false;
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;
    const { exp } = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8")
    );
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
}
