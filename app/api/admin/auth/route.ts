import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { createSessionToken, verifySessionToken } from "@/lib/session";

const SESSION_COOKIE = "admin_session";
const IS_PROD = process.env.NODE_ENV === "production";

// Simple in-memory rate limiter for brute-force protection
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_ATTEMPTS) return false;
  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkLoginRateLimit(ip)) {
    return NextResponse.json({ error: "Слишком много попыток. Попробуйте позже." }, { status: 429 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD env var is not set");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const password = String(body.password ?? "");
  const pwBuf = Buffer.from(password);
  const adminBuf = Buffer.from(adminPassword);
  if (pwBuf.length !== adminBuf.length || !crypto.timingSafeEqual(pwBuf, adminBuf)) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  const token = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: IS_PROD,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
    sameSite: "strict",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0, httpOnly: true, secure: IS_PROD, sameSite: "strict" });
  return res;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return NextResponse.json({ authenticated: verifySessionToken(token) });
}
