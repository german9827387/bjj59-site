"use client";

import { useState, useEffect } from "react";
import { Phone, User, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Reveal from "./Reveal";
import { persistUtm, formatPhone, isValidPhone, postLead, reachLeadGoal, reachGoalOnce } from "@/lib/lead-utils";
import ConsentCheckbox from "./ConsentCheckbox";

export default function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Сохраняем UTM при монтировании (дублирует TgLinkHandler для надёжности)
  useEffect(() => { persistUtm(); }, []);

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    reachGoalOnce("form_start");
    setPhone(formatPhone(e.target.value));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!isValidPhone(phone)) { setError("Введите номер полностью"); return; }
    if (!agreed) { setError("Подтвердите согласие на обработку персональных данных"); return; }
    setLoading(true);
    setError("");
    const res = await postLead({ name, phone, source: "Инлайн-форма" });
    setLoading(false);
    if (!res.ok) { setError(res.error); return; }
    setSent(true);
    reachLeadGoal("lead_form");
  };

  return (
    <section className="relative py-20 lg:py-28 bg-[#0d1525] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(59,130,246,0.08),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_20%,rgba(6,182,212,0.06),transparent)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — text */}
          <Reveal>
            <span className="inline-block text-[#3B82F6] text-xs font-semibold uppercase tracking-widest border border-blue-500/20 bg-blue-500/5 rounded-md px-4 py-1.5 mb-5">
              Записаться на пробное
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">
              Перезвоним{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                за 30 минут
              </span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Оставьте имя и телефон — мы свяжемся, ответим на вопросы и подберём удобное время для первой бесплатной тренировки.
            </p>

            {/* Guarantees */}
            <ul className="space-y-3">
              {[
                "Первое занятие — бесплатно",
                "Подберём группу под ваш уровень",
                "Экипировка на первый урок в подарок",
                "Без обязательств — просто попробуйте",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Right — form */}
          <Reveal delay={150}>
            <div className="relative rounded-3xl bg-white/[0.03] border border-white/[0.08] p-8 sm:p-10">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent rounded-t-3xl" />

              {sent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={32} className="text-blue-400" />
                  </div>
                  <h3 className="text-white font-black text-2xl mb-2">Заявка принята!</h3>
                  <p className="text-gray-400">
                    Мы получили ваш номер и перезвоним в течение 30 минут.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Ваше имя <span className="text-gray-600">— необязательно</span></label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => { reachGoalOnce("form_start"); setName(e.target.value); setError(""); }}
                        placeholder="Иван"
                        className="ym-disable-keys ym-hide-content w-full bg-white/[0.04] border border-white/[0.10] hover:border-blue-500/30 focus:border-blue-500/60 text-white placeholder-gray-600 rounded-xl py-3.5 pl-10 pr-4 outline-none transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Телефон</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={handlePhone}
                        placeholder="+7 (000) 000-00-00"
                        className="ym-disable-keys ym-hide-content w-full bg-white/[0.04] border border-white/[0.10] hover:border-blue-500/30 focus:border-blue-500/60 text-white placeholder-gray-600 rounded-xl py-3.5 pl-10 pr-4 outline-none transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <ConsentCheckbox id="consent-inline" checked={agreed} onChange={(v) => { setAgreed(v); setError(""); }} />

                  {error && (
                    <p className="text-red-400 text-xs">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-4 px-8 rounded-xl text-base flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-[1.01] shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:scale-100 mt-2"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        Записаться бесплатно
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
