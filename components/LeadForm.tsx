"use client";

import { useState } from "react";
import { Phone, User, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Reveal from "./Reveal";

export default function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    if (!digits) return "";
    if (digits.length <= 1) return "+7";
    const d = digits.startsWith("7") ? digits : "7" + digits;
    const p = d.slice(1);
    let out = "+7";
    if (p.length > 0) out += " (" + p.slice(0, 3);
    if (p.length >= 3) out += ") " + p.slice(3, 6);
    if (p.length >= 6) out += "-" + p.slice(6, 8);
    if (p.length >= 8) out += "-" + p.slice(8, 10);
    return out;
  };

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 11) {
      setError("Введите номер полностью");
      return;
    }
    if (!name.trim()) {
      setError("Введите ваше имя");
      return;
    }
    setLoading(true);

    // Отправляем через Telegram (открываем с предзаполненным текстом)
    const text = `Здравствуйте! Меня зовут ${name.trim()}, мой номер: ${phone}. Хочу записаться на пробное занятие.`;
    const tgUrl = `https://t.me/GSAcademy59?text=${encodeURIComponent(text)}`;

    setTimeout(() => {
      setLoading(false);
      setSent(true);
      window.open(tgUrl, "_blank");
    }, 600);
  };

  return (
    <section className="relative py-20 lg:py-28 bg-[#0d1525] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(59,130,246,0.08),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_20%,rgba(6,182,212,0.06),transparent)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — text */}
          <Reveal>
            <span className="inline-block text-[#3B82F6] text-xs font-semibold uppercase tracking-widest border border-blue-500/20 bg-blue-500/5 rounded-full px-4 py-1.5 mb-5">
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
                  <h3 className="text-white font-black text-2xl mb-2">Отлично!</h3>
                  <p className="text-gray-400">
                    Сообщение открыто в Telegram — отправьте его, и мы ответим в течение 30 минут.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Ваше имя</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(""); }}
                        placeholder="Иван"
                        className="w-full bg-white/[0.04] border border-white/[0.10] hover:border-blue-500/30 focus:border-blue-500/60 text-white placeholder-gray-600 rounded-xl py-3.5 pl-10 pr-4 outline-none transition-colors text-sm"
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
                        className="w-full bg-white/[0.04] border border-white/[0.10] hover:border-blue-500/30 focus:border-blue-500/60 text-white placeholder-gray-600 rounded-xl py-3.5 pl-10 pr-4 outline-none transition-colors text-sm"
                      />
                    </div>
                  </div>

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

                  <p className="text-gray-600 text-xs text-center">
                    Нажимая кнопку, вы соглашаетесь с{" "}
                    <a href="/privacy" className="text-gray-500 hover:text-gray-400 underline underline-offset-2">
                      политикой конфиденциальности
                    </a>
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
