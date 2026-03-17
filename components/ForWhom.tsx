"use client";

import { useState } from "react";
import { Shield, Zap, Heart } from "lucide-react";
import Reveal from "./Reveal";

type TabItem = { num: string; title: string; desc: string };
type Tab = { id: string; label: string; sublabel?: string; icon: React.ReactNode; items: TabItem[]; faq?: { q: string; a: string }[] };

const tabs: Tab[] = [
  {
    id: "adults",
    label: "Для взрослых",
    icon: <Shield size={18} />,
    items: [
      {
        num: "01",
        title: "Здоровая спина и суставы",
        desc: "Целый день за компьютером? Разомни спину и суставы, снимай зажимы. Уходишь бодрым, а не «разбитым».",
      },
      {
        num: "02",
        title: "Перезагрузка головы за 1 час",
        desc: "Устал от дедлайнов и напряжения? На ковре забудешь о проблемах — лучше, чем отпуск.",
      },
      {
        num: "03",
        title: "Сжечь жир и подтянуть тело",
        desc: "Подтянуть мышцы и сжечь лишний жир без скучных тренажёров и беговой дорожки.",
      },
    ],
  },
  {
    id: "children",
    label: "Для детей",
    sublabel: "с 3 лет",
    icon: <Zap size={18} />,
    items: [
      {
        num: "01",
        title: "Меньше гаджетов — больше развития",
        desc: "Дети меньше сидят за планшетом, больше двигаются и развивают внимание, координацию и ловкость через игры и единоборства.",
      },
      {
        num: "02",
        title: "Родители спокойны, дети в безопасности",
        desc: "Мягкое покрытие, защита на тренировках и тренер рядом на каждом занятии. Ни одной серьёзной травмы за всё время работы.",
      },
      {
        num: "03",
        title: "Сильное тело — здоровый ребёнок",
        desc: "Через игровые упражнения и единоборства ребёнок укрепляет мышцы, осанку и выносливость, становится активным и уверенным.",
      },
    ],
    faq: [
      { q: "С какого возраста берёте?", a: "Принимаем детей с 3 лет. Группы делим по возрасту: 3–5, 6–12 и 13+ — чтобы все занимались в комфортном темпе." },
      { q: "Не покалечат?", a: "Первые месяцы — только техника без контакта. Вводим спарринги постепенно, когда ребёнок готов. Всё под строгим контролем тренера." },
      { q: "Нужна физподготовка?", a: "Нет. Берём с нуля, подстраиваемся под уровень каждого ребёнка. Уже через месяц увидите прогресс." },
    ],
  },
  {
    id: "family",
    label: "Для семьи",
    icon: <Heart size={18} />,
    items: [
      {
        num: "01",
        title: "Папа — пример, а не зритель",
        desc: "Не нужно быть в форме, чтобы начать. Тренируетесь вместе с нуля — и ребёнок видит не живот, а характер отца, который не боится меняться.",
      },
      {
        num: "02",
        title: "Семейная цена, не как ипотека",
        desc: "Специальные условия для семей: папа + ребёнок без переплат за двойной абонемент. Один зал, один тренер, одна разумная цена.",
      },
      {
        num: "03",
        title: "Расписание под вашу жизнь",
        desc: "Работа, школа, кружки — мы знаем, как это устроено. Гибкое расписание и разные группы в одном зале: каждый занимается в удобное время.",
      },
    ],
  },
];

export default function ForWhom() {
  const [active, setActive] = useState("children");
  const activeTab = tabs.find((t) => t.id === active)!;

  return (
    <section className="relative py-20 lg:py-28 bg-[#0d1525]">
      {/* Gradient transition from Hero */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#080d14] to-transparent pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(59,130,246,0.10),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_100%,rgba(6,182,212,0.07),transparent)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Reveal>
            <span className="inline-block text-[#3B82F6] text-xs font-semibold uppercase tracking-widest border border-blue-500/20 bg-blue-500/5 rounded-full px-4 py-1.5 mb-4">
              Для кого
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">
              Тренировки для{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                каждого
              </span>
            </h2>
            <p className="mt-3 text-gray-400 text-base max-w-md mx-auto">
              Подберём программу под любой возраст и уровень подготовки
            </p>
          </Reveal>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${
                active === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                  : "border border-white/10 text-gray-400 hover:border-blue-500/40 hover:text-blue-400 bg-white/[0.03]"
              }`}
            >
              {tab.icon}
              <span className="flex flex-col items-start leading-none">
                <span>{tab.label}</span>
                {tab.sublabel && (
                  <span className="text-[10px] font-normal opacity-70 mt-0.5">{tab.sublabel}</span>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Cards */}
        <div key={active} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeTab.items.map((item, i) => (
            <div
              key={item.num}
              className="tab-fade group relative rounded-2xl overflow-hidden"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Glassmorphism background */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 50%, rgba(59,130,246,0.12) 100%)" }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.13) 0%, rgba(6,182,212,0.15) 100%)" }}
              />
              {/* Border */}
              <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12), inset 0 0 0 1px rgba(59,130,246,0.15)" }} />

              <div className="relative z-10 p-6">
                {/* Icon badge */}
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-5"
                  style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(6,182,212,0.15))", border: "1px solid rgba(59,130,246,0.35)" }}
                >
                  <span className="text-blue-300 font-black text-sm">{item.num}</span>
                </div>

                <h3 className="text-white font-bold text-lg mb-3 leading-tight">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>

                {/* Bottom accent line */}
                <div className="mt-6 h-px bg-gradient-to-r from-blue-400/50 via-cyan-400/30 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#0a0a0a] pointer-events-none" />
    </section>
  );
}
