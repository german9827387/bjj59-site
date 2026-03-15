"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const faqs = [
  {
    q: "Нужен ли опыт или физическая подготовка?",
    a: "Нет. Большинство наших учеников начинали с нуля. Тренер подберёт группу под ваш уровень — от абсолютных новичков до продвинутых. Главное — желание.",
    tag: "Новичкам",
  },
  {
    q: "Мой ребёнок маленький (3–5 лет) — не рано ли?",
    a: "Нет, в этом возрасте как раз самое время. У малышей занятия проходят в игровой форме: гимнастика, координация, базовые движения. Никакого контактного спарринга — только развитие и удовольствие.",
    tag: "Детям",
  },
  {
    q: "Не боитесь ли вы травм?",
    a: "Травмы случаются в любом спорте, но у нас — минимально. Начинающие не участвуют в жёстких спаррингах. Акцент всегда на технике, а не на силе. Тренеры с педагогическим образованием контролируют каждое занятие.",
    tag: "Безопасность",
  },
  {
    q: "Я взрослый — не поздно ли начинать?",
    a: "У нас тренируются люди от 18 до 50+ лет. Единоборства — это не только для молодых и гибких. Вы будете заниматься в группе по своему уровню и получать удовольствие от прогресса уже после первых занятий.",
    tag: "Взрослым",
  },
  {
    q: "Что взять с собой на первую тренировку?",
    a: "Только спортивную одежду и воду. Экипировку на первое занятие мы предоставляем бесплатно. Дальше — только если захотите купить своё.",
    tag: "Первый раз",
  },
  {
    q: "Что включает семейный абонемент?",
    a: "Семейный абонемент — это папа (или мама) + ребёнок по специальной цене. Каждый занимается в своей группе, но в одном зале. Удобно, выгодно, и папа наконец-то в форме.",
    tag: "Семьям",
  },
];

const TAG_COLORS: Record<string, string> = {
  "Новичкам":    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Детям":       "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Безопасность":"bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Взрослым":    "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Первый раз":  "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Семьям":      "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="relative py-20 lg:py-28 bg-[#060d1f] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(59,130,246,0.08),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(6,182,212,0.05),transparent)] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-14">
            <span className="inline-block text-[#3B82F6] text-xs font-semibold uppercase tracking-widest border border-blue-500/20 bg-blue-500/5 rounded-full px-4 py-1.5 mb-4">
              Отвечаем честно
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">
              Частые{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                вопросы
              </span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-lg mx-auto">
              Не нашли ответ? Напишите в Telegram — ответим за несколько минут
            </p>
          </div>
        </Reveal>

        {/* Two-column grid on desktop */}
        <div className="grid sm:grid-cols-2 gap-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 40}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={`w-full text-left rounded-2xl border transition-all duration-200 ${
                    isOpen
                      ? "border-blue-500/40 bg-gradient-to-br from-blue-500/10 to-blue-500/[0.03]"
                      : "border-white/[0.07] bg-white/[0.02] hover:border-blue-500/25 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="p-5">
                    {/* Tag */}
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-widest border rounded-full px-2.5 py-0.5 mb-3 ${TAG_COLORS[faq.tag]}`}>
                      {faq.tag}
                    </span>

                    {/* Question row */}
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-white font-semibold text-sm leading-snug">
                        {faq.q}
                      </p>
                      <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 transition-all duration-200 ${
                        isOpen ? "bg-blue-500/20 text-blue-400" : "bg-white/[0.06] text-gray-500"
                      }`}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d={isOpen ? "M2 5h6" : "M5 2v6M2 5h6"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </span>
                    </div>

                    {/* Answer */}
                    <div className={`overflow-hidden transition-all duration-200 ${
                      isOpen ? "max-h-48 mt-3 opacity-100" : "max-h-0 opacity-0"
                    }`}>
                      <div className="h-px bg-white/[0.06] mb-3" />
                      <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
