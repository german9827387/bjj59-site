import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let body: { name?: unknown; phone?: unknown; utm?: unknown; source?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const source = String(body.source ?? "").trim();
  const utm = (body.utm && typeof body.utm === "object" && !Array.isArray(body.utm))
    ? body.utm as Record<string, string>
    : {};

  if (!name || name.length > 100) {
    return NextResponse.json({ ok: false, error: "Введите имя" }, { status: 422 });
  }
  if (!phone || phone.replace(/\D/g, "").length < 11) {
    return NextResponse.json({ ok: false, error: "Введите номер полностью" }, { status: 422 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    // Telegram not configured — return ok so UX isn't broken
    console.error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set");
    return NextResponse.json({ ok: true, warn: "Telegram not configured" });
  }

  const now = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Yekaterinburg",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const UTM_LABELS: Record<string, string> = {
    utm_source: "Источник",
    utm_medium: "Тип трафика",
    utm_campaign: "Кампания",
    utm_content: "Объявление",
    utm_term: "Ключевое слово",
  };

  const utmLines = Object.entries(UTM_LABELS)
    .filter(([key]) => utm[key])
    .map(([key, label]) => `📌 ${label}: ${utm[key]}`);

  const text = [
    "🥋 *Новая заявка с сайта bjj59.ru*",
    "",
    `👤 Имя: ${name}`,
    `📞 Телефон: ${phone}`,
    `🕐 Время: ${now} (Пермь)`,
    ...(source ? [`📋 Форма: ${source}`] : []),
    ...(utmLines.length ? ["", "*Источник трафика:*", ...utmLines] : ["\n📍 Источник: прямой заход"]),
  ].join("\n");

  const tgRes = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    }
  );

  if (!tgRes.ok) {
    const err = await tgRes.text();
    console.error("Telegram API error:", err);
    return NextResponse.json({ ok: false, error: "Ошибка отправки" }, { status: 502 });
  }

  // Email уведомление через Resend (опционально — работает если задан RESEND_API_KEY)
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (resendKey && notifyEmail) {
    const utmHtml = utmLines.length
      ? `<br><b>Источник трафика:</b><br>${utmLines.map(l => l.replace("📌 ", "")).join("<br>")}`
      : "<br>Источник: прямой заход";
    const emailHtml = `
      <h2 style="color:#1d4ed8">🥋 Новая заявка — bjj59.ru</h2>
      <table style="font-size:15px;line-height:1.7">
        <tr><td><b>Имя:</b></td><td>${name}</td></tr>
        <tr><td><b>Телефон:</b></td><td><a href="tel:${phone}">${phone}</a></td></tr>
        <tr><td><b>Время:</b></td><td>${now} (Пермь)</td></tr>
        ${source ? `<tr><td><b>Форма:</b></td><td>${source}</td></tr>` : ""}
      </table>
      ${utmHtml}
    `;
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GSAcademy <leads@bjj59.ru>",
        to: [notifyEmail],
        subject: `Новая заявка: ${name} ${phone}`,
        html: emailHtml,
      }),
    }).catch(e => console.error("Resend error:", e));
  }

  return NextResponse.json({ ok: true });
}
