"use client";

import { Star, Check } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import settingsJson from "@/data/settings.json";
import LeadModal from "./LeadModal";

const TG_URL = `https://t.me/GSAcademy59?text=${encodeURIComponent('Здравствуйте! Пишу с сайта, хочу записаться на пробное занятие')}`;
const MAX_URL = "https://max.ru/u/f9LHodD0cOLuAXIcg9-hGCKGfQUdnBrwUFaDAOL8u57Ecr8xdBN439inrnY";

const { hero } = settingsJson;

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(String(target));

  useEffect(() => {
    setDisplay("0");
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = Date.now();
      const duration = 1800;
      const tick = () => {
        const t = Math.min((Date.now() - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(eased * target).toString());
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { rootMargin: "0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref} suppressHydrationWarning>{display}{suffix}</span>;
}

// Классы перечислены явными строками: Tailwind вырезает те, что собраны
// динамически, и сетка молча развалилась бы.
const STAT_GRID: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

export default function Hero() {
  /**
   * «Часть команды Alliance · 16-кратные чемпионы мира» → жетон и две строки.
   * Разделитель и число берутся из самой подписи, поэтому её можно править в
   * админке, не трогая вёрстку.
   */
  const badgeParts = (() => {
    const [team, title] = (hero.badge ?? "").split("·").map((x) => x.trim());
    const count = title?.match(/\d+/)?.[0];
    return team && title && count ? { team, title, count } : null;
  })();

  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const src = isMobile ? "/hero-mobile.mp4" : "/hero-compressed1.mp4";
    const id = setTimeout(() => setVideoSrc(src), 200);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoSrc) return;
    el.src = videoSrc;
    el.load();
    el.play().catch(() => {});
  }, [videoSrc]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0d1525]">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster="/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        {/* Mesh gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.18),transparent)]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Vertical accent lines */}
      <div className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" style={{ left: "10%" }} />
      <div className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" style={{ left: "90%" }} />

      <div className="relative z-10 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left pt-14 sm:pt-20 lg:pt-24 pb-28 sm:pb-0">
        {/* Знак вместо пилюли — ровно как в утверждённом макете.

            Две ячейки в общей рамке: слева число, справа две строки. Раньше
            главный козырь был длинной строкой мелким шрифтом и читался как
            служебная подпись; теперь «16» видно раньше, чем прочитан текст.

            Разбор строки, а не два новых поля в настройках: подпись остаётся
            одна, и админка не обрастает полями, которые надо держать
            согласованными. Не разобралась — показываем как было. */}
        {badgeParts ? (
          <div className="hero-fade order-1 self-start inline-flex items-stretch rounded-md border border-[rgba(148,178,222,0.18)] bg-[rgba(9,13,22,0.55)] overflow-hidden mb-6 sm:mb-0">
            <div className="flex flex-col items-center justify-center px-4 py-3 bg-blue-500/[0.12] border-r border-[rgba(148,178,222,0.14)]">
              <span className="text-[#9CC4FF] text-2xl font-extrabold leading-none tracking-[-0.03em]">{badgeParts.count}</span>
              <span className="text-[#6E86A8] text-[8px] tracking-[0.14em] mt-[3px]">ТИТУЛОВ</span>
            </div>
            <div className="flex flex-col justify-center px-[18px] py-3 text-left">
              <span className="text-white text-[13.5px] font-semibold leading-tight">{badgeParts.team}</span>
              <span className="text-[#7E8CA0] text-[11.5px] leading-tight mt-[2px]">{badgeParts.title}</span>
            </div>
          </div>
        ) : (
          <div className="hero-fade self-start inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-md px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300 text-xs font-semibold uppercase tracking-widest">{hero.badge}</span>
          </div>
        )}

        {/* Main heading */}
        <h1
          className="hero-slide order-2 text-[38px] sm:text-[52px] lg:text-[66px] font-extrabold sm:font-bold text-white leading-[1.05] sm:leading-[1.04] tracking-[-0.032em] sm:tracking-[-0.035em] mt-[14px] sm:mt-[26px] mb-0 sm:max-w-[15ch]"
        >
          {hero.title1}
          <br />
          <span className="text-[#6E7F97]">{hero.title2}</span>
        </h1>

        {/* Hook line */}
        <p
          className="hero-fade order-3 text-sm sm:text-lg text-[#C6D2E2] mt-2.5 sm:mt-[14px] mb-0 tracking-normal font-normal"
          style={{ animationDelay: "0.2s" }}
        >
          {hero.title3}
        </p>

        {/* Подзаголовок — необязательный: если пуст, место занимает оферта */}
        {hero.subtitle && (
          <p
            className="hero-fade text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto sm:mx-0 mb-5 leading-relaxed"
            style={{ animationDelay: "0.35s" }}
          >
            {hero.subtitle}
          </p>
        )}

        {/* Оферта: что человек получает, если придёт. Первый пункт — главный,
            поэтому он ярче остальных. */}
        {/* Оферта: то, что кнопка не повторяет. «Первая тренировка
            бесплатно» отсюда убрана — ровно это написано на кнопке ниже. */}
        <ul
          className="hero-fade order-5 sm:order-4 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-start gap-x-3 gap-y-1.5 mt-4 sm:mt-[26px] mb-0 w-fit sm:w-auto"
          style={{ animationDelay: "0.35s" }}
        >
          {hero.offer.map((item, i) => (
            <li key={item} className="flex items-center gap-3 text-[#93A2B8] text-[13.5px]">
              {i > 0 && <span className="hidden sm:inline text-[#2A3448]">·</span>}
              {item}
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="hero-fade order-6 sm:order-5 flex flex-col items-stretch sm:items-start gap-3 sm:gap-4 mt-5 sm:mt-[30px]" style={{ animationDelay: "0.5s" }}>
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start items-center">
          <button
            onClick={() => setModalOpen(true)}
            className="group relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-4 px-8 rounded-md text-[15px] hover:opacity-90 transition-all shadow-2xl shadow-blue-500/30"
          >
            <span className="relative z-10">{hero.ctaPrimary}</span>
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10" />
          </button>
          <div className="flex gap-2">
            <a
              href={TG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-[rgba(148,178,222,0.22)] text-[#DCE5F0] font-medium py-4 px-[22px] rounded-md text-sm hover:bg-white/[0.06] hover:border-[rgba(148,178,222,0.4)] transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#229ED9] shrink-0">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Telegram
            </a>
            <a
              href={MAX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-[rgba(148,178,222,0.22)] text-[#DCE5F0] font-medium py-4 px-[22px] rounded-md text-sm hover:bg-white/[0.06] hover:border-[rgba(148,178,222,0.4)] transition-all"
            >
              <span className="w-[18px] h-[18px] rounded-full bg-[#168ACD] flex items-center justify-center shrink-0">
                <span className="text-white text-[9px] font-bold leading-none">M</span>
              </span>
              MAX
            </a>
          </div>
          </div>
        </div>

        {/* Stats */}
        {/* На телефоне цифры встают перед кнопкой: на коротком экране они
            иначе оказывались за краем, и человек принимал решение, не увидев
            ни одного доказательства. На десктопе порядок прежний. */}
        <div className={`hero-fade order-4 sm:order-6 grid grid-cols-2 gap-2 sm:flex sm:gap-0 sm:border-t sm:border-white/10 sm:pt-5 mt-[18px] sm:mt-14 mb-0 w-full sm:max-w-none`} style={{ animationDelay: "0.7s" }}>
          {/* Оценка — первая ячейка ленты, как в макете. На телефоне лента
              превращается в плашки, и оценка уходит отдельной строкой ниже. */}
          <div className="flex items-baseline gap-2 rounded-md bg-[rgba(9,13,22,0.68)] border border-[rgba(148,178,222,0.13)] px-[13px] py-[11px] sm:items-center sm:gap-2.5 sm:rounded-none sm:bg-transparent sm:border-0 sm:p-0 sm:pr-7 sm:border-r sm:border-white/10">
            <span className="text-white text-[19px] sm:text-[22px] font-bold tracking-[-0.02em] leading-none">5.0</span>
            <span className="text-[#7E8CA0] sm:text-[#5D6B80] text-[10.5px] sm:text-[11.5px] leading-[1.35] text-left">оценка<span className="hidden sm:inline"><br />Google · Яндекс · 2ГИС</span></span>
          </div>
          {hero.stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex items-baseline gap-2 rounded-md bg-[rgba(9,13,22,0.68)] border border-[rgba(148,178,222,0.13)] px-[13px] py-[11px] sm:gap-2 sm:px-7 sm:py-0 sm:rounded-none sm:bg-transparent sm:border-0 sm:border-r sm:border-white/10 sm:last:border-r-0 sm:last:pr-0"
            >
              <div className="text-[19px] sm:text-[22px] font-bold text-white tracking-[-0.02em] leading-none">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              </div>
              <div className="text-[#7E8CA0] text-[10.5px] sm:text-[12px] normal-case tracking-normal lowercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Smooth fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(13,21,37,0.7) 60%, #0d1525 85%, #0d1525 100%)" }}
      />
      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
