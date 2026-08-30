"use client";
import { Check } from "lucide-react";
import Reveal from "./Reveal";
import LeadModal from "./LeadModal";
import { useState } from "react";

const qualities = [
  "Дисциплина",
  "Уверенность",
  "Самоконтроль",
  "Уважение",
  "Целеустремлённость",
  "Ответственность",
  "Коммуникация",
  "Лидерство",
];

const progressSteps = [
  {
    icon: "📋",
    title: "Тренер оценивает",
    desc: "по 8 качествам в приложении",
  },
  {
    icon: "⭐",
    title: "Ребёнок накапливает",
    desc: "баллы за развитие каждого качества",
  },
  {
    icon: "🔄",
    title: "Обменивает",
    desc: "баллы на фирменные браслеты",
  },
  {
    icon: "🏆",
    title: "Участвует",
    desc: "в ярмарке и получает классные призы",
  },
  {
    icon: "🥋",
    title: "Проходит",
    desc: "аттестацию на пояс",
  },
];

export default function ChildrenSystem() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="relative py-20 lg:py-28 bg-[#0F2A4D] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_50%,rgba(59,130,246,0.10),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_100%_50%,rgba(6,182,212,0.07),transparent)] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Left column — qualities */}
            <Reveal>
              <span className="inline-block text-cyan-400 text-xs font-semibold uppercase tracking-widest border border-cyan-500/25 bg-cyan-500/8 rounded-md px-4 py-1.5 mb-5">
                Детские группы
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
                СИСТЕМА РАЗВИТИЯ{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 text-transparent bg-clip-text">
                  ДЛЯ ДЕТЕЙ
                </span>
              </h2>
              <p className="text-gray-400 text-base leading-relaxed mb-8">
                Развиваем 8 качеств, которые помогают ребёнку в жизни и в спорте через игровую систему мотивации
              </p>

              {/* Qualities grid */}
              <div className="grid grid-cols-2 gap-3 mb-10">
                {qualities.map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                      <Check size={11} className="text-cyan-400" strokeWidth={3} />
                    </div>
                    <span className="text-white text-sm font-medium">{q}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="bg-gradient-to-r from-[#2EA6FF] to-[#1C7ED6] text-white font-black py-4 px-8 rounded-[14px] text-sm hover:scale-[1.03] transition-all duration-250 shadow-[0_10px_30px_rgba(46,166,255,0.25)]"
              >
                Записать ребёнка на занятие
              </button>
            </Reveal>

            {/* Right column — progress steps */}
            <Reveal delay={150}>
              <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-6">КАК ЭТО РАБОТАЕТ:</p>

              <div className="space-y-4">
                {progressSteps.map((step, i) => (
                  <div key={step.title} className="flex items-center gap-4">
                    {/* Step block */}
                    <div className="flex-1 flex items-center gap-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-5 py-4 hover:border-blue-500/20 transition-colors">
                      <span className="text-2xl">{step.icon}</span>
                      <div>
                        <div className="text-white font-bold text-sm">{step.title}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{step.desc}</div>
                      </div>
                    </div>

                    {/* Arrow */}
                    {i < progressSteps.length - 1 && (
                      <div className="text-cyan-500/50 text-lg shrink-0">→</div>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>

          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#0a0a0a] pointer-events-none" />
      </section>
      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
