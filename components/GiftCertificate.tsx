"use client";

import { useState, useEffect } from "react";
import { Gift, Check, Phone, User, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";
import giftJson from "@/data/gift.json";
import Reveal from "./Reveal";
import ConsentCheckbox from "./ConsentCheckbox";
import {
  formatPhone,
  isValidPhone,
  postLead,
  reachLeadGoal,
  reachGoalOnce,
  persistUtm,
} from "@/lib/lead-utils";
import { formatPrice } from "@/lib/personal";

const { options, validMonths } = giftJson;

/** Почему это лучший подарок — то, чем сертификат бьёт свечки и носки. */
const REASONS = [
  "Не пылится на полке и не отправится в дальний ящик",
  "Подойдёт и ребёнку с 3 лет, и взрослому с нуля",
  "Экипировку на первое занятие дадим — приходить можно налегке",
  `Действует ${validMonths} месяцев, продлим по звонку`,
];

export default function GiftCertificate() {
  const [selected, setSelected] = useState(options[1].id);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [to, setTo] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // На страницу ведут отдельной рекламой — метки нужно сохранить и здесь
  useEffect(() => { persistUtm(); }, []);

  const option = options.find((o) => o.id === selected) ?? options[1];

  const choose = (id: string) => {
    setSelected(id);
    setError("");
    reachGoalOnce("gift_select");
    document.getElementById("gift-order")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!isValidPhone(phone)) { setError("Введите номер полностью"); return; }
    if (!agreed) { setError("Подтвердите согласие на обработку персональных данных"); return; }
    setLoading(true);
    setError("");

    const gift = option.price
      ? `${option.title} — ${formatPrice(option.price)} ₽`
      : `${option.title} (сумму уточнить)`;
    const note = to.trim() ? `Кому: ${to.trim()}` : "";

    const res = await postLead({
      name,
      phone,
      source: "Подарочный сертификат",
      direction: gift,
      note,
    });
    setLoading(false);
    if (!res.ok) { setError(res.error); return; }
    setSent(true);
    reachLeadGoal("gift_submit");
  };

  return (
    <div className="relative min-h-screen bg-[#0d1525] pt-24 pb-20 overflow-hidden">
      {/* Фактура зала под тяжёлым затемнением: даёт глубину, но не спорит с текстом */}
      <div className="absolute inset-x-0 top-0 h-[900px] pointer-events-none">
        <Image
          src="/gym1.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.14]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1525]/80 via-[#0d1525]/90 to-[#0d1525]" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(59,130,246,0.14),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_15%_90%,rgba(6,182,212,0.07),transparent)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Первый экран: слева обещание, справа сам сертификат.
            Подарок покупают глазами — показать его важнее, чем описать. */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20 lg:mb-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-[#3B82F6] text-xs font-semibold uppercase tracking-widest border border-blue-500/20 bg-blue-500/5 rounded-md px-4 py-1.5 mb-5">
              <Gift size={13} />
              Подарочный сертификат
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Подарите не вещь,{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                а повод начать
              </span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg mt-5 leading-relaxed">
              Сертификат на тренировки в GSAcademy — джиу-джитсу, борьба, бокс, ММА.
              Оформим за 15 минут и пришлём в мессенджер: успеете подарить хоть сегодня вечером.
            </p>

            <ul className="space-y-2.5 mt-7">
              {REASONS.map((r) => (
                <li key={r} className="flex items-start gap-3 text-gray-300 text-sm">
                  <Check size={16} className="text-blue-400 shrink-0 mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => document.getElementById("gift-options")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-3.5 px-8 rounded-md text-sm sm:text-base hover:opacity-90 transition-all hover:scale-[1.02] shadow-2xl shadow-blue-500/25"
            >
              Выбрать сертификат
              <ArrowRight size={17} />
            </button>
          </Reveal>

          <Reveal delay={140}>
            <figure className="relative">
              <div className="absolute -inset-8 bg-gradient-to-tr from-blue-500/25 via-cyan-400/10 to-transparent blur-3xl rounded-md pointer-events-none" />
              <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/12 shadow-2xl shadow-blue-950/70 rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/gift-sample.jpg"
                  alt="Подарочный сертификат GSAcademy — так он выглядит"
                  width={1400}
                  height={875}
                  priority
                  sizes="(max-width: 1024px) 90vw, 46vw"
                  className="w-full h-auto"
                />
              </div>
              <figcaption className="relative text-center text-gray-500 text-xs mt-6">
                Так выглядит сертификат — пришлём картинкой, её удобно переслать
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* Варианты */}
        <div id="gift-options" className="scroll-mt-24" />
        <Reveal delay={140}>
          <h2 className="text-center text-white font-black text-2xl sm:text-3xl mb-8">
            Что подарить
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {options.map((o, i) => {
            const active = o.id === selected;
            return (
              <Reveal key={o.id} delay={i * 80}>
                <button
                  type="button"
                  onClick={() => choose(o.id)}
                  aria-pressed={active}
                  className={`w-full h-full text-left rounded-2xl p-5 sm:p-6 transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 shadow-[0_0_35px_rgba(59,130,246,0.3)] ring-1 ring-blue-400/50"
                      : "bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/40 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className={`font-black text-base sm:text-lg ${active ? "text-white" : "text-white"}`}>
                      {o.title}
                    </span>
                    {o.highlight && !active && (
                      <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 tracking-wider">
                        ЧАЩЕ ВСЕГО
                      </span>
                    )}
                    {active && (
                      <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white tracking-wider">
                        <Check size={11} /> ВЫБРАНО
                      </span>
                    )}
                  </div>
                  <p className={`text-sm leading-snug mb-4 ${active ? "text-white/85" : "text-gray-400"}`}>
                    {o.desc}
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={`text-2xl sm:text-3xl font-black ${
                        active
                          ? "text-white"
                          : "bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text"
                      }`}
                    >
                      {o.price ? `${formatPrice(o.price)} ₽` : "от 1 000 ₽"}
                    </span>
                    {!o.price && (
                      <span className={`text-xs ${active ? "text-white/70" : "text-gray-500"}`}>
                        сумму выбираете вы
                      </span>
                    )}
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

        {/* Заказ */}
        <div id="gift-order" className="scroll-mt-24">
          <Reveal>
            <div className="relative rounded-3xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-9 max-w-2xl mx-auto">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent rounded-t-3xl" />

              {sent ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={30} className="text-blue-400" />
                  </div>
                  <h3 className="text-white font-black text-2xl mb-2">Заявка принята</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Перезвоним в течение 30 минут, подтвердим детали и пришлём
                    сертификат картинкой — останется только переслать.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-white font-black text-xl sm:text-2xl mb-1">
                    Оформить сертификат
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Выбрано: <span className="text-blue-400 font-semibold">{option.title}</span>
                    {option.price ? ` — ${formatPrice(option.price)} ₽` : ""}
                  </p>

                  <form onSubmit={submit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">
                          Ваше имя <span className="text-gray-600">— необязательно</span>
                        </label>
                        <div className="relative">
                          <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => { reachGoalOnce("form_start"); setName(e.target.value); setError(""); }}
                            placeholder="Мария"
                            className="ym-disable-keys ym-hide-content w-full bg-white/[0.04] border border-white/[0.10] hover:border-blue-500/30 focus:border-blue-500/60 text-white placeholder-gray-600 rounded-xl py-3 pl-10 pr-4 outline-none transition-colors text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Телефон</label>
                        <div className="relative">
                          <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => { reachGoalOnce("form_start"); setPhone(formatPhone(e.target.value)); setError(""); }}
                            placeholder="+7 (000) 000-00-00"
                            className="ym-disable-keys ym-hide-content w-full bg-white/[0.04] border border-white/[0.10] hover:border-blue-500/30 focus:border-blue-500/60 text-white placeholder-gray-600 rounded-xl py-3 pl-10 pr-4 outline-none transition-colors text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        Кому дарите <span className="text-gray-600">— необязательно, впишем имя в сертификат</span>
                      </label>
                      <input
                        type="text"
                        value={to}
                        onChange={(e) => { setTo(e.target.value); setError(""); }}
                        placeholder="Артём"
                        className="ym-disable-keys ym-hide-content w-full bg-white/[0.04] border border-white/[0.10] hover:border-blue-500/30 focus:border-blue-500/60 text-white placeholder-gray-600 rounded-xl py-3 px-4 outline-none transition-colors text-sm"
                      />
                    </div>

                    <ConsentCheckbox id="consent-gift" checked={agreed} onChange={(v) => { setAgreed(v); setError(""); }} />

                    {error && <p className="text-red-400 text-xs">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : (
                        <>Заказать сертификат <ArrowRight size={17} /></>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>

        {/* Условия — сертификат юридически аванс, без этого спорить придётся «на словах» */}
        <Reveal delay={120}>
          <div className="max-w-2xl mx-auto mt-14 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
            <h2 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              Условия
            </h2>
            <ul className="space-y-2 text-gray-400 text-sm leading-relaxed list-disc pl-5">
              <li>Сертификат действует {validMonths} месяцев с даты покупки. Срок продлевается по звонку.</li>
              <li>Сертификат именной по желанию: имя получателя вписываем при оформлении.</li>
              <li>Передать сертификат другому человеку можно — сообщите нам об этом заранее.</li>
              <li>Сертификат обменивается на занятия, деньгами не возвращается.</li>
              <li>При утере восстановим по номеру — сохраните его или сообщите нам.</li>
              <li>Использовать можно частями, если номинал больше стоимости одного занятия.</li>
            </ul>
            <p className="text-gray-600 text-xs mt-4">
              Остальное — в{" "}
              <a href="/offer" className="underline underline-offset-2 hover:text-gray-400">публичной оферте</a>.
              Вопросы — по телефону 8 (995) 865-42-44.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
