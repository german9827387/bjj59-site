const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/**
 * Идентификаторы клика рекламных систем.
 *
 * Яндекс.Директ с включённой автоматической разметкой не ставит `utm_*`
 * вовсе — только `yclid`. Без этого списка платный трафик приходил бы в
 * заявке как «прямой заход», и реклама выглядела бы бесплатной.
 */
const CLICK_ID_KEYS = ["yclid", "ysclid", "gclid", "gbraid", "wbraid", "fbclid", "rb_clickid"] as const;

const TRACKED_KEYS: readonly string[] = [...UTM_KEYS, ...CLICK_ID_KEYS];

/** Ключи, где регистр — это шум: «VK» и «vk» иначе разъедутся в отчётах. */
const LOWERCASE_KEYS = new Set(["utm_source", "utm_medium"]);

const STORE_KEY = "bjj59_attribution";

/**
 * 90 дней — окно, за которое человек успевает подумать и вернуться.
 * Раньше метки жили в `sessionStorage`, то есть до закрытия вкладки: пришёл
 * с рекламы, закрыл, вечером вернулся напрямую — и заявка записывалась как
 * «прямой заход», хотя её купила реклама.
 */
const TTL_MS = 90 * 24 * 60 * 60 * 1000;

interface Touch {
  /** Метки и clickid из адреса. Пусто — заход без разметки. */
  params: Record<string, string>;
  /** Хост внешнего источника перехода. Только хост: путь — это уже чужие данные. */
  ref: string;
  at: number;
}

interface Attribution {
  /** Первое касание за окно: чем человека привели. */
  first: Touch;
  /** Последнее: с чего он пришёл в этот раз. */
  last: Touch;
}

/**
 * Хранилище переживает вкладку, но может быть недоступно: приватный режим
 * Safari бросает на запись. Тогда откатываемся на сессию — атрибуция в
 * пределах визита лучше, чем никакой, и ни один сбой хранилища не имеет
 * права уронить отправку заявки.
 */
function writeStore(value: Attribution): void {
  const raw = JSON.stringify(value);
  try {
    localStorage.setItem(STORE_KEY, raw);
    return;
  } catch {
    /* приватный режим или переполнение — пробуем сессию */
  }
  try {
    sessionStorage.setItem(STORE_KEY, raw);
  } catch {
    /* хранилища нет вовсе — метки уедут только из текущего адреса */
  }
}

function readStore(): Attribution | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORE_KEY) ?? sessionStorage.getItem(STORE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Attribution;
    if (!parsed?.last?.at || !parsed?.first) return null;
    // Просроченное касание хуже отсутствующего: оно припишет заявку рекламе,
    // которая крутилась полгода назад.
    if (Date.now() - parsed.last.at > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Метки и clickid из текущего адреса. */
function currentParams(): Record<string, string> {
  const p = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const key of TRACKED_KEYS) {
    const v = p.get(key)?.trim();
    if (v) out[key] = (LOWERCASE_KEYS.has(key) ? v.toLowerCase() : v).slice(0, 200);
  }
  return out;
}

/**
 * Хост, с которого пришёл человек, или пусто.
 *
 * Свои же страницы отбрасываем: внутренний переход не источник трафика, а
 * без этой проверки любая вторая страница выглядела бы переходом с bjj59.ru.
 */
function externalReferrer(): string {
  const ref = document.referrer;
  if (!ref) return "";
  try {
    const url = new URL(ref);
    const host = url.hostname.replace(/^www\./, "");
    if (host === window.location.hostname.replace(/^www\./, "")) return "";
    // Карты и поиск живут на одном хосте: `yandex.ru/maps` и `yandex.ru/search`
    // различимы только по пути. Без этой проверки переход из карточки
    // организации подписывался как «органический поиск» — а это разные каналы
    // с разными бюджетами. Берём не путь целиком, а только сам факт «/maps».
    if (/^\/maps(\/|$)/.test(url.pathname)) return `${host}/maps`.slice(0, 100);
    return host.slice(0, 100);
  } catch {
    return "";
  }
}

function touchLabel(touch: Touch): string {
  const source = touch.params.utm_source;
  if (source) {
    const campaign = touch.params.utm_campaign;
    return campaign ? `${source} / ${campaign}` : source;
  }
  const clickId = CLICK_ID_KEYS.find((k) => touch.params[k]);
  if (clickId) return clickId;
  return touch.ref;
}

function touchDate(at: number): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(at));
}

/**
 * Запомнить, с чего пришёл человек.
 *
 * Вызывается из общего [TgLinkHandler](../components/TgLinkHandler.tsx) на
 * каждой странице и из форм — вызов идемпотентен по смыслу: заход без меток
 * в адресе ничего не перезаписывает.
 */
export function persistUtm(): void {
  if (typeof window === "undefined") return;

  const params = currentParams();
  const stored = readStore();

  // Внутренний переход не имеет права стереть источник: без этой строки
  // клик по «Расписанию» превращал бы рекламный визит в прямой заход.
  if (!Object.keys(params).length && stored) return;

  const touch: Touch = { params, ref: externalReferrer(), at: Date.now() };
  writeStore({ first: stored?.first ?? touch, last: touch });
}

/**
 * Что уходит в заявку: метки последнего касания, `referrer` и — если человек
 * пришёл впервые не оттуда же — первое касание строкой.
 *
 * Плоская карта, а не структура: на той стороне
 * [app/api/lead/route.ts](../app/api/lead/route.ts) подписывает ключи
 * по-русски и печатает их в сообщение.
 */
export function getUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};

  // Форма могла отрисоваться раньше, чем что-либо успело сохранить метки.
  persistUtm();

  const store = readStore();
  if (!store) return {};

  const out: Record<string, string> = { ...store.last.params };
  if (store.last.ref) out.referrer = store.last.ref;

  const first = touchLabel(store.first);
  if (first && first !== touchLabel(store.last)) {
    out.first_touch = `${first} · ${touchDate(store.first.at)}`;
  }

  return out;
}

/** Источник и кампания для подписи в сообщении Telegram. */
export function currentSource(): { source: string; campaign: string } {
  if (typeof window === "undefined") return { source: "", campaign: "" };
  const store = readStore();
  return {
    source: store?.last.params.utm_source ?? "",
    campaign: store?.last.params.utm_campaign ?? "",
  };
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
  /** Свободный текст с деталями заказа — например, для подарочного сертификата. */
  note?: string;
}

export type LeadResult = { ok: true } | { ok: false; error: string };

const FALLBACK_ERROR = "Не удалось отправить заявку. Напишите нам в Telegram — ответим сразу.";

/**
 * Отправка заявки с ретраями. Повторяем только сетевые сбои и 5xx —
 * на 4xx (невалидные данные) повтор бессмысленен.
 * Дубль заявки лучше потерянной заявки, поэтому ретраим агрессивно.
 */
export async function postLead(payload: LeadPayload): Promise<LeadResult> {
  const utm = getUtm();

  // ClientID кладём рядом с метками: на той стороне он попадёт в сообщение,
  // а оттуда — в таблицу заявок. Ожидание ограничено сотнями миллисекунд и
  // не может задержать отправку.
  const clientId = await getClientId();
  if (clientId) utm.ym_client_id = clientId;

  const body = JSON.stringify({
    name: payload.name.trim(),
    phone: formatPhone(payload.phone),
    source: payload.source,
    direction: payload.direction ?? "",
    dayTime: payload.dayTime ?? "",
    note: payload.note ?? "",
    utm,
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
        reachGoal("lead_error");
        return { ok: false, error: data.error ?? FALLBACK_ERROR };
      }
      lastError = data.error ?? FALLBACK_ERROR;
    } catch {
      lastError = "Нет соединения. Проверьте интернет или напишите нам в Telegram.";
    }
    if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 800));
  }

  // Три попытки исчерпаны — человек видит ошибку, а мы обязаны увидеть её в
  // отчётах. Без этой цели поломка воронки выглядит просто как «стало меньше
  // заявок», и обнаружится она по тишине в Telegram через несколько дней.
  reachGoal("lead_error");
  return { ok: false, error: lastError };
}

/**
 * Русское склонение существительного при числе.
 * plural(1, "отзыв", "отзыва", "отзывов") → "отзыв"
 * plural(8, ...) → "отзывов"
 */
export function plural(n: number, one: string, few: string, many: string): string {
  const mod100 = Math.abs(n) % 100;
  const mod10 = mod100 % 10;
  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

const firedGoals = new Set<string>();

/**
 * Цель, которая должна засчитаться один раз за визит.
 * Иначе «начал заполнять форму» отправлялось бы на каждый клик по полю
 * и конверсия шага была бы завышена.
 */
export function reachGoalOnce(goal: string): void {
  if (firedGoals.has(goal)) return;
  firedGoals.add(goal);
  reachGoal(goal);
}

interface YmWindow {
  ym?: (...a: unknown[]) => void;
  __YM_COUNTER_ID__?: number;
}

/**
 * Цели, отправленные до того, как в странице появился счётчик.
 *
 * Скрипт Метрики подключён с `afterInteractive`, а короткая страница может
 * долистаться до конца раньше. Молча терять такие цели нельзя: `scroll_90`
 * на первом экране — это не «не долистал», это дыра в данных.
 */
const pendingGoals: string[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

function ym(): ((...a: unknown[]) => void) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as YmWindow;
  if (typeof w.ym !== "function" || !w.__YM_COUNTER_ID__) return null;
  const id = w.__YM_COUNTER_ID__;
  const fn = w.ym;
  return (...args: unknown[]) => fn(id, ...args);
}

function flushGoals(): void {
  const send = ym();
  if (!send) return;
  while (pendingGoals.length) {
    const goal = pendingGoals.shift() as string;
    try {
      send("reachGoal", goal);
    } catch {
      /* метрика не должна ломать работу страницы */
    }
  }
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
}

/** Цель Яндекс.Метрики. Безопасна, если счётчик ещё не загрузился. */
export function reachGoal(goal: string): void {
  if (typeof window === "undefined") return;
  const send = ym();
  if (send) {
    try {
      send("reachGoal", goal);
    } catch {
      /* метрика не должна ломать отправку заявки */
    }
    return;
  }
  // Счётчика ещё нет — придержим цель и добьём, когда появится.
  if (pendingGoals.length < 30) pendingGoals.push(goal);
  if (!flushTimer) flushTimer = setInterval(flushGoals, 400);
}

/**
 * Заявка: общая цель плюс уточняющая.
 *
 * `lead_submit` — единственная цифра «сколько всего заявок», её и назначаем
 * ключевой в Директе. Вторая цель отвечает на вопрос «какая форма сработала»:
 * без неё квиз в exit-попапе и обычная модалка были неразличимы, и усиливать
 * было нечего — обе выглядели одним числом.
 */
export function reachLeadGoal(specific: string): void {
  reachGoal("lead_submit");
  reachGoal(specific);
}

/**
 * Просмотр страницы при клиентской навигации.
 *
 * Счётчик отправляет просмотр только при загрузке документа. Переходы по
 * `next/link` документ не перезагружают, поэтому маршрут `/` → `/bjj` →
 * `/schedule` приходил в Метрику одним просмотром: страницы направлений в
 * отчётах отсутствовали, а цели «просмотр URL» не срабатывали вовсе.
 */
export function hit(url: string, referer?: string): void {
  const send = ym();
  if (!send) return;
  try {
    send("hit", url, referer ? { referer } : undefined);
  } catch {
    /* навигация важнее статистики */
  }
}

let clientIdCache: string | null = null;

/**
 * ClientID Метрики — ключ, которым заявка сшивается с визитом.
 *
 * Без него заявка в Telegram и визит в Метрике живут в разных мирах: нельзя
 * ни сопоставить их вручную, ни загрузить обратно офлайн-конверсию «пришёл на
 * пробное». Метод асинхронный и на счётчике с блокировщиком не ответит
 * никогда, поэтому ждём ограниченно — заявка не имеет права ждать статистику.
 */
export function getClientId(timeoutMs = 700): Promise<string> {
  if (clientIdCache !== null) return Promise.resolve(clientIdCache);
  const send = ym();
  if (!send) return Promise.resolve("");

  return new Promise((resolve) => {
    let done = false;
    const finish = (value: string) => {
      if (done) return;
      done = true;
      clientIdCache = value;
      resolve(value);
    };
    const timer = setTimeout(() => finish(""), timeoutMs);
    try {
      send("getClientID", (id: string) => {
        clearTimeout(timer);
        finish(typeof id === "string" ? id : "");
      });
    } catch {
      clearTimeout(timer);
      finish("");
    }
  });
}
