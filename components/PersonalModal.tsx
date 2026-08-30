"use client";

import { useEffect, useState } from "react";
import { X, User, Users, Check } from "lucide-react";
import LeadModal from "./LeadModal";
import PlanRow from "./PersonalPlanRow";
import { personalReasons, personalFormats, formatPrice, minPerPerson } from "@/lib/personal";
import { reachGoal } from "@/lib/lead-utils";

interface PersonalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Персональные тренировки поверх страницы.
 *
 * Нужно там, где секции `#personal` нет: на страницах направлений блок цен
 * выводится, а секции персональных — нет, и ссылка «Подробнее» вела в пустоту.
 * Уводить человека на главную ради прайса значит терять страницу направления,
 * которую он сам и выбрал, — поэтому окно, а не переход.
 *
 * Цены и поводы берутся из тех же `personalFormats` и `personalReasons`, что и
 * секция: разъехаться им негде.
 */
export default function PersonalModal({ isOpen, onClose }: PersonalModalProps) {
  const [leadOpen, setLeadOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    reachGoal("personal_modal_open");

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    // Фон не должен прокручиваться под окном: иначе закрыл окно и обнаружил
    // себя в другом месте страницы.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* На телефоне — шторка снизу, на десктопе — окно по центру:
            те же правила, что у формы заявки, чтобы окна вели себя одинаково. */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Персональные тренировки"
          className="relative w-full sm:max-w-3xl bg-[#0d1525] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-black/50 flex flex-col max-h-[92dvh] sm:max-h-[88vh]"
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

          <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
            <div className="w-10 h-1 rounded-md bg-white/20" />
          </div>

          <div className="relative p-6 sm:p-8 overflow-y-auto">
            <button
              onClick={onClose}
              aria-label="Закрыть"
              className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/25 transition-colors"
            >
              <X size={16} />
            </button>

            <span className="inline-block text-[#3B82F6] text-xs font-semibold uppercase tracking-widest border border-blue-500/20 bg-blue-500/5 rounded-md px-4 py-1.5">
              Быстрее к результату
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-4 pr-10">
              Персональные тренировки
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mt-3 max-w-xl">
              По любому направлению — джиу-джитсу, борьба, бокс, ММА. Тренер работает с вашей
              задачей, а не со средним уровнем группы.
            </p>
            <p className="text-gray-300 text-sm mt-4">
              от{" "}
              <span className="text-white font-black text-xl">
                {formatPrice(minPerPerson())} ₽
              </span>{" "}
              с человека за тренировку
            </p>

            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 mt-6">
              {personalReasons.map((reason) => (
                <li key={reason} className="flex items-start gap-2.5 text-gray-400 text-[13px] leading-snug">
                  <Check size={14} className="text-blue-400 shrink-0 mt-0.5" />
                  {reason}
                </li>
              ))}
            </ul>

            <div className="grid sm:grid-cols-2 gap-4 mt-7">
              {personalFormats.map((format) => (
                <div
                  key={format.id}
                  className="flex flex-col rounded-2xl bg-white/[0.02] border border-white/[0.08] p-4 sm:p-5"
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                      {format.people > 1 ? (
                        <Users size={15} className="text-blue-400" />
                      ) : (
                        <User size={15} className="text-blue-400" />
                      )}
                    </span>
                    <h3 className="text-white font-black text-base">{format.title}</h3>
                  </div>
                  <p className="text-gray-500 text-xs mb-4 leading-snug">{format.subtitle}</p>

                  <div className="space-y-2.5">
                    {format.plans.map((plan) => (
                      <PlanRow key={plan.id} plan={plan} format={format} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setLeadOpen(true)}
              className="mt-7 w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-4 rounded-xl text-sm sm:text-base hover:opacity-90 transition-opacity"
            >
              Записаться на персональную
            </button>
            <p className="text-gray-500 text-xs text-center mt-4">
              Тренеры работают по всем направлениям — удобное время подберём при записи.
            </p>
          </div>
        </div>
      </div>

      <LeadModal
        isOpen={leadOpen}
        onClose={() => setLeadOpen(false)}
        source="Персональные — окно со страницы направления"
      />
    </>
  );
}
