import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";

const SESSION_COOKIE = "admin_session";

export async function requireAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

/*
  Куда админка сохраняет данные.

  Сайт живёт на Vercel: диск там только для чтения, git'а нет, а все
  `data/*.json` вшиваются в страницы при сборке. Прежняя реализация писала
  файл на диск и делала `git commit` — на проде это молча падало, а админка
  всё равно показывала «Сохранено ✓». За всё время ни одна правка из неё
  до сайта не дошла.

  Теперь сохранение — это коммит в репозиторий через GitHub API. Vercel
  видит коммит в `main` и пересобирает сайт сам, через одну-две минуты.
  История правок остаётся в git, ничего нового подключать не нужно.

  Без `GITHUB_TOKEN` (локальная разработка) пишем в файл, как раньше.
*/
const GITHUB_API = "https://api.github.com";

function github(): { token: string; repo: string; branch: string } | null {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  return {
    token,
    repo: process.env.GITHUB_REPO ?? "german9827387/bjj59-site",
    branch: process.env.GITHUB_BRANCH ?? "main",
  };
}

function ghHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "bjj59-admin",
  };
}

/** Ответ GitHub Contents API — только то, что читаем. */
interface GhContent {
  sha: string;
  content: string;
  encoding: string;
}

async function ghGet(file: string): Promise<GhContent | null> {
  const gh = github();
  if (!gh) return null;
  const res = await fetch(
    `${GITHUB_API}/repos/${gh.repo}/contents/data/${file}?ref=${encodeURIComponent(gh.branch)}`,
    { headers: ghHeaders(gh.token), cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error(`GitHub GET ${file}: ${res.status} ${(await res.text()).slice(0, 200)}`);
  }
  return (await res.json()) as GhContent;
}

/**
 * Что должно лежать в каждом файле. Админ-API принимало любой JSON —
 * кривой объект ломал сборку сайта, и никто не понимал, откуда.
 */
const SHAPES: Record<string, "array" | "object"> = {
  "trainers.json": "array",
  "directions.json": "array",
  "reviews.json": "array",
  "pricing.json": "array",
  "settings.json": "object",
  "gift.json": "object",
  "personal.json": "object",
};

export function assertShape(file: string, data: unknown): void {
  const shape = SHAPES[file];
  if (!shape) throw new Error(`Неизвестный файл данных: ${file}`);
  const ok =
    shape === "array"
      ? Array.isArray(data)
      : !!data && typeof data === "object" && !Array.isArray(data);
  if (!ok) throw new Error(`${file}: ожидается ${shape === "array" ? "список" : "объект"}`);
  if (shape === "array" && (data as unknown[]).length === 0) {
    throw new Error(`${file}: список пуст — так сайт останется без этого раздела`);
  }
}

/**
 * Читаем свежую версию из репозитория, а не из сборки: после сохранения и
 * до пересборки Vercel файл в сборке ещё старый, и админка показывала бы
 * человеку, что его правка «не сохранилась».
 */
export async function readData<T>(file: string): Promise<T> {
  const remote = await ghGet(file).catch((e) => {
    console.warn("[readData] GitHub недоступен, читаю из сборки:", (e as Error).message);
    return null;
  });
  if (remote) {
    return JSON.parse(Buffer.from(remote.content, "base64").toString("utf-8")) as T;
  }
  const filePath = path.join(process.cwd(), "data", file);
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

export async function writeData(file: string, data: unknown): Promise<void> {
  assertShape(file, data);
  const json = JSON.stringify(data, null, 2) + "\n";

  const gh = github();
  if (!gh) {
    writeFileSync(path.join(process.cwd(), "data", file), json, "utf-8");
    return;
  }

  const current = await ghGet(file);
  const now = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Yekaterinburg",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const res = await fetch(`${GITHUB_API}/repos/${gh.repo}/contents/data/${file}`, {
    method: "PUT",
    headers: { ...ghHeaders(gh.token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `admin: ${file.replace(".json", "")} (${now})`,
      content: Buffer.from(json, "utf-8").toString("base64"),
      branch: gh.branch,
      ...(current ? { sha: current.sha } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`GitHub PUT ${file}: ${res.status} ${(await res.text()).slice(0, 200)}`);
  }
}
