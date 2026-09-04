import { NextRequest, NextResponse } from "next/server";
import { allow, clientIp, mark, recent } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

/** Экранирование для parse_mode: "HTML" (Telegram требует только эти три). */
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Те же правила, что и на клиенте (lib/lead-utils.ts): 8 912… → 7 912…, 912… → 7 912… */
function normalizePhone(val: string): string {
  let digits = val.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  else if (!digits.startsWith("7")) digits = "7" + digits;
  return digits.slice(0, 11);
}

function prettyPhone(digits: string): string {
  if (digits.length !== 11) return digits;
  const p = digits.slice(1);
  return `+7 (${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6, 8)}-${p.slice(8, 10)}`;
}

/** Убирает управляющие символы, которые ломают JSON/вывод, и подрезает длину. */
function clean(val: unknown, max: number): string {
  return String(val ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

interface TelegramSendResult {
  ok: boolean;
  status?: number;
  error?: string;
}

/**
 * Отправка в Telegram с ретраями.
 * 400 означает, что Telegram не смог разобрать разметку — повтор с тем же телом
 * не поможет, поэтому вызывающий код делает fallback на обычный текст.
 */
async function sendTelegram(
  token: string,
  chatId: string,
  text: string,
  parseMode?: "HTML"
): Promise<TelegramSendResult> {
  let last: TelegramSendResult = { ok: false, error: "unknown" };

  for (let attempt = 1; attempt <= 3; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          ...(parseMode ? { parse_mode: parseMode } : {}),
          disable_web_page_preview: true,
        }),
        signal: controller.signal,
      });
      if (res.ok) return { ok: true };
      const body = await res.text().catch(() => "");
      last = { ok: false, status: res.status, error: body.slice(0, 300) };
      // Ошибка разметки/запроса — ретраить бессмысленно, нужен fallback
      if (res.status === 400) return last;
    } catch (e) {
      last = { ok: false, error: (e as Error).message };
    } finally {
      clearTimeout(timer);
    }
    if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 700));
  }

  return last;
}

const UTM_LABELS: Record<string, string> = {
  utm_source: "Источник",
  utm_medium: "Тип трафика",
  utm_campaign: "Кампания",
  utm_content: "Объявление",
  utm_term: "Ключевое слово",
  yclid: "Клик Яндекс.Директ",
  ysclid: "Клик Яндекс",
  gclid: "Клик Google Ads",
  gbraid: "Клик Google Ads",
  wbraid: "Клик Google Ads",
  fbclid: "Клик Meta",
  rb_clickid: "Клик VK Реклама",
};

/** Ключи, наличие которых означает «трафик размечен». */
const AD_KEYS = Object.keys(UTM_LABELS);

/**
 * Человеческое имя площадки по хосту перехода.
 *
 * Без этого «прямой заход» был свалкой: настоящие прямые заходы, органика
 * Яндекса, переходы из Telegram-канала и закладки выглядели одинаково — и
 * по такой строке нельзя решить, куда вкладывать деньги.
 */
const REFERRER_LABELS: Array<[RegExp, string]> = [
  // Карты идут первыми: их хост совпадает с поисковым, и общее правило
  // ниже подписало бы переход из карточки организации как органику.
  [/(^|\.)yandex\.[a-z.]+\/maps$/, "Яндекс Карты"],
  [/(^|\.)google\.[a-z.]+\/maps$/, "Google Карты"],
  [/(^|\.)yandex\./, "органический поиск Яндекс"],
  [/(^|\.)ya\.ru$/, "органический поиск Яндекс"],
  [/(^|\.)google\./, "органический поиск Google"],
  [/(^|\.)(bing|duckduckgo|mail)\./, "органический поиск"],
  [/(^|\.)vk\.(com|ru)$/, "ВКонтакте"],
  [/(^|\.)(t\.me|telegram\.org|telegram\.me)$/, "Telegram"],
  [/(^|\.)2gis\./, "2ГИС"],
  [/(^|\.)(instagram|facebook)\./, "Instagram/Facebook"],
  [/(^|\.)youtube\./, "YouTube"],
  [/(^|\.)avito\./, "Авито"],
];

function referrerLabel(host: string): string {
  const found = REFERRER_LABELS.find(([re]) => re.test(host));
  return found ? found[1] : `переход с ${host}`;
}

/**
 * Строки блока «Источник трафика» — общие для Telegram и письма.
 *
 * Заявка без меток больше не считается автоматически прямым заходом:
 * Яндекс.Директ с автоматической разметкой присылает только `yclid`, а
 * органика не присылает ничего, кроме referrer'а.
 */
function trafficLines(utm: Record<string, string>): string[] {
  const lines = AD_KEYS.filter((key) => utm[key]).map(
    (key) => `📌 ${UTM_LABELS[key]}: ${clean(utm[key], 200)}`
  );

  const ref = clean(utm.referrer, 100);

  if (lines.length) {
    if (ref) lines.push(`🔗 Переход с: ${ref}`);
  } else {
    lines.push(`📍 Источник: ${ref ? referrerLabel(ref) : "прямой заход или закладка"}`);
  }

  const first = clean(utm.first_touch, 200);
  if (first) lines.push(`🕓 Первый заход: ${first}`);

  // ClientID печатается отдельно от рекламных ключей и намеренно не входит в
  // AD_KEYS: он есть почти всегда, и попади он туда — заявка с прямого захода
  // перестала бы считаться непромеченной и строка «Источник» исчезла бы.
  // Нужен, чтобы заявку можно было сшить с визитом в Метрике и вернуть
  // обратно офлайн-конверсией «пришёл на пробное».
  const clientId = clean(utm.ym_client_id, 40);
  if (clientId) lines.push(`🆔 ClientID: ${clientId}`);

  return lines;
}

/**
 * Замок на форму.
 *
 * До этого `/api/lead` был единственным открытым API без ограничений:
 * скрипт в цикле заваливал Telegram тысячей «заявок», настоящие тонули в
 * мусоре, а бот рисковал получить flood-бан. Три сита:
 *  - с одного адреса — не больше 5 заявок за 10 минут (семья, записывающая
 *    троих детей, укладывается; скрипт — нет);
 *  - на весь инстанс — не больше 40 за 10 минут, чтобы распределённая
 *    атака не пробила лимит по адресам;
 *  - один и тот же телефон — не чаще раза в 5 минут: повторный клик по
 *    кнопке или ретрай клиента не рождает дубль в чате.
 */
const IP_LIMIT = 5;
const GLOBAL_LIMIT = 40;
const WINDOW_MS = 10 * 60_000;
const PHONE_WINDOW_MS = 5 * 60_000;

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (!allow(`lead:ip:${ip}`, IP_LIMIT, WINDOW_MS) || !allow("lead:all", GLOBAL_LIMIT, WINDOW_MS)) {
    console.warn("[lead] rate limit", ip);
    return NextResponse.json(
      { ok: false, error: "Слишком много заявок. Позвоните нам или напишите в Telegram." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = clean(body.name, 100);
  const rawPhone = clean(body.phone, 40);
  const source = clean(body.source, 200);
  const direction = clean(body.direction, 100);
  const dayTime = clean(body.dayTime, 100);
  const note = clean(body.note, 600);
  const utm =
    body.utm && typeof body.utm === "object" && !Array.isArray(body.utm)
      ? (body.utm as Record<string, string>)
      : {};

  const digits = normalizePhone(rawPhone);
  if (digits.length !== 11) {
    return NextResponse.json({ ok: false, error: "Введите номер полностью" }, { status: 422 });
  }
  const phone = prettyPhone(digits);
  const telLink = `+${digits}`;

  // Дубль: тот же номер за последние минуты уже ушёл — отвечаем «принято»,
  // чтобы человек не видел ошибку, но в чат второй раз не шлём. Отметка
  // ставится только после успешной доставки (см. ниже), иначе ретрай
  // после сбоя Telegram считался бы дублем.
  if (recent(`lead:phone:${digits}`)) {
    console.warn("[lead] duplicate phone within window", telLink);
    return NextResponse.json({ ok: true, dedup: true });
  }

  const now = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Yekaterinburg",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  // Полезная нагрузка для аварийного лога — по ней заявку можно восстановить из логов
  const leadRecord = { name, phone: telLink, source, direction, dayTime, note, utm, at: now };

  const utmLines = trafficLines(utm);

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("[LEAD_LOST] TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID не заданы", JSON.stringify(leadRecord));
    return NextResponse.json({ ok: true, warn: "Telegram not configured" });
  }

  const lines = [
    `👤 Имя: ${name || "не указано"}`,
    `📞 Телефон: ${phone}`,
    ...(direction ? [`🥊 Направление: ${direction}`] : []),
    ...(dayTime ? [`📅 День и время: ${dayTime}`] : []),
    ...(note ? [`📝 ${note}`] : []),
    `🕐 Время: ${now} (Пермь)`,
    ...(source ? [`📋 Форма: ${source}`] : []),
    "",
    "Источник трафика:",
    ...utmLines,
  ];

  const htmlText = [
    "🥋 <b>Новая заявка с сайта bjj59.ru</b>",
    "",
    ...lines.map(esc),
  ].join("\n");

  let sent = await sendTelegram(token, chatId, htmlText, "HTML");

  // Fallback: если Telegram не разобрал разметку — шлём тем же текстом без parse_mode.
  // Заявка важнее форматирования.
  if (!sent.ok && sent.status === 400) {
    console.error("[lead] Telegram отверг HTML-разметку, отправляю простым текстом:", sent.error);
    sent = await sendTelegram(token, chatId, ["🥋 Новая заявка с сайта bjj59.ru", "", ...lines].join("\n"));
  }

  if (!sent.ok) {
    // Последний рубеж: заявка обязана остаться в логах Vercel, даже если Telegram лежит
    console.error("[LEAD_LOST] Telegram недоступен:", sent.status, sent.error, JSON.stringify(leadRecord));
  }

  /*
    Письмо — запасной канал, а не дубль для красоты.

    Раньше оно уходило только ПОСЛЕ успешной отправки в Telegram — то есть
    ровно в тот момент, когда Telegram лежал и письмо было нужнее всего,
    его не было. Теперь письмо идёт всегда, а при сбое Telegram его тема
    начинается с предупреждения, чтобы такое письмо нельзя было пропустить.
    Ждём ответ Resend: на serverless функция может завершиться раньше
    «висящего» fetch, и письмо просто не отправится.
  */
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;
  let mailed = false;
  if (resendKey && notifyEmail) {
    const utmHtml = `<br><b>Источник трафика:</b><br>${utmLines
      .map((l) => esc(l))
      .join("<br>")}`;
    const alert = sent.ok
      ? ""
      : `<p style="color:#b91c1c"><b>⚠️ Telegram недоступен — заявка пришла только этим письмом. Перезвоните.</b></p>`;
    const emailHtml = `
      <h2 style="color:#1d4ed8">🥋 Новая заявка — bjj59.ru</h2>
      ${alert}
      <table style="font-size:15px;line-height:1.7">
        <tr><td><b>Имя:</b></td><td>${esc(name)}</td></tr>
        <tr><td><b>Телефон:</b></td><td><a href="tel:${esc(telLink)}">${esc(phone)}</a></td></tr>
        <tr><td><b>Время:</b></td><td>${esc(now)} (Пермь)</td></tr>
        ${direction ? `<tr><td><b>Направление:</b></td><td>${esc(direction)}</td></tr>` : ""}
        ${dayTime ? `<tr><td><b>День и время:</b></td><td>${esc(dayTime)}</td></tr>` : ""}
        ${note ? `<tr><td><b>Детали:</b></td><td>${esc(note)}</td></tr>` : ""}
        ${source ? `<tr><td><b>Форма:</b></td><td>${esc(source)}</td></tr>` : ""}
      </table>
      ${utmHtml}
    `;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "GSAcademy <leads@bjj59.ru>",
          to: [notifyEmail],
          subject: `${sent.ok ? "" : "⚠️ Telegram недоступен · "}Новая заявка: ${name} ${phone}`,
          html: emailHtml,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      mailed = res.ok;
      if (!res.ok) console.error("[lead] Resend error:", res.status, await res.text().catch(() => ""));
    } catch (e) {
      console.error("[lead] Resend error:", (e as Error).message);
    }
  }

  if (!sent.ok && !mailed) {
    return NextResponse.json({ ok: false, error: "Ошибка отправки" }, { status: 502 });
  }
  mark(`lead:phone:${digits}`, PHONE_WINDOW_MS);

  return NextResponse.json({ ok: true });
}
