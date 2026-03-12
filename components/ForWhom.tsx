"use client";

import { useState } from "react";
import { Shield, Zap, Heart } from "lucide-react";
import Reveal from "./Reveal";

const tabs = [
  {
    id: "adults",
    label: "Для взрослых",
    icon: <Shield size={18} />,
    items: [
      {
        num: "01",
        title: "Кто хочет защитить себя",
        desc: "Единоборства — это не только физическая подготовка, но и уверенность в своих силах. Научитесь защищаться и почувствуйте себя в безопасности.",
      },
      {
        num: "02",
        title: "Кто хочет снять стресс",
        desc: "Единоборства — отличный способ выплеснуть накопившуюся энергию и избавиться от стресса. Оставьте все заботы за пределами зала.",
      },
      {
        num: "03",
        title: "Кто хочет улучшить физическую форму",
        desc: "Регулярные тренировки помогут вам стать сильнее, выносливее и гибче. Единоборства — это комплексная работа над телом и здоровьем.",
      },
    ],
  },
  {
    id: "children",
    label: "Для детей",
    icon: <Zap size={18} />,
    items: [
      {
        num: "01",
        title: "Для малышей (3–5 лет)",
        desc: "Общая физическая подготовка, гимнастика и начальные элементы специальных упражнений в игровой форме.",
      },
      {
        num: "02",
        title: "Для подростков (6–14 лет)",
        desc: "Углублённые тренировки с специализированной подготовкой. Мотивационная система с браслетами и подарками в конце месяца.",
      },
      {
        num: "03",
        title: "Приложение для родителей",
        desc: "Родители могут следить за успехами своих детей через приложение и принимать активное участие в их воспитании.",
      },
    ],
  },
  {
    id: "family",
    label: "Для семьи",
    icon: <Heart size={18} />,
    items: [
      {
        num: "01",
        title: "Семейные тренировки",
        desc: "Специальные программы для всей семьи, чтобы заниматься спортом вместе, укрепляя связи и поддерживая друг друга.",
      },
      {
        num: "02",
        title: "Семейные скидки",
        desc: "Выгодные условия на покупку абонементов для всей семьи. Абонемент 5900₽ + 5000₽ за второго ребёнка.",
      },
      {
        num: "03",
        title: "Тренируйтесь все вместе",
        desc: "Можно приводить детей в разные группы и заниматься самому на третьем ковре — всё в одном месте!",
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
              {tab.label}
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
