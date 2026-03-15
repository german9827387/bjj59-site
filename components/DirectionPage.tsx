import { Check, ArrowLeft } from "lucide-react";
import Image from "next/image";
import CTA from "./CTA";
import Pricing from "./Pricing";
import Link from "next/link";
import Reveal from "./Reveal";

interface Reason {
  title: string;
  desc: string;
}

interface DirectionPageProps {
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  reasons: Reason[];
  emoji: string;
  image?: string;
  accent?: string;
}

const advantages = [
  "Профессиональный тренерский состав с педагогическим образованием",
  "Современные залы с качественным оборудованием",
  "Группы разного уровня подготовки — от новичка до профи",
  "Удобное расписание тренировок",
  "Возможность участия в соревнованиях",
  "Дружественная атмосфера и поддержка",
];

const stats = [
  { num: "14", label: "лет опыта" },
  { num: "500+", label: "учеников" },
];

export default function DirectionPage({
  title,
  subtitle,
  tagline,
  description,
  reasons,
  emoji,
  image,
  accent = "#3B82F6",
}: DirectionPageProps) {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Base background */}
        <div className="absolute inset-0 bg-[#0d1525]" />

        {/* Mobile: full-bg image */}
        {image && (
          <div className="absolute inset-0 lg:hidden">
            <Image src={image} alt={title} fill className="object-cover opacity-40" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0d1525]/60 via-[#0d1525]/55 to-[#0d1525]" />
          </div>
        )}

        {/* Desktop: image on right half */}
        {image && (
          <div className="absolute right-0 top-0 bottom-0 w-[55%] hidden lg:block">
            <Image src={image} alt={title} fill className="object-cover" sizes="55vw" priority />
            {/* Strong left fade */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1525] via-[#0d1525]/70 to-transparent" />
            {/* Bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1525] via-transparent to-[#0d1525]/40" />
          </div>
        )}

        {/* Accent glow */}
        <div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] opacity-[0.07] pointer-events-none"
          style={{ background: accent }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          {/* Back */}
          <div className="hero-fade mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
              На главную
            </Link>
          </div>

          <div className="max-w-xl lg:max-w-2xl">
            {/* Badge */}
            <div className="hero-fade inline-flex items-center gap-2 mb-6">
              <span
                className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] border"
                style={{ color: accent, borderColor: `${accent}50`, background: `${accent}12` }}
              >
                {subtitle}
              </span>
            </div>

            {/* Title */}
            <h1
              className="hero-slide text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-4 leading-[0.95] tracking-tight"
              style={{ animationDelay: "0.1s" }}
            >
              {title}
            </h1>

            {/* Tagline */}
            <p
              className="hero-fade text-[11px] font-bold uppercase tracking-[0.25em] mb-6"
              style={{ color: accent, animationDelay: "0.2s" }}
            >
              {tagline}
            </p>

            {/* Description */}
            <p
              className="hero-fade text-gray-300 text-base sm:text-lg leading-relaxed mb-10 max-w-lg"
              style={{ animationDelay: "0.3s" }}
            >
              {description}
            </p>

            {/* CTA button */}
            <a
              href={`https://t.me/GSAcademy59?text=${encodeURIComponent(`Здравствуйте! Пишу с сайта, интересует ${title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-fade inline-block font-black py-4 px-10 rounded-full text-base hover:opacity-90 transition-all hover:scale-[1.03] text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
                boxShadow: `0 8px 32px ${accent}40`,
                animationDelay: "0.4s",
              }}
            >
              Записаться на бесплатное занятие →
            </a>

            {/* Stats */}
            <div
              className="hero-fade mt-12 pt-8 border-t border-white/[0.08] flex gap-10"
              style={{ animationDelay: "0.6s" }}
            >
              {stats.map(({ num, label }) => (
                <div key={label}>
                  <div className="text-3xl font-black" style={{ color: accent }}>{num}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reasons */}
      <section className="py-20 bg-[#060606]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Reveal>
              <span
                className="text-xs font-bold uppercase tracking-[0.25em]"
                style={{ color: accent }}
              >
                Почему стоит начать
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
                Почему выбирают{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(90deg, ${accent}, ${accent}88)` }}
                >
                  {title.toLowerCase()}?
                </span>
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {reasons.map((r, i) => (
              <Reveal
                key={r.title}
                delay={i * 80}
                className="relative bg-[#0f1e35] border border-[#1e2d45] rounded-2xl p-6 group hover:border-opacity-50 transition-all duration-300"
              >
                {/* Top accent line on hover */}
                <div
                  className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                />
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 text-sm font-black"
                  style={{ background: `${accent}15`, color: accent }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-white font-bold mb-2 text-sm">{r.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How training works */}
      <section className="py-20 bg-[#0d1525]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <Reveal>
              <span
                className="text-xs font-bold uppercase tracking-[0.25em]"
                style={{ color: accent }}
              >
                Как проходят тренировки
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-6">
                Занятия для{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(90deg, ${accent}, ${accent}88)` }}
                >
                  всех уровней
                </span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Наши тренеры обладают многолетним опытом и проводят занятия для всех уровней подготовки — от новичков до профессионалов.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Мы создаём дружественную атмосферу, где каждый ученик получает индивидуальное внимание и поддержку. Если у вас уже есть опыт, мы предлагаем группы и индивидуальные тренировки для совершенствования навыков.
              </p>
            </Reveal>

            {/* Advantages list */}
            <Reveal className="space-y-3">
              {advantages.map((adv) => (
                <div
                  key={adv}
                  className="flex items-start gap-3 bg-[#0f1e35] border border-[#1e2d45] rounded-xl p-4 group hover:border-opacity-40 transition-all"
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${accent}20` }}
                  >
                    <Check size={11} style={{ color: accent }} />
                  </div>
                  <span className="text-gray-300 text-sm">{adv}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <Pricing />
      <CTA />
    </>
  );
}
