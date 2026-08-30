"use client";
import { useState } from "react";
import Reveal from "./Reveal";
import LeadModal from "./LeadModal";

const items = [
  {
    label: "Футболка",
    desc: "Спортивная, удобная",
    color: "from-blue-500/20 to-blue-600/5",
    border: "#3b82f6",
    glow: "rgba(59,130,246,0.35)",
    icon: (
      <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
        {/* t-shirt body */}
        <path d="M28 18 L16 28 L24 34 L24 64 L56 64 L56 34 L64 28 L52 18" stroke="#60a5fa" strokeWidth="2.5" strokeLinejoin="round" fill="rgba(59,130,246,0.13)"/>
        {/* collar */}
        <path d="M28 18 Q40 26 52 18" stroke="#93c5fd" strokeWidth="2" fill="none"/>
        {/* sleeve lines */}
        <path d="M16 28 L24 32" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M64 28 L56 32" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"/>
        {/* chest stripe */}
        <path d="M28 42 L52 42" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3"/>
        <path d="M28 50 L52 50" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
      </svg>
    ),
  },
  {
    label: "Шорты",
    desc: "Свободные, спортивные",
    color: "from-cyan-500/20 to-cyan-600/5",
    border: "#06b6d4",
    glow: "rgba(6,182,212,0.35)",
    icon: (
      <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
        {/* waistband */}
        <rect x="18" y="22" width="44" height="10" rx="5" stroke="#22d3ee" strokeWidth="2.5" fill="rgba(6,182,212,0.15)"/>
        {/* left leg */}
        <path d="M18 32 L22 62 L38 62 L40 32" stroke="#22d3ee" strokeWidth="2.5" strokeLinejoin="round" fill="rgba(6,182,212,0.10)"/>
        {/* right leg */}
        <path d="M62 32 L58 62 L42 62 L40 32" stroke="#22d3ee" strokeWidth="2.5" strokeLinejoin="round" fill="rgba(6,182,212,0.10)"/>
        {/* center seam */}
        <path d="M40 32 L40 62" stroke="#67e8f9" strokeWidth="1.5" strokeDasharray="3 2"/>
        {/* stripe on leg */}
        <path d="M23 42 L37 42" stroke="#a5f3fc" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M57 42 L43 42" stroke="#a5f3fc" strokeWidth="1.5" strokeLinecap="round"/>
        {/* belt loop */}
        <rect x="37" y="19" width="6" height="4" rx="1" stroke="#67e8f9" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
  },
  {
    label: "Сланцы",
    desc: "Для душевой комнаты",
    color: "from-blue-500/20 to-blue-600/5",
    border: "#3b82f6",
    glow: "rgba(59,130,246,0.35)",
    icon: (
      <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
        {/* sole */}
        <path d="M14 52 Q14 60 40 60 Q66 60 66 52 L62 46 Q40 50 18 46 Z" stroke="#60a5fa" strokeWidth="2.5" strokeLinejoin="round" fill="rgba(59,130,246,0.13)"/>
        {/* left strap */}
        <path d="M22 46 Q24 36 34 34 Q38 33 40 36" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        {/* right strap */}
        <path d="M58 46 Q56 36 46 34 Q42 33 40 36" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        {/* strap connector */}
        <circle cx="40" cy="36" r="3" stroke="#60a5fa" strokeWidth="2" fill="rgba(59,130,246,0.2)"/>
        {/* sole detail */}
        <path d="M20 56 L60 56" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
        <path d="M18 52 Q40 55 62 52" stroke="#93c5fd" strokeWidth="1" opacity="0.4"/>
      </svg>
    ),
  },
  {
    label: "Вода",
    desc: "0.5–1 литр с собой",
    color: "from-sky-500/20 to-sky-600/5",
    border: "#0ea5e9",
    glow: "rgba(14,165,233,0.35)",
    icon: (
      <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
        <path d="M30 18 L28 26 L26 58 C26 63 30 68 40 68 C50 68 54 63 54 58 L52 26 L50 18 Z" stroke="#38bdf8" strokeWidth="2.5" strokeLinejoin="round" fill="rgba(14,165,233,0.12)"/>
        <path d="M30 18 L50 18" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round"/>
        <rect x="32" y="12" width="16" height="7" rx="3" stroke="#38bdf8" strokeWidth="2" fill="rgba(14,165,233,0.15)"/>
        <path d="M28 44 C32 40 38 40 42 44 C46 48 50 46 52 44" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M27 52 C31 49 37 49 41 52 C44 55 49 53 53 51" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
        <circle cx="37" cy="35" r="2" fill="#38bdf8" opacity="0.6"/>
        <circle cx="44" cy="32" r="1.5" fill="#7dd3fc" opacity="0.5"/>
      </svg>
    ),
  },
];

export default function FirstTraining() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
    <section className="relative bg-[#0d1525] py-20 lg:py-28 overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[#0a0a0a] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_50%,rgba(59,130,246,0.09),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_20%_50%,rgba(99,102,241,0.06),transparent)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text */}
          <Reveal>
            <span className="inline-block text-[#3B82F6] text-xs font-semibold uppercase tracking-widest border border-blue-500/20 bg-blue-500/5 rounded-md px-4 py-1.5 mb-5">
              Готовься просто
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-5 leading-tight">
              Что взять на{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                первую тренировку
              </span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4 text-base sm:text-lg">
              Для первого пробного занятия не нужна специальная экипировка. Просто приходите
              в удобной спортивной одежде — всё остальное мы предоставим.
            </p>

            {/* Highlight box */}
            <div className="flex items-start gap-3 bg-blue-500/[0.07] border border-blue-500/20 rounded-2xl px-5 py-4 mb-8">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 mt-0.5">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                </svg>
              </div>
              <p className="text-white text-sm sm:text-base font-semibold leading-snug">
                Кимоно, перчатки и бинты — <span className="text-blue-400">бесплатно на первую тренировку!</span>
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 hover:scale-105 hover:from-blue-500 hover:to-cyan-400 active:scale-95 text-base"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 L3 6 L3 20 Q3 22 5 22 L19 22 Q21 22 21 20 L21 6 L18 2 Z"/>
                <path d="M3 6 L21 6"/>
                <path d="M16 10 Q16 14 12 14 Q8 14 8 10"/>
              </svg>
              Получить экипировку
            </button>
          </Reveal>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {items.map((item, i) => (
              <Reveal key={item.label} delay={i * 80}>
                <div
                  className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{ border: `1px solid ${item.border}22` }}
                >
                  {/* Gradient BG */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
                  <div className="absolute inset-0 bg-[#090f1e]/60" />

                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${item.border}, transparent)` }} />

                  {/* Glow */}
                  <div
                    className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-300"
                    style={{ background: item.glow }}
                  />

                  <div className="relative p-5 sm:p-6 flex flex-col items-center gap-3">
                    <div className="group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                      {item.icon}
                    </div>
                    <div className="text-center">
                      <div className="text-white font-black text-sm sm:text-base uppercase tracking-wide leading-tight">{item.label}</div>
                      <div className="text-gray-500 text-[11px] sm:text-xs mt-0.5 leading-snug">{item.desc}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </div>
    </section>
      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
