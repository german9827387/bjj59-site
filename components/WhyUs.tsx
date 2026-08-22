import { Trophy, Users, GraduationCap, BookOpen } from "lucide-react";
import Reveal from "./Reveal";

const reasons = [
  {
    icon: Trophy,
    color: "#3b82f6",
    title: "Тренеры и ученики — чемпионы",
    desc: "Часть команды Alliance, 16-кратные чемпионы мира. Тренируются чемпионы и призёры мирового и европейского уровня.",
  },
  {
    icon: Users,
    color: "#06b6d4",
    title: "Семейная атмосфера",
    desc: "Атмосфера взаимопонимания и поддержки. Здесь легко начать и получать удовольствие от тренировок.",
  },
  {
    icon: GraduationCap,
    color: "#0ea5e9",
    title: "Квалифицированные тренеры",
    desc: "Все тренеры имеют педагогическое образование. Обучают технике, тактике и развивают личностные качества.",
  },
  {
    icon: BookOpen,
    color: "#38bdf8",
    title: "Прописанные методики",
    desc: "Специальные программы обучения для каждого уровня. От новичка до чемпиона — чёткий путь развития.",
  },
];

export default function WhyUs() {
  return (
    <section className="relative py-16 lg:py-24 bg-[#0d1525] overflow-hidden">
      {/* Top transition from ForWhom */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none" />

      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-blue-600/8 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Reveal>
            <span className="inline-block text-cyan-400 text-xs font-semibold uppercase tracking-widest border border-cyan-500/25 bg-cyan-500/8 rounded-full px-4 py-1.5 mb-4">
              Почему выбирают нас
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">
              Место, куда хочется{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 text-transparent bg-clip-text">
                возвращаться
              </span>
            </h2>
            <p className="text-blue-200/40 mt-4 max-w-xl mx-auto text-base">
              Академия, где спорт помогает развивать не только тело, но и личность
            </p>
          </Reveal>
        </div>

        {/* Feature rows — open divider style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y divide-white/6 sm:divide-y-0 sm:divide-x sm:divide-white/6">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <Reveal key={r.title} delay={i * 90}>
                <div className="group relative px-6 py-8 sm:py-10 overflow-hidden">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${r.color}30, ${r.color}12)`,
                      border: `1px solid ${r.color}45`,
                      boxShadow: `0 0 20px ${r.color}15`,
                    }}
                  >
                    <Icon size={24} style={{ color: r.color }} />
                  </div>

                  <h3 className="text-white font-extrabold text-base mb-3 leading-tight">{r.title}</h3>
                  <p className="text-blue-100/40 text-sm leading-relaxed">{r.desc}</p>

                  {/* Expanding bottom bar */}
                  <div
                    className="mt-6 h-[2px] w-10 rounded-full transition-all duration-500 group-hover:w-24"
                    style={{ background: `linear-gradient(to right, ${r.color}, ${r.color}30)` }}
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Bottom transition to Directions */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent to-[#0a0a0a] pointer-events-none" />
    </section>
  );
}
