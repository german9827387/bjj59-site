"use client";
import { useState } from "react";
import { User, Users, Check } from "lucide-react";
import Reveal from "./Reveal";
import LeadModal from "./LeadModal";
import {
  personalReasons,
  personalFormats,
  perSession,
  perPerson,
  savingPercent,
  formatPrice,
  type PersonalFormat,
  type PersonalPlan,
} from "@/lib/personal";

function PlanRow({ plan, format }: { plan: PersonalPlan; format: PersonalFormat }) {
  const each = perSession(plan);
  const person = perPerson(plan, format);
  const saving = savingPercent(plan, format);
  const showPerPerson = format.people > 1;

  return (
    <div
      className={`relative rounded-2xl p-4 sm:p-5 ${
        plan.highlight
          ? "bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 shadow-[0_0_30px_rgba(59,130,246,0.28)] ring-1 ring-blue-400/40"
          : "bg-white/[0.03] border border-white/[0.08]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className={`font-bold text-sm ${plan.highlight ? "text-white" : "text-white"}`}>
            {plan.name}
          </div>
          {/* Для разового полная сумма равна цене занятия — не дублируем */}
          {plan.sessions > 1 && (
            <div className={`text-xs mt-0.5 ${plan.highlight ? "text-white/70" : "text-gray-500"}`}>
              {formatPrice(plan.total)} ₽ за блок
            </div>
          )}
        </div>

        {saving > 0 && (
          <span
            className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full tracking-wider ${
              plan.highlight
                ? "bg-white/20 text-white"
                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
            }`}
          >
            ВЫГОДА {saving}%
          </span>
        )}
      </div>

      <div className={`h-px my-3 ${plan.highlight ? "bg-white/20" : "bg-white/[0.06]"}`} />

      {/* Крупно — цена за занятие: «14 000 ₽» пугает, «1 400 ₽ за тренировку» — нет */}
      <div className="flex items-baseline gap-1.5">
        <span
          className={`text-2xl sm:text-3xl font-black ${
            plan.highlight
              ? "text-white"
              : "bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text"
          }`}
        >
          {formatPrice(each)} ₽
        </span>
        <span className={`text-xs ${plan.highlight ? "text-white/70" : "text-gray-500"}`}>
          за тренировку
        </span>
      </div>

      {/* Строка всегда занимает место, даже пустая: иначе строки в колонках
          «один на один» и «сплит» разъезжаются по высоте — они стоят рядом. */}
      <div className={`text-[13px] mt-1 min-h-[1.15rem] ${plan.highlight ? "text-white/90" : "text-gray-400"}`}>
        {showPerPerson && (
          <>
            это <span className="font-bold">{formatPrice(person)} ₽</span> с человека
          </>
        )}
      </div>
    </div>
  );
}

export default function PersonalTraining() {
  const [modalOpen, setModalOpen] = useState(false);

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
              <span className="inline-block text-[#3B82F6] text-xs font-semibold uppercase tracking-widest border border-blue-500/20 bg-blue-500/5 rounded-full px-4 py-1.5 mb-4">
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
      </section>

      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} source="Персональные тренировки" />
    </>
  );
}
