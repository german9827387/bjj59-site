"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download } from "lucide-react";
import giftJson from "@/data/gift.json";

/**
 * Генератор подарочного сертификата.
 *
 * Рисуем на canvas и отдаём готовым PNG, а не печатаем страницу: печать
 * из браузера тянула боковое меню админки и колонтитулы, а фон терялся —
 * Safari по умолчанию не печатает фоновые заливки.
 *
 * Реестра сертификатов здесь нет: базы на лендинге нет, а номер без учёта
 * погашений бесполезен. Номера присваиваются вручную при оплате.
 */

const { validMonths } = giftJson;

const W = 2000;
const H = 1250;

function plusMonths(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Подбирает размер шрифта, чтобы строка влезла в заданную ширину. */
function fitFont(ctx: CanvasRenderingContext2D, text: string, max: number, start: number, family: string) {
  let size = start;
  do {
    ctx.font = `900 ${size}px ${family}`;
    if (ctx.measureText(text).width <= max) break;
    size -= 4;
  } while (size > 28);
  return size;
}

/** Разрядка: ctx.letterSpacing поддержан не везде, поэтому рисуем посимвольно. */
function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  anchor: number,
  y: number,
  spacing: number,
  align: "center" | "left" | "right" = "center"
) {
  const chars = [...text];
  const width = chars.reduce((w, c) => w + ctx.measureText(c).width + spacing, 0) - spacing;
  let x = align === "center" ? anchor - width / 2 : align === "right" ? anchor - width : anchor;
  const prev = ctx.textAlign;
  ctx.textAlign = "left";
  for (const c of chars) {
    ctx.fillText(c, x, y);
    x += ctx.measureText(c).width + spacing;
  }
  ctx.textAlign = prev;
}

function CertificateBuilder() {
  const params = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markRef = useRef<HTMLImageElement | null>(null);

  const [to, setTo] = useState(params.get("to") ?? "");
  const [from, setFrom] = useState(params.get("from") ?? "");
  const [gift, setGift] = useState(params.get("gift") ?? "Месяц в академии");
  const [no, setNo] = useState(params.get("no") ?? "");
  const [until, setUntil] = useState(params.get("until") ?? "");
  const [ready, setReady] = useState(false);

  const untilShown = until || plusMonths(validMonths);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const family = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0b1220");
    bg.addColorStop(0.55, "#0d1525");
    bg.addColorStop(1, "#0a1a2e");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const glow = (x: number, y: number, r: number, color: string) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };
    glow(W * 0.5, -H * 0.1, W * 0.62, "rgba(59,130,246,0.30)");
    glow(W * 0.92, H * 1.05, W * 0.45, "rgba(6,182,212,0.20)");

    // Знак подложкой — крупно и еле заметно
    const mark = markRef.current;
    if (mark?.complete && mark.naturalWidth) {
      const size = H * 0.82;
      ctx.save();
      ctx.globalAlpha = 0.07;
      // чуть выше центра, чтобы «нога» знака не наезжала на подвал
      ctx.drawImage(mark, W / 2 - size / 2, H * 0.46 - size / 2, size, size);
      ctx.restore();
    }

    ctx.strokeStyle = "rgba(96,165,250,0.28)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(28, 28, W - 56, H - 56, 34);
    ctx.stroke();

    ctx.textBaseline = "alphabetic";

    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 62px ${family}`;
    ctx.fillText("GSAcademy", 110, 150);
    ctx.fillStyle = "rgba(147,197,253,0.75)";
    ctx.font = `600 22px ${family}`;
    drawTracked(ctx, "АКАДЕМИЯ ЕДИНОБОРСТВ · ПЕРМЬ", 112, 192, 4.5, "left");

    ctx.fillStyle = "rgba(147,197,253,0.6)";
    ctx.font = `600 20px ${family}`;
    drawTracked(ctx, "СЕРТИФИКАТ", W - 110, 130, 4, "right");
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 40px ${family}`;
    ctx.textAlign = "right";
    ctx.fillText(no || "№ —", W - 110, 182);

    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(147,197,253,0.7)";
    ctx.font = `600 24px ${family}`;
    drawTracked(ctx, "ПОДАРОЧНЫЙ СЕРТИФИКАТ", W / 2, H / 2 - 130, 7);

    const giftText = gift || "—";
    const size = fitFont(ctx, giftText, W - 320, 128, family);
    const grad = ctx.createLinearGradient(W / 2 - 520, 0, W / 2 + 520, 0);
    grad.addColorStop(0, "#bfdbfe");
    grad.addColorStop(0.5, "#ffffff");
    grad.addColorStop(1, "#a5f3fc");
    ctx.fillStyle = grad;
    ctx.font = `900 ${size}px ${family}`;
    ctx.fillText(giftText, W / 2, H / 2 + size * 0.34);

    // Подписи с двоеточием, а не «для Артёма от Марии»: имена не просклоняешь
    // автоматически, а ошибка в имени в подарке хуже всего.
    if (to || from) {
      const parts: string[] = [];
      if (to) parts.push(`Кому: ${to}`);
      if (from) parts.push(`От: ${from}`);
      ctx.fillStyle = "rgba(226,232,240,0.9)";
      ctx.font = `600 32px ${family}`;
      ctx.fillText(parts.join("     ·     "), W / 2, H / 2 + size * 0.34 + 82);
    }

    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(148,163,184,0.9)";
    ctx.font = `500 24px ${family}`;
    ctx.fillText("ул. Аркадия Гайдара 8б, Пермь", 110, H - 145);
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 26px ${family}`;
    ctx.fillText("8 (995) 865-42-44 · bjj59.ru", 110, H - 105);

    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(148,163,184,0.9)";
    ctx.font = `500 24px ${family}`;
    ctx.fillText("Действителен до", W - 110, H - 145);
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 34px ${family}`;
    ctx.fillText(untilShown, W - 110, H - 100);
  }, [to, from, gift, no, untilShown]);

  // Знак и шрифты грузим один раз — иначе первый кадр нарисуется системным
  // шрифтом и без подложки
  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.src = "/gs-mark.png";
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.all([
      new Promise<void>((res) => { img.onload = () => res(); img.onerror = () => res(); }),
      fonts,
    ]).then(() => {
      if (!alive) return;
      markRef.current = img;
      setReady(true);
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => { if (ready) draw(); }, [ready, draw]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const safe = (s: string) => s.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
      const name = ["сертификат", no && safe(no), to && safe(to)].filter(Boolean).join("-");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name || "сертификат"}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, "image/jpeg", 0.94);
  };

  const field = "w-full bg-[#111] border border-[#2a2a2a] focus:border-blue-500/60 text-white rounded-lg px-3 py-2 text-sm outline-none";

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white font-black text-2xl mb-1">Сертификат</h1>
        <p className="text-gray-500 text-sm mb-6">
          Заполните поля и скачайте картинку — её можно отправить в мессенджер или распечатать.
          Номер присваивайте после оплаты, из своей нумерации.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <label className="block">
            <span className="block text-gray-400 text-xs mb-1.5">Кому</span>
            <input className={field} value={to} onChange={(e) => setTo(e.target.value)} placeholder="Артём" />
          </label>
          <label className="block">
            <span className="block text-gray-400 text-xs mb-1.5">От кого</span>
            <input className={field} value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Мария" />
          </label>
          <label className="block sm:col-span-2">
            <span className="block text-gray-400 text-xs mb-1.5">Что дарим</span>
            <input className={field} value={gift} onChange={(e) => setGift(e.target.value)} placeholder="Месяц в академии" />
          </label>
          <label className="block">
            <span className="block text-gray-400 text-xs mb-1.5">Номер</span>
            <input className={field} value={no} onChange={(e) => setNo(e.target.value)} placeholder="GS-0007" />
          </label>
          <label className="block">
            <span className="block text-gray-400 text-xs mb-1.5">Действителен до</span>
            <input suppressHydrationWarning className={field} value={untilShown} onChange={(e) => setUntil(e.target.value)} placeholder="31.03.2027" />
          </label>
        </div>

        <button
          onClick={download}
          disabled={!ready}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-7 rounded-xl text-sm disabled:opacity-50 mb-8"
        >
          <Download size={16} />
          Скачать картинку
        </button>

        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full h-auto rounded-2xl shadow-2xl border border-white/[0.06]"
        />

        <p className="text-gray-600 text-xs mt-5">
          Получателю достаточно позвонить или прийти в зал с этим сертификатом.
          Картинка {W}×{H}, около 200 КБ — подойдёт и для мессенджера, и для печати.
        </p>
      </div>
    </div>
  );
}

export default function CertificatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <CertificateBuilder />
    </Suspense>
  );
}
