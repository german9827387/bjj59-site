import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { execSync } from "child_process";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";

const SESSION_COOKIE = "admin_session";

export async function requireAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export function readData<T>(file: string): T {
  const filePath = path.join(process.cwd(), "data", file);
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

export function writeData(file: string, data: unknown): void {
  const filePath = path.join(process.cwd(), "data", file);
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

  // Auto-commit to git after every admin change
  try {
    const cwd = process.cwd();
    const label = file.replace(".json", "");
    const now = new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Asia/Yekaterinburg",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
    execSync(`git add data/${file}`, { cwd });
    execSync(`git commit -m "admin: update ${label} (${now})"`, { cwd });
  } catch (e) {
    // Git not available or nothing to commit — not critical
    console.warn("[writeData] git commit skipped:", (e as Error).message?.split("\n")[0]);
  }
}
