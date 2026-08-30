"use client";
import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import pricingJson from "@/data/pricing.json";
import Reveal from "./Reveal";
import LeadModal from "./LeadModal";
import PersonalModal from "./PersonalModal";
import { minPerPerson, formatPrice } from "@/lib/personal";

const plans = pricingJson;
const personalFrom = formatPrice(minPerPerson());

export default function Pricing() {
  const [personalOpen, setPersonalOpen] = useState(false);

  /**
   * «Подробнее» у персоналок ведёт на якорь `#personal`, а секция с этим
   * якорем есть только на главной. Блок цен при этом выводится и на страницах
   * направлений — там ссылка вела в пустоту, и клик не делал ничего.
   *
   * Решаем в момент клика, а не сборки: где секция есть — прокручиваем к ней,
   * где нет — открываем окно. Одно правило, и оно не сломается, если секцию
   * когда-нибудь добавят на страницы направлений.
   */
  const openPersonal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (document.getElementById("personal")) return;
    e.preventDefault();
    setPersonalOpen(true);
  };

  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
    <section id="pricing" className="relative py-20 lg:py-28 bg-[#0d1525] overflow-hidden">
      {/* Фоновые эффекты */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#0d1525] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(59,130,246,0.10),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_100%,rgba(6,182,212,0.07),transparent)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#0d1525] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Reveal>
            <span className="inline-block text-[#3B82F6] text-xs font-semibold uppercase tracking-widest border border-blue-500/20 bg-blue-500/5 rounded-md px-4 py-1.5 mb-4">
              Инвестиции в себя
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">
              Стоимость{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                занятий
              </span>
            </h2>
            <p className="text-gray-400 mt-4">
              Первое занятие — бесплатно. Приходите и убедитесь сами!
            </p>
          </Reveal>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {plans.map((plan, i) => (
            <Reveal
              key={plan.title}
              delay={i * 80}
              className={`relative rounded-2xl flex flex-col overflow-hidden ${
                plan.highlight
                  ? "bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 shadow-[0_0_40px_rgba(59,130,246,0.35)] ring-1 ring-blue-400/40"
                  : "bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/30 hover:bg-white/[0.05] transition-all duration-300"
              }`}
            >
              {/* Верхняя полоска для не-highlight карточек */}
              {!plan.highlight && (
                <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              )}

              <div className="p-3 sm:p-6 flex flex-col flex-1">
                {/* Badge */}
                <span
                  className={`self-start text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-md mb-2 sm:mb-4 tracking-wider ${plan.highlight ? "bg-white/20 text-white" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}
                >
                  {plan.label}
                </span>

                <h3 className={`font-bold text-xs sm:text-lg mb-2 sm:mb-3 leading-tight ${plan.highlight ? "text-white" : "text-white"}`}>
                  {plan.title}
                </h3>

                <div className="flex items-baseline gap-1 mb-3 sm:mb-5">
                  <span
                    className={`text-2xl sm:text-4xl font-black ${plan.highlight ? "text-white" : "bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text"}`}
                  >
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlight ? "text-white/70" : "text-gray-500"}`}>
                    {plan.unit}
                  </span>
                </div>

                {/* Разделитель */}
                <div className={`h-px mb-5 ${plan.highlight ? "bg-white/20" : "bg-white/[0.06]"}`} />

                <ul className="space-y-1 sm:space-y-2.5 mb-3 sm:mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check
                        size={14}
                        className={`shrink-0 mt-0.5 ${plan.highlight ? "text-white" : "text-blue-400"}`}
                      />
                      <span className={`text-xs sm:text-sm leading-snug ${plan.highlight ? "text-white/85" : "text-gray-400"}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setModalOpen(true)}
                  className={`mt-auto text-center font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-xl text-xs sm:text-sm transition-all duration-200 ${plan.highlight ? "bg-white text-blue-600 hover:bg-blue-50 shadow-md" : "border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400/60"}`}
                >
                  {plan.cta}
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Мостик к персоналкам: не седьмой карточкой — она сломала бы ряд 3+3 */}
        <Reveal delay={220}>
          <a
            href="#personal"
            onClick={openPersonal}
            className="group mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-blue-500/25 bg-gradient-to-r from-blue-500/[0.08] to-cyan-500/[0.04] px-5 sm:px-7 py-5 hover:border-blue-400/50 transition-colors"
          >
            <div className="text-center sm:text-left">
              <div className="text-white font-black text-base sm:text-lg">
                Нужен результат быстрее?
              </div>
              <div className="text-gray-400 text-sm mt-1">
                Персональные тренировки — от {personalFrom} ₽ с человека за занятие
              </div>
            </div>
            <span className="shrink-0 inline-flex items-center gap-2 text-blue-400 font-bold text-sm border border-blue-500/40 rounded-md px-5 py-2.5 group-hover:bg-blue-500/10 transition-colors">
              Подробнее
              <ArrowRight size={16} />
            </span>
          </a>
        </Reveal>
      </div>
    </section>
    <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    <PersonalModal isOpen={personalOpen} onClose={() => setPersonalOpen(false)} />
    </>
  );
}
