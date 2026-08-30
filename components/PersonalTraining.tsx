"use client";
import { useState } from "react";
import { User, Users, Check, ChevronDown } from "lucide-react";
import Reveal from "./Reveal";
import LeadModal from "./LeadModal";
import {
  personalReasons,
  personalFormats,
  formatPrice,
  minPerPerson,
} from "@/lib/personal";
import PlanRow from "./PersonalPlanRow";
import { reachGoalOnce } from "@/lib/lead-utils";

export default function PersonalTraining() {
  const [modalOpen, setModalOpen] = useState(false);
  // Свёрнут по умолчанию: подряд с блоком цен это была четверть страницы
  // и двенадцать тарифов сразу. Кто пришёл за персоналкой — раскроет.
  const [open, setOpen] = useState(false);

  return (
    <>
      <section id="personal" className="relative py-20 lg:py-28 bg-[#0a0a0a] overflow-hidden">
        {/* Фоновые эффекты — как в соседних секциях */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(59,130,246,0.09),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_100%,rgba(6,182,212,0.06),transparent)] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Заголовок */}
          <div className="text-center mb-12">
            <Reveal>
              <span className="inline-block text-[#3B82F6] text-xs font-semibold uppercase tracking-widest border border-blue-500/20 bg-blue-500/5 rounded-md px-4 py-1.5 mb-4">
                Быстрее к результату
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">
                Персональные{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                  тренировки
                </span>
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                По любому направлению — джиу-джитсу, борьба, бокс, ММА. Тренер работает
                с вашей задачей, а не со средним уровнем группы.
              </p>
            </Reveal>
          </div>

          {/* Крючок и переключатель — по умолчанию видно только это */}
          <Reveal delay={80}>
            <div className="flex flex-col items-center gap-5 mb-2">
              <p className="text-center">
                <span className="text-gray-400 text-sm">от </span>
                <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text align-middle">
                  {formatPrice(minPerPerson())} ₽
                </span>
                <span className="text-gray-400 text-sm"> с человека за тренировку</span>
              </p>
              <button
                type="button"
                aria-expanded={open}
                aria-controls="personal-details"
                onClick={() => {
                  setOpen((v) => {
                    if (!v) reachGoalOnce("personal_expand");
                    return !v;
                  });
                }}
                className="inline-flex items-center gap-2 border border-blue-500/40 text-blue-400 font-bold py-3 px-7 rounded-md text-sm hover:bg-blue-500/10 hover:border-blue-400/60 transition-all"
              >
                {open ? "Свернуть" : "Смотреть цены и форматы"}
                <ChevronDown size={16} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
              </button>
            </div>
          </Reveal>

          {/* Содержимое остаётся в разметке и при свёрнутом виде — иначе цены
              выпали бы из поиска. Сворачивается сеткой 0fr/1fr, без магических
              высот. */}
          <div
            id="personal-details"
            className={`grid transition-all duration-500 ease-out ${open ? "grid-rows-[1fr] opacity-100 mt-10" : "grid-rows-[0fr] opacity-0 mt-0"}`}
            aria-hidden={!open}
          >
            <div className="overflow-hidden">

          {/* Поводы — прайс сам по себе не продаёт */}
          <Reveal delay={100}>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 max-w-3xl mx-auto mb-12">
              {personalReasons.map((reason) => (
                <li key={reason} className="flex items-start gap-3 text-gray-300 text-sm">
                  <Check size={16} className="text-blue-400 shrink-0 mt-0.5" />
                  {reason}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Два формата */}
          <div className="grid md:grid-cols-2 gap-5 lg:gap-8">
            {personalFormats.map((format, i) => (
              <Reveal key={format.id} delay={i * 140} className="h-full">
                <div className="relative h-full flex flex-col rounded-3xl bg-white/[0.02] border border-white/[0.08] p-5 sm:p-7">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent rounded-t-3xl" />

                  <div className="flex items-center gap-3 mb-1">
                    <span className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                      {format.people > 1 ? (
                        <Users size={17} className="text-blue-400" />
                      ) : (
                        <User size={17} className="text-blue-400" />
                      )}
                    </span>
                    <h3 className="text-white font-black text-lg sm:text-xl">{format.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 leading-snug">{format.subtitle}</p>

                  <div className="space-y-3 flex-1">
                    {format.plans.map((plan) => (
                      <PlanRow key={plan.id} plan={plan} format={format} />
                    ))}
                  </div>

                  <button
                    onClick={() => setModalOpen(true)}
                    className="mt-6 w-full text-center font-bold py-3 px-6 rounded-xl text-sm border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400/60 transition-all duration-200"
                  >
                    Записаться на персональную
                  </button>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={280}>
            <p className="text-gray-500 text-xs text-center mt-8 max-w-xl mx-auto">
              Тренеры работают по всем направлениям — удобное время подберём при записи.
            </p>
          </Reveal>

            </div>
          </div>
        </div>
      </section>

      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} source="Персональные тренировки" />
    </>
  );
}
