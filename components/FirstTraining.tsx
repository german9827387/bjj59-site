import Reveal from "./Reveal";

const items = [
  {
    emoji: "👕",
    label: "Футболка",
    desc: "Спортивная, удобная",
    color: "from-blue-500/20 to-blue-600/5",
    glow: "rgba(59,130,246,0.3)",
  },
  {
    emoji: "🩳",
    label: "Шорты",
    desc: "Свободные, лёгкие",
    color: "from-cyan-500/20 to-cyan-600/5",
    glow: "rgba(6,182,212,0.3)",
  },
  {
    emoji: "🩴",
    label: "Сланцы",
    desc: "Для душевой",
    color: "from-indigo-500/20 to-indigo-600/5",
    glow: "rgba(99,102,241,0.3)",
  },
  {
    emoji: "💧",
    label: "Вода",
    desc: "0.5–1 литр",
    color: "from-sky-500/20 to-sky-600/5",
    glow: "rgba(14,165,233,0.3)",
  },
];

export default function FirstTraining() {
  return (
    <section className="relative bg-[#0d1525] py-20 lg:py-28 overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[#0a0a0a] pointer-events-none" />
      {/* Фоновое свечение */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_70%_50%,rgba(59,130,246,0.08),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_20%_50%,rgba(99,102,241,0.05),transparent)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <Reveal>
            <span className="inline-block text-[#3B82F6] text-xs font-semibold uppercase tracking-widest border border-blue-500/20 bg-blue-500/5 rounded-full px-4 py-1.5 mb-5">
              Готовься просто
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-5 leading-tight">
              Что взять на{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                первую тренировку
              </span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8 text-lg">
              Для первого пробного занятия не нужна специальная экипировка. Просто приходите
              в удобной спортивной одежде — всё остальное мы предоставим.{" "}
              <span className="text-white font-semibold">Экипировка на первый урок в подарок!</span>
            </p>
            <a
              href={`https://t.me/GSAcademy59?text=${encodeURIComponent('Здравствуйте! Пишу с сайта, хочу прийти на первое бесплатное занятие')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-4 px-10 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 hover:scale-105 hover:from-blue-500 hover:to-cyan-400 active:scale-95 text-base"
            >
              Записаться бесплатно
            </a>
          </Reveal>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-4">
            {items.map((item, i) => (
              <Reveal key={item.label} delay={i * 80}>
                <div className="group relative rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/[0.15] transition-all duration-300 cursor-default">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
                  <div className="absolute inset-0 bg-[#0a1020]/70" />
                  <div className="relative p-7 flex flex-col items-center gap-3">
                    <div
                      className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full blur-2xl opacity-60 group-hover:opacity-90 transition-opacity"
                      style={{ background: item.glow }}
                    />
                    <div className="relative text-6xl leading-none select-none group-hover:scale-110 transition-transform duration-300">
                      {item.emoji}
                    </div>
                    <div className="relative text-center">
                      <div className="text-white font-black text-lg uppercase tracking-wide">{item.label}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
