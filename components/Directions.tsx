import Link from "next/link";
import Image from "next/image";
import directionsJson from "@/data/directions.json";
import Reveal from "./Reveal";

const directions = directionsJson;

const ACCENTS: Record<string, { from: string; to: string }> = {
  bjj:       { from: "#3b82f6", to: "#06b6d4" },
  mma:       { from: "#06b6d4", to: "#3b82f6" },
  boxing:    { from: "#60a5fa", to: "#3b82f6" },
  grappling: { from: "#3b82f6", to: "#38bdf8" },
  muaythai:  { from: "#f59e0b", to: "#ef4444" },
};

function DirectionCard({ d, i }: { d: (typeof directions)[0]; i: number }) {
  const accent = ACCENTS[d.slug] ?? { from: "#3b82f6", to: "#06b6d4" };

  return (
    <Reveal delay={i * 80}>
      {/* Вся карточка — ссылка */}
      <Link href={`/${d.slug}`} className="block">
        <div
          className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
          style={{ transform: "skewX(-6deg)" }}
        >
          {/* Акцентная линия сверху */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px] z-10"
            style={{ background: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }}
          />

          {/* Картинка */}
          <div className="relative overflow-hidden" style={{ paddingBottom: "120%" }}>
            {d.image ? (
              <Image
                src={d.image}
                alt={d.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
                style={{ transform: "skewX(6deg) scaleX(1.05)" }}
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(160deg, ${accent.from}55, ${accent.to}22)` }}
              />
            )}
            {/* Затемнение */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

            {/* Контент поверх картинки — контр-скошен */}
            <div
              className="absolute bottom-0 left-0 right-0 p-4 sm:p-5"
              style={{ transform: "skewX(6deg)" }}
            >
              <h3 className="text-white font-black text-sm sm:text-base lg:text-[15px] leading-tight mb-1.5 group-hover:text-blue-300 transition-colors duration-300 drop-shadow-lg">
                {d.title}
              </h3>
              <p className="text-gray-400 text-[11px] sm:text-xs leading-relaxed line-clamp-2 mb-2.5">
                {d.desc}
              </p>
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-all duration-300"
                style={{ color: accent.from }}
              >
                <span>Подробнее</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
              </span>
            </div>
          </div>

          {/* Граница */}
          <div className="absolute inset-0 border border-white/[0.08] group-hover:border-white/20 transition-colors duration-300 pointer-events-none" />

          {/* Нижняя акцентная линия при ховере */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }}
          />
        </div>
      </Link>
    </Reveal>
  );
}

export default function Directions() {
  return (
    <section id="directions" className="relative py-20 lg:py-28 bg-[#0d1525] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(59,130,246,0.07),transparent)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12">
          <span className="text-blue-500 text-xs font-medium uppercase tracking-widest">
            Дисциплины
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-2">
            Наши{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
              направления
            </span>
          </h2>
          <p className="mt-3 text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            Выбери свою боевую дисциплину и начни тренироваться сегодня
          </p>
        </Reveal>

        {/* px увеличен чтобы параллелограммы не вылезали за края */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-4">
          {directions.map((d, i) => (
            <DirectionCard key={d.slug} d={d} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
