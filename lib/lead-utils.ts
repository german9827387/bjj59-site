const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function getUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const v = p.get(key) || sessionStorage.getItem(key);
    if (v) utm[key] = v;
  }
  return utm;
}

export function persistUtm(): void {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams(window.location.search);
  for (const key of UTM_KEYS) {
    const v = p.get(key);
    if (v) sessionStorage.setItem(key, v);
  }
}

/**
 * Приводит любой ввод к 11 цифрам вида 7XXXXXXXXXX.
 * Учитывает российскую привычку набирать номер с 8 (8 912… → 7 912…)
 * и ввод без кода страны (912… → 7 912…).
 * Нормализация идёт ДО обрезки до 11 цифр — иначе «8» съедала бы последнюю цифру.
 */
export function normalizePhone(val: string): string {
  let digits = val.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  else if (!digits.startsWith("7")) digits = "7" + digits;
  return digits.slice(0, 11);
}

/** Маска для поля ввода: +7 (912) 345-67-89 */
export function formatPhone(val: string): string {
  const d = normalizePhone(val);
  if (!d) return "";
  const p = d.slice(1);
  let out = "+7";
  // Строго `>`, а не `>=`: разделитель добавляется только когда за ним уже есть
  // цифра. Иначе Backspace стирал бы разделитель, маска дорисовывала его обратно,
  // и поле «залипало» — номер невозможно было исправить.
  if (p.length > 0) out += " (" + p.slice(0, 3);
  if (p.length > 3) out += ") " + p.slice(3, 6);
  if (p.length > 6) out += "-" + p.slice(6, 8);
  if (p.length > 8) out += "-" + p.slice(8, 10);
  return out;
}

/** Номер считается полным, когда после нормализации ровно 11 цифр. */
export function isValidPhone(val: string): boolean {
  return normalizePhone(val).length === 11;
}

export interface LeadPayload {
  name: string;
  phone: string;
  source: string;
  direction?: string;
  dayTime?: string;
}

export type LeadResult = { ok: true } | { ok: false; error: string };

const FALLBACK_ERROR = "Не удалось отправить заявку. Напишите нам в Telegram — ответим сразу.";

/**
 * Отправка заявки с ретраями. Повторяем только сетевые сбои и 5xx —
 * на 4xx (невалидные данные) повтор бессмысленен.
 * Дубль заявки лучше потерянной заявки, поэтому ретраим агрессивно.
 */
export async function postLead(payload: LeadPayload): Promise<LeadResult> {
  const body = JSON.stringify({
    name: payload.name.trim(),
    phone: formatPhone(payload.phone),
    source: payload.source,
    direction: payload.direction ?? "",
    dayTime: payload.dayTime ?? "",
    utm: getUtm(),
  });

  let lastError = FALLBACK_ERROR;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
      const data = await res.json().catch(() => ({} as { ok?: boolean; error?: string }));
      if (res.ok && data.ok) return { ok: true };
      if (res.status >= 400 && res.status < 500) {
        return { ok: false, error: data.error ?? FALLBACK_ERROR };
      }
      lastError = data.error ?? FALLBACK_ERROR;
    } catch {
      lastError = "Нет соединения. Проверьте интернет или напишите нам в Telegram.";
    }
    if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 800));
  }

  return { ok: false, error: lastError };
}

/** Цель Яндекс.Метрики. Безопасна, если счётчик ещё не загрузился. */
export function reachGoal(goal: string): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { ym?: (...a: unknown[]) => void; __YM_COUNTER_ID__?: number };
  if (typeof w.ym === "function" && w.__YM_COUNTER_ID__) {
    try {
      w.ym(w.__YM_COUNTER_ID__, "reachGoal", goal);
    } catch {
      /* метрика не должна ломать отправку заявки */
    }
  }
}
