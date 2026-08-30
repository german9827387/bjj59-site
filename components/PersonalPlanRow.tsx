"use client";
import {
  perSession,
  perPerson,
  savingPercent,
  formatPrice,
  type PersonalFormat,
  type PersonalPlan,
} from "@/lib/personal";

/**
 * Строка тарифа персональной тренировки.
 *
 * Вынесена из секции, потому что теперь её показывают двое: сама секция на
 * главной и окно, которое открывается со страниц направлений. Две копии
 * разметки означали бы, что однажды цену поправят в одной и забудут в другой —
 * а это цифры, по которым человек принимает решение о деньгах.
 */
export default function PlanRow({ plan, format }: { plan: PersonalPlan; format: PersonalFormat }) {
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
            className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-md tracking-wider ${
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
