"use client";

import { m as motion } from "framer-motion";
import { Trophy, Users, GraduationCap, BookOpen } from "lucide-react";

const reasons = [
  {
    icon: Trophy,
    color: "#3b82f6",
    title: "Тренеры и ученики — чемпионы",
    desc: "Часть команды Alliance, 14-кратные чемпионы мира. Тренируются чемпионы и призёры мирового и европейского уровня.",
  },
  {
    icon: Users,
    color: "#06b6d4",
    title: "Семейная атмосфера",
    desc: "Атмосфера взаимопонимания и поддержки. Здесь легко начать и получать удовольствие от тренировок.",
  },
  {
    icon: GraduationCap,
    color: "#818cf8",
    title: "Квалифицированные тренеры",
    desc: "Все тренеры имеют педагогическое образование. Обучают технике, тактике и развивают личностные качества.",
  },
  {
    icon: BookOpen,
    color: "#22d3ee",
    title: "Прописанные методики",
    desc: "Специальные программы обучения для каждого уровня. От новичка до чемпиона — чёткий путь развития.",
  },
];

export default function WhyUs() {
  return (
    <section className="relative py-16 lg:py-24 bg-[#060d1f] overflow-hidden">
      {/* Top transition from ForWhom */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none" />

      {/* Background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(#60a5fa 1px, transparent 1px), linear-gradient(90deg, #60a5fa 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-cyan-400 text-xs font-semibold uppercase tracking-widest border border-cyan-500/25 bg-cyan-500/8 rounded-full px-4 py-1.5 mb-4"
          >
            Почему выбирают нас
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-white mt-2"
          >
            Место, куда хочется{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 text-transparent bg-clip-text">
              возвращаться
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-blue-200/40 mt-4 max-w-xl mx-auto text-base"
          >
            Мы — первая академия в Перми, где спорт помогает развивать не только тело, но и личность
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-2xl overflow-hidden"
              >
                {/* Card background */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{ background: `linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 50%, ${r.color}18 100%)` }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(145deg, rgba(255,255,255,0.13) 0%, ${r.color}22 100%)` }}
                />
                {/* Border */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{ boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.12), inset 0 0 0 1px ${r.color}20` }}
                />

                <div className="relative z-10 p-6">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${r.color}30, ${r.color}15)`, border: `1px solid ${r.color}40` }}
                  >
                    <Icon size={22} style={{ color: r.color }} />
                  </div>

                  <h3 className="text-white font-bold text-base mb-3 leading-tight">{r.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{r.desc}</p>

                  {/* Bottom accent */}
                  <div className="mt-5 h-px" style={{ background: `linear-gradient(to right, ${r.color}60, transparent)` }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom transition to Directions */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent to-[#0a0a0a] pointer-events-none" />
    </section>
  );
}
