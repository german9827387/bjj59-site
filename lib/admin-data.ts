import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";

export async function requireAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === "1";
}

export function readData<T>(file: string): T {
  const filePath = path.join(process.cwd(), "data", file);
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

export function writeData(file: string, data: unknown): void {
  const filePath = path.join(process.cwd(), "data", file);
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
