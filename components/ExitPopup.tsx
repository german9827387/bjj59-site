"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Phone, User, ArrowRight, CheckCircle2, Loader2, ChevronLeft } from "lucide-react";

const SESSION_KEY = "exit_popup_shown";

// ── Quiz data ──────────────────────────────────────────────────────────────
const STEP0 = {
  q: "Для кого хотите записаться?",
  options: [
    { id: "adult", emoji: "👤", label: "Для себя" },
    { id: "child", emoji: "👶", label: "Для ребёнка" },
    { id: "family", emoji: "👨‍👩‍👦", label: "Для семьи" },
  ],
};

const STEP1: Record<string, { q: string; options: { id: string; emoji: string; label: string }[] }> = {
  adult: {
    q: "Что для вас главное?",
    options: [
      { id: "shape", emoji: "💪", label: "Форма и похудение" },
      { id: "selfdefense", emoji: "🛡️", label: "Самооборона" },
      { id: "compete", emoji: "🏆", label: "Соревнования" },
      { id: "stress", emoji: "🧠", label: "Разгрузка от стресса" },
    ],
  },
  child: {
    q: "Сколько лет ребёнку?",
    options: [
      { id: "3–5 лет", emoji: "🐣", label: "3–5 лет" },
      { id: "6–12 лет", emoji: "🎒", label: "6–12 лет" },
      { id: "13+ лет", emoji: "🎓", label: "13+ лет" },
    ],
  },
  family: {
    q: "Кто будет тренироваться вместе?",
    options: [
      { id: "Папа + ребёнок", emoji: "👨‍👦", label: "Папа + ребёнок" },
      { id: "Мама + ребёнок", emoji: "👩‍👦", label: "Мама + ребёнок" },
      { id: "Вся семья", emoji: "👨‍👩‍👦", label: "Вся семья" },
    ],
  },
};

const STEP2 = {
  q: "Когда удобнее тренироваться?",
  options: [
    { id: "Утро", emoji: "🌅", label: "Утром (до 12:00)" },
    { id: "Вечер", emoji: "🌆", label: "Вечером (после 17:00)" },
    { id: "Выходные", emoji: "📅", label: "По выходным" },
  ],
};

function getOffer(who: string, goalLabel: string): { headline: string; sub: string } {
  if (who === "adult") {
    if (goalLabel === "Форма и похудение") return { headline: "Сожжём лишнее и поставим тело", sub: "Первая тренировка — бесплатно" };
    if (goalLabel === "Самооборона") return { headline: "Научим защищать себя", sub: "Первая тренировка — бесплатно" };
    if (goalLabel === "Соревнования") return { headline: "Поставим технику и выйдем на ковёр", sub: "Первая тренировка — бесплатно" };
    if (goalLabel === "Разгрузка от стресса") return { headline: "Разгрузим голову за один час", sub: "Первая тренировка — бесплатно" };
  }
  if (who === "child") {
    return { headline: `Группа ${goalLabel} ждёт`, sub: "Запишем на пробное занятие бесплатно" };
  }
  if (who === "family") {
    return { headline: "Семейный абонемент — тренируйтесь вместе", sub: "Запишем и уточним условия" };
  }
  return { headline: "Первая тренировка — бесплатно", sub: "Оставьте номер и мы всё расскажем" };
}

function buildSource(isMobile: boolean, whoLabel: string, goalLabel: string, whenLabel: string): string {
  const base = isMobile ? "Мобильный квиз" : "Exit Intent квиз";
  return `${base} · ${whoLabel} · ${goalLabel} · ${whenLabel}`;
}

function getUtm() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const v = p.get(key) || sessionStorage.getItem(key);
    if (v) utm[key] = v;
  }
  return utm;
}

function formatPhone(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  const d = digits.startsWith("7") ? digits : "7" + digits;
  const p = d.slice(1);
  let out = "+7";
  if (p.length > 0) out += " (" + p.slice(0, 3);
  if (p.length >= 3) out += ") " + p.slice(3, 6);
  if (p.length >= 6) out += "-" + p.slice(6, 8);
  if (p.length >= 8) out += "-" + p.slice(8, 10);
  return out;
}

function QuizStep({
  q,
  options,
  onSelect,
}: {
  q: string;
  options: { id: string; emoji: string; label: string }[];
  onSelect: (id: string, label: string) => void;
}) {
  return (
    <div>
      <p className="text-white font-bold text-lg mb-5 leading-snug">{q}</p>
      <div className="flex flex-col gap-2.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id, opt.label)}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:border-blue-500/50 hover:bg-blue-500/10 text-white text-sm font-medium transition-all group"
          >
            <span className="text-xl leading-none">{opt.emoji}</span>
            <span className="flex-1">{opt.label}</span>
            <ArrowRight size={14} className="text-gray-600 group-hover:text-blue-400 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ExitPopup() {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Quiz state
  const [step, setStep] = useState(0); // 0,1,2 = quiz; 3 = form
  const [who, setWho] = useState("");
  const [whoLabel, setWhoLabel] = useState("");
  const [goalLabel, setGoalLabel] = useState("");
  const [whenLabel, setWhenLabel] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const show = useCallback(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    setVisible(true);
    sessionStorage.setItem(SESSION_KEY, "1");
  }, []);

  const hide = useCallback(() => setVisible(false), []);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (mobile) {
      const t = setTimeout(show, 20_000);
      return () => clearTimeout(t);
    } else {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.relatedTarget === null || (e.clientY <= 10 && !e.relatedTarget)) show();
      };
      document.documentElement.addEventListener("mouseleave", handleMouseLeave);
      return () => document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Введите имя"); return; }
    if (phone.replace(/\D/g, "").length < 11) { setError("Введите номер полностью"); return; }
    setLoading(true);
    setError("");
    const source = buildSource(isMobile, whoLabel, goalLabel, whenLabel);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone, utm: getUtm(), source }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) { setError(data.error ?? "Ошибка"); setLoading(false); return; }
      setSent(true);
      if (typeof window !== "undefined" && (window as any).ym) {
        (window as any).ym((window as any).__YM_COUNTER_ID__, "reachGoal", "lead_submit");
      }
    } catch {
      setError("Нет соединения.");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  const offer = step === 3 ? getOffer(who, goalLabel) : null;

  const content = (
    <>
      {/* Progress bar — only on quiz steps */}
      {step < 3 && (
        <div className="flex items-center gap-3 mb-5">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="w-7 h-7 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-gray-400 hover:text-white transition-all flex-shrink-0"
            >
              <ChevronLeft size={14} />
            </button>
          )}
          <div className="flex-1 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-blue-500" : "bg-white/10"}`}
              />
            ))}
          </div>
          <span className="text-gray-500 text-xs tabular-nums flex-shrink-0">Шаг {step + 1} / 3</span>
        </div>
      )}

      {sent ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} className="text-blue-400" />
          </div>
          <h3 className="text-white font-black text-xl mb-2">Заявка принята!</h3>
          <p className="text-gray-400 text-sm">Перезвоним в течение 30 минут.</p>
        </div>
      ) : step === 0 ? (
        <QuizStep
          q={STEP0.q}
          options={STEP0.options}
          onSelect={(id, label) => { setWho(id); setWhoLabel(label); setStep(1); }}
        />
      ) : step === 1 ? (
        <QuizStep
          q={STEP1[who].q}
          options={STEP1[who].options}
          onSelect={(_, label) => { setGoalLabel(label); setStep(2); }}
        />
      ) : step === 2 ? (
        <QuizStep
          q={STEP2.q}
          options={STEP2.options}
          onSelect={(_, label) => { setWhenLabel(label); setStep(3); }}
        />
      ) : (
        /* Form step */
        <div>
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-xs mb-4 transition-colors"
          >
            <ChevronLeft size={13} />
            Назад
          </button>
          <div className="text-center mb-5">
            <span className="text-2xl mb-2 block">🥋</span>
            <h2 className="text-white font-black text-xl leading-tight mb-1">{offer!.headline}</h2>
            <p className="text-blue-400 text-sm font-semibold">{offer!.sub}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                placeholder="Ваше имя"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-blue-500/50 text-white placeholder-gray-600 rounded-xl py-3 pl-10 pr-4 outline-none text-sm"
              />
            </div>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(formatPhone(e.target.value)); setError(""); }}
                placeholder="+7 (000) 000-00-00"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-blue-500/50 text-white placeholder-gray-600 rounded-xl py-3 pl-10 pr-4 outline-none text-sm"
              />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <><span>Записаться</span><ArrowRight size={16} /></>
              )}
            </button>
            <p className="text-gray-600 text-xs text-center">
              Нажимая кнопку, вы соглашаетесь с{" "}
              <a href="/privacy" className="underline hover:text-gray-400">политикой конфиденциальности</a>
            </p>
          </form>
        </div>
      )}
    </>
  );

  // Mobile — bottom sheet
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[200] flex items-end">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={hide} />
        <div className="relative w-full bg-[#0d1525] border-t border-blue-500/30 rounded-t-3xl p-6 pb-10 shadow-2xl z-10">
          <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
          <button
            onClick={hide}
            className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-gray-500 hover:text-white transition-all"
          >
            <X size={14} />
          </button>
          {content}
        </div>
      </div>
    );
  }

  // Desktop — modal
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={hide} />
      <div className="relative w-full max-w-md bg-[#0d1525] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative p-8">
          <button
            onClick={hide}
            className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-gray-500 hover:text-white transition-all"
          >
            <X size={14} />
          </button>
          {content}
        </div>
      </div>
    </div>
  );
}


