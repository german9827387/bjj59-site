"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import giftJson from "@/data/gift.json";

/**
 * Генератор подарочного сертификата для администратора.
 *
 * Базы нет, поэтому реестра сертификатов здесь тоже нет — страница
 * только рисует макет по введённым данным. Администратор заполняет поля,
 * печатает в PDF или снимает скриншот и отправляет покупателю.
 * Учёт выданных номеров ведётся отдельно до переезда в основную систему.
 */

const { validMonths } = giftJson;

function plusMonths(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function CertificateBuilder() {
  const params = useSearchParams();

  const [to, setTo] = useState(params.get("to") ?? "");
  const [from, setFrom] = useState(params.get("from") ?? "");
  const [gift, setGift] = useState(params.get("gift") ?? "Месяц в академии");
  const [no, setNo] = useState(params.get("no") ?? "");
  // Срок по умолчанию — «сегодня + 6 месяцев». Дата на сервере и у клиента
  // может отличаться на сутки, поэтому у полей стоит suppressHydrationWarning:
  // это ровно тот случай, для которого он и предназначен.
  const [until, setUntil] = useState(params.get("until") ?? "");
  const untilShown = until || plusMonths(validMonths);

  const field = "w-full bg-[#111] border border-[#2a2a2a] focus:border-blue-500/60 text-white rounded-lg px-3 py-2 text-sm outline-none";

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10 px-4">
      <style>{`@media print {
        body { background: #fff; }
        .no-print { display: none !important; }
        .cert-sheet { box-shadow: none !important; margin: 0 !important; }
      }`}</style>

      <div className="no-print max-w-3xl mx-auto mb-10">
        <h1 className="text-white font-black text-2xl mb-1">Сертификат</h1>
        <p className="text-gray-500 text-sm mb-6">
          Заполните поля и нажмите «Печать» — сохраните в PDF или снимите скриншот макета ниже.
          Номер присваивайте после оплаты, из своей нумерации.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
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
          onClick={() => window.print()}
          className="mt-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-2.5 px-6 rounded-xl text-sm"
        >
          Печать / сохранить в PDF
        </button>
      </div>

      {/* Макет сертификата */}
      <div className="cert-sheet mx-auto w-full max-w-3xl aspect-[1.6/1] rounded-3xl overflow-hidden relative shadow-2xl bg-[#0d1525]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(59,130,246,0.28),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_90%_100%,rgba(6,182,212,0.18),transparent)]" />
        <div className="absolute inset-[10px] rounded-[1.35rem] border border-blue-400/25" />

        <div className="relative h-full flex flex-col justify-between p-8 sm:p-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-white font-black text-xl sm:text-2xl tracking-tight">GSAcademy</div>
              <div className="text-blue-300/70 text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-0.5">
                Академия единоборств · Пермь
              </div>
            </div>
            <div className="text-right">
              <div className="text-blue-300/60 text-[10px] uppercase tracking-widest">Сертификат</div>
              <div className="text-white font-bold text-sm sm:text-base tabular-nums">{no || "№ —"}</div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-blue-300/70 text-[10px] sm:text-xs uppercase tracking-[0.25em] mb-3">
              Подарочный сертификат
            </div>
            <div className="text-white font-black text-3xl sm:text-5xl leading-tight bg-gradient-to-r from-blue-300 via-white to-cyan-300 text-transparent bg-clip-text">
              {gift || "—"}
            </div>
            {/* Подписи с двоеточием, а не «для Артёма от Марии»: имена не
                просклоняешь автоматически, а ошибка в имени в подарке —
                худшее, что может случиться. */}
            {(to || from) && (
              <div className="text-gray-300 text-sm sm:text-base mt-4">
                {to && <>Кому: <span className="text-white font-bold">{to}</span></>}
                {to && from && <span className="text-gray-500"> · </span>}
                {from && <>От: <span className="text-white font-bold">{from}</span></>}
              </div>
            )}
          </div>

          <div className="flex items-end justify-between gap-4 text-[10px] sm:text-xs">
            <div className="text-gray-400 leading-relaxed">
              <div>ул. Аркадия Гайдара 8б, Пермь</div>
              <div className="text-white font-semibold">8 (995) 865-42-44 · bjj59.ru</div>
            </div>
            <div className="text-right text-gray-400">
              <div>Действителен до</div>
              <div suppressHydrationWarning className="text-white font-bold text-sm tabular-nums">{untilShown || "—"}</div>
            </div>
          </div>
        </div>
      </div>

      <p className="no-print text-gray-600 text-xs text-center mt-6 max-w-3xl mx-auto">
        Чтобы активировать, получателю достаточно позвонить или прийти в зал с этим сертификатом.
      </p>
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
