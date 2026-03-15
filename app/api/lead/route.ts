import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let body: { name?: unknown; phone?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();

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

  const text = [
    "🥋 *Новая заявка с сайта bjj59.ru*",
    "",
    `👤 Имя: ${name}`,
    `📞 Телефон: ${phone}`,
    `🕐 Время: ${now} (Пермь)`,
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

  return NextResponse.json({ ok: true });
}
