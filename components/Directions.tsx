import Link from "next/link";
import Image from "next/image";
import directionsJson from "@/data/directions.json";
import Reveal from "./Reveal";

const directions = directionsJson;
const HEX = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const ACCENTS: Record<string, string> = {
  bjj: "#3b82f6",
  mma: "#06b6d4",
  boxing: "#818cf8",
  grappling: "#6366f1",
};

function HexCard({ d, i }: { d: (typeof directions)[0]; i: number }) {
  const accent = ACCENTS[d.slug] ?? "#3b82f6";
  return (
    <Reveal delay={i * 80} className="relative w-full" style={{ paddingTop: "115.47%" }}>
      <Link href={`/${d.slug}`} className="absolute inset-0 group">
        {/* Glow ring */}
        <div
          className="absolute inset-0 transition-opacity duration-500 opacity-40 group-hover:opacity-90"
          style={{
            clipPath: HEX,
            background: `linear-gradient(135deg, ${accent}ee, ${accent}33)`,
            filter: "blur(8px)",
            transform: "scale(1.07)",
          }}
        />
        {/* Hex body */}
        <div className="absolute inset-[3px] overflow-hidden" style={{ clipPath: HEX }}>
          <div className="absolute inset-0 bg-[#080808]" />
          {d.image ? (
            <Image
              src={d.image}
              alt={d.title}
              fill
              className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
              sizes="(max-width: 768px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <>
              <div
                className="absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at 50% 85%, ${accent}66 0%, ${accent}11 55%, transparent 75%)` }}
              />
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: "repeating-linear-gradient(-45deg,#fff 0,#fff 1px,transparent 0,transparent 8px)" }}
              />
            </>
          )}
          {/* Dark vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.6)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
          {/* Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span
              className="text-white font-black text-base sm:text-xl lg:text-2xl uppercase tracking-wide leading-tight drop-shadow-[0_2px_20px_rgba(0,0,0,1)]"
            >
              {d.title}
            </span>
            <span
              className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
              style={{ color: accent }}
            >
              Подробнее
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export default function Directions() {
  const top = directions.slice(0, 3);
  const bottom = directions.slice(3);

  return (
    <section id="directions" className="py-20 lg:py-28 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-4">
        <Reveal className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
            {"Наши"} <span className="text-[#3b82f6]">{"направления"}</span>
          </h2>
          <p className="mt-3 text-white/50 text-base sm:text-lg max-w-xl mx-auto">
            {"Выбери свою боевую дисциплину и начни тренироваться сегодня"}
          </p>
        </Reveal>

        {/* Desktop honeycomb */}
        <div className="hidden md:block">
          <div className="grid grid-cols-3 gap-6">
            {top.map((d, i) => (
              <HexCard key={d.slug} d={d} i={i} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-6 -mt-[9%]">
            <div />
            {bottom.map((d, i) => (
              <HexCard key={d.slug} d={d} i={i + 3} />
            ))}
            <div />
          </div>
        </div>

        {/* Mobile 2-col grid */}
        <div className="md:hidden grid grid-cols-2 gap-4">
          {directions.map((d, i) => (
            <HexCard key={d.slug} d={d} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
