import data from "@/data/personal.json";

export interface PersonalPlan {
  id: string;
  name: string;
  /** Полная стоимость блока в рублях. */
  total: number;
  sessions: number;
  highlight?: boolean;
}

export interface PersonalFormat {
  id: string;
  title: string;
  subtitle: string;
  /** Сколько человек занимается с одним тренером. */
  people: number;
  plans: PersonalPlan[];
}

export const personalReasons: string[] = data.reasons;
export const personalFormats: PersonalFormat[] = data.formats as PersonalFormat[];

/** Цена одного занятия. */
export function perSession(plan: PersonalPlan): number {
  return Math.round(plan.total / plan.sessions);
}

/** Цена одного занятия в расчёте на человека — для сплита это половина. */
export function perPerson(plan: PersonalPlan, format: PersonalFormat): number {
  return Math.round(perSession(plan) / Math.max(format.people, 1));
}

/**
 * Выгода блока против разового занятия того же формата, в процентах.
 * Считается, а не хранится: поменяли цену в data/personal.json — подписи
 * пересчитались сами и не разъехались с цифрами.
 */
export function savingPercent(plan: PersonalPlan, format: PersonalFormat): number {
  const single = format.plans.find((p) => p.sessions === 1);
  if (!single || plan.sessions === 1) return 0;
  const base = perSession(single);
  if (!base) return 0;
  return Math.round((1 - perSession(plan) / base) * 100);
}

/** Минимальная цена за занятие на человека по всем форматам — число для витрины. */
export function minPerPerson(): number {
  const all = personalFormats.flatMap((f) => f.plans.map((p) => perPerson(p, f)));
  return Math.min(...all);
}

/** 14000 → «14 000». Без Intl, чтобы сервер и клиент дали одинаковый результат. */
export function formatPrice(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
