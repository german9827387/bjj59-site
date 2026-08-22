import { NextRequest, NextResponse } from "next/server";

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
    // eslint-disable-next-line no-control-regex
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
};

export async function POST(req: NextRequest) {
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
  const utm =
    body.utm && typeof body.utm === "object" && !Array.isArray(body.utm)
      ? (body.utm as Record<string, string>)
      : {};

  if (!name) {
    return NextResponse.json({ ok: false, error: "Введите имя" }, { status: 422 });
  }

  const digits = normalizePhone(rawPhone);
  if (digits.length !== 11) {
    return NextResponse.json({ ok: false, error: "Введите номер полностью" }, { status: 422 });
  }
  const phone = prettyPhone(digits);
  const telLink = `+${digits}`;

  const now = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Yekaterinburg",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  // Полезная нагрузка для аварийного лога — по ней заявку можно восстановить из логов
  const leadRecord = { name, phone: telLink, source, direction, dayTime, utm, at: now };

  const utmLines = Object.entries(UTM_LABELS)
    .filter(([key]) => utm[key])
    .map(([key, label]) => `📌 ${label}: ${clean(utm[key], 200)}`);

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("[LEAD_LOST] TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID не заданы", JSON.stringify(leadRecord));
    return NextResponse.json({ ok: true, warn: "Telegram not configured" });
  }

  const lines = [
    `👤 Имя: ${name}`,
    `📞 Телефон: ${phone}`,
    ...(direction ? [`🥊 Направление: ${direction}`] : []),
    ...(dayTime ? [`📅 День и время: ${dayTime}`] : []),
    `🕐 Время: ${now} (Пермь)`,
    ...(source ? [`📋 Форма: ${source}`] : []),
    ...(utmLines.length ? ["", "Источник трафика:", ...utmLines] : ["", "📍 Источник: прямой заход"]),
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
    return NextResponse.json({ ok: false, error: "Ошибка отправки" }, { status: 502 });
  }

  // Email-дубль через Resend (опционально). Не блокирует ответ и не влияет на успех заявки.
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (resendKey && notifyEmail) {
    const utmHtml = utmLines.length
      ? `<br><b>Источник трафика:</b><br>${utmLines.map((l) => esc(l.replace("📌 ", ""))).join("<br>")}`
      : "<br>Источник: прямой заход";
    const emailHtml = `
      <h2 style="color:#1d4ed8">🥋 Новая заявка — bjj59.ru</h2>
      <table style="font-size:15px;line-height:1.7">
        <tr><td><b>Имя:</b></td><td>${esc(name)}</td></tr>
        <tr><td><b>Телефон:</b></td><td><a href="tel:${esc(telLink)}">${esc(phone)}</a></td></tr>
        <tr><td><b>Время:</b></td><td>${esc(now)} (Пермь)</td></tr>
        ${direction ? `<tr><td><b>Направление:</b></td><td>${esc(direction)}</td></tr>` : ""}
        ${dayTime ? `<tr><td><b>День и время:</b></td><td>${esc(dayTime)}</td></tr>` : ""}
        ${source ? `<tr><td><b>Форма:</b></td><td>${esc(source)}</td></tr>` : ""}
      </table>
      ${utmHtml}
    `;
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GSAcademy <leads@bjj59.ru>",
        to: [notifyEmail],
        subject: `Новая заявка: ${name} ${phone}`,
        html: emailHtml,
      }),
    }).catch((e) => console.error("Resend error:", e));
  }

  return NextResponse.json({ ok: true });
}
