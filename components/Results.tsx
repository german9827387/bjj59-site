"use client";

import { Trophy, Medal, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");
  useEffect(() => {
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
  return <span ref={ref}>{display}{suffix}</span>;
}

const stats = [
  { icon: Trophy, target: 100, suffix: "+", label: "Золотых медалей" },
  { icon: Medal, target: 300, suffix: "+", label: "Наград всего" },
];

const hallOfFame = [
  { src: "/result1.jpg",   name: "Шестериков Герман",  event: "Чемпионат мира AJP",                        medal: "gold",   rotate: "-2deg",   objPos: "center top", ratio: "1/1"  },
  { src: "/result2.jpg",   name: "Амазарян Тигран",    event: "Чемпионат мира ACB",                        medal: "gold",   rotate: "1.5deg",  objPos: "center 20%", ratio: "9/16" },
  { src: "/result3.jpg",   name: "Коломыцев Данил",    event: "Чемпионат мира AJP",                        medal: "silver", rotate: "-1deg",   objPos: "center 30%", ratio: "3/4"  },
  { src: "/result4.jpg",   name: "Шестериков Герман",  event: "Чемпионат России AJP",                      medal: "gold",   rotate: "2.5deg",  objPos: "center top", ratio: "1/1"  },
  { src: "/result5.jpg",   name: "Gymnasium Cup",      event: "Общее фото",                             medal: null,     rotate: "-1.5deg", objPos: "center top", ratio: "4/3"  },
  { src: "/result6.jpg",   name: "Шестериков Артём",   event: "RCC JJ Open Mat",                           medal: "gold",   rotate: "1deg",    objPos: "center 30%", ratio: "3/4"  },
  { src: "/result7.jpg",   name: "Gymnasium Cup",      event: "Общее фото",                             medal: null,     rotate: "-2.5deg", objPos: "center top", ratio: "4/3"  },
  { src: "/results8.jpg",  name: "Прилипко Илья",      event: "Чемпионат России AJP 2019",                 medal: "gold",   rotate: "2deg",    objPos: "center top", ratio: "2/3"  },
  { src: "/results9.jpg",  name: "Прилипко Илья",      event: "Чемпионат России AJP 2026",                 medal: "bronze", rotate: "-1.5deg", objPos: "center top", ratio: "3/2"  },
  { src: "/results10.jpg", name: "Прилипко Илья",      event: "Ural Grapplers Pro 2025",                   medal: "bronze", rotate: "1.5deg",  objPos: "center top", ratio: "3/2"  },
  { src: "/results11.jpg", name: "Прилипко Илья",      event: "ACBJJ Northwest Russian Championship 2025", medal: null,     rotate: "-2deg",   objPos: "center top", ratio: "9/16" },
  { src: "/results12.jpg", name: "Прилипко Илья",      event: "Чемпионат России AJP 2021",                 medal: "gold",   rotate: "1.5deg",  objPos: "center top", ratio: "3/2"  },
  { src: "/results13.jpg", name: "Шестериков Герман",  event: "Всероссийский турнир Blood and Sweat",       medal: "gold",   rotate: "-1.5deg", objPos: "center top", ratio: "3/4"  },
  { src: "/result14.jpg",  name: "RCC JJ Open Mat",    event: "Общее фото",                                medal: null,     rotate: "2deg",    objPos: "center top", ratio: "16/10" },
  { src: "/results16.jpg", name: "Хайкис Александр",   event: "Чемпионат мира ACBJJ",                      medal: "gold",   rotate: "-1deg",   objPos: "center top", ratio: "1/1"  },
  { src: "/results17.jpg", name: "Корляков Илья",      event: "AJP Tour Northwest Russia",                 medal: "gold",   rotate: "1.5deg",  objPos: "center top", ratio: "1/1"  },
  { src: "/results18.jpg", name: "Баранов Максим",     event: "RCC JJ Open Mat",                           medal: "gold",   rotate: "-2deg",   objPos: "center top", ratio: "1/1"  },
  { src: "/results19.jpg", name: "Баранов Максим",     event: "Профессиональный турнир по ММА",             medal: "gold",   rotate: "2.5deg",  objPos: "center top", ratio: "1/1"  },
  { src: "/results20.jpg", name: "Баранов Максим",     event: "Турнир по боксу",                           medal: "gold",   rotate: "-1.5deg", objPos: "center top", ratio: "1/1"  },
  { src: "/results21.jpg", name: "Куликов Юрий",       event: "Чемпионат мира ACB",                        medal: "silver", rotate: "1deg",    objPos: "center bottom", ratio: "1/1"  },
  { src: "/results22.jpg", name: "Куликов Юрий",       event: "RCC JJ Open Mat",                           medal: "gold",   rotate: "-2.5deg", objPos: "center top", ratio: "1/1"  },
  { src: "/results23.jpg", name: "Чибисов Богдан",     event: "RCC JJ Open Mat",                           medal: "gold",   rotate: "2deg",    objPos: "center top", ratio: "1/1"  },
  { src: "/results24.jpg", name: "Самсонов Никита",    event: "RCC Open Mat",                              medal: "gold",   rotate: "-1deg",   objPos: "center bottom", ratio: "1/1"  },
  { src: "/results25.jpg", name: "Измайлов Никита",    event: "RCC JJ Open Mat",                           medal: "gold",   rotate: "1.5deg",  objPos: "center top", ratio: "1/1"  },
  { src: "/results26.jpg", name: "Щербаков Дмитрий",   event: "Чемпионат России AJP",                      medal: "bronze", rotate: "-2deg",   objPos: "center top", ratio: "1/1"  },
  { src: "/results27.jpg", name: "Щербаков Дмитрий",   event: "Чемпионат России AJP",                      medal: "bronze", rotate: "2.5deg",  objPos: "center top", ratio: "1/1"  },
  { src: "/results28.jpg", name: "Хайкис Александр",   event: "Чемпионат ПФО по грэпплингу",               medal: "gold",   rotate: "-1.5deg", objPos: "center top", ratio: "1/1"  },
  { src: "/results15.jpg", name: "Хайкис Александр",   event: "Чемпионат России ACB",                      medal: "gold",   rotate: "1deg",    objPos: "center top", ratio: "1/1"  },
];

const MEDAL_STYLES = {
  gold:   { label: "🥇 Золото",  glow: "#f59e0b", border: "#f59e0b60" },
  silver: { label: "🥈 Серебро", glow: "#94a3b8", border: "#94a3b860" },
  bronze: { label: "🥉 Бронза",  glow: "#b45309", border: "#b4530960" },
};

export default function Results() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  return (
    <section className="relative py-16 lg:py-24 bg-[#0d1525] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(59,130,246,0.10),transparent)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Заголовок */}
        <div className="text-center mb-12">
          <Reveal>
            <span className="text-blue-500 text-xs font-medium uppercase tracking-widest">
              Соревнования
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Зал{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                Славы
              </span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm">
              Наши ученики выступают на региональных, всероссийских и мировых турнирах и регулярно поднимаются на пьедестал
            </p>
          </Reveal>
        </div>

        {/* Статы */}
        <Reveal className="grid grid-cols-2 gap-4 mb-14 max-w-sm mx-auto">
          {stats.map(({ icon: Icon, target, suffix, label }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]"
            >
              <Icon className="w-5 h-5 text-blue-400 mb-2" />
              <span className="text-2xl sm:text-3xl font-black text-white">
                <AnimatedCounter target={target} suffix={suffix} />
              </span>
              <span className="text-gray-400 text-xs mt-1 leading-tight">{label}</span>
            </div>
          ))}
        </Reveal>

        {/* Зал Славы — горизонтальный скролл */}
        <Reveal>
          {/* Подсказка скролла */}
          <div className="flex items-center justify-between mb-5 px-1">
            <p className="text-blue-400/60 text-xs font-medium flex items-center gap-1.5">
              <ChevronLeft size={13} className="animate-pulse" />
              листай
              <ChevronRight size={13} className="animate-pulse" />
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-blue-500/40 transition-all"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-blue-500/40 transition-all"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Полоса с фейдом по краям */}
          <div className="relative">
            {/* Левый фейд */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0d1525] to-transparent z-10 pointer-events-none" />
            {/* Правый фейд */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0d1525] to-transparent z-10 pointer-events-none" />

            {/* Скролл-контейнер */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-8 pt-6 px-4 scrollbar-hide overscroll-x-contain"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {hallOfFame.map((item, i) => {
                const medal = item.medal ? MEDAL_STYLES[item.medal as keyof typeof MEDAL_STYLES] : null;
                return (
                  <div
                    key={i}
                    className="group relative shrink-0 cursor-pointer"
                    style={{
                      scrollSnapAlign: "start",
                      transform: `rotate(${item.rotate})`,
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "rotate(0deg) scale(1.04)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = `rotate(${item.rotate}) scale(1)`; }}
                  >
                    {/* Карточка-фото */}
                    <div
                      className="relative rounded-xl overflow-hidden shadow-2xl"
                      style={{
                        height: "20rem",
                        aspectRatio: item.ratio,
                        border: medal ? `2px solid ${medal.border}` : "2px solid rgba(255,255,255,0.08)",
                        boxShadow: medal ? `0 0 24px ${medal.glow}25, 0 8px 32px rgba(0,0,0,0.6)` : "0 8px 32px rgba(0,0,0,0.6)",
                      }}
                    >
                      {/* Фото */}
                      <Image
                        src={item.src}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ objectPosition: item.objPos }}
                        sizes="(min-width: 1024px) 480px, 320px"
                        loading="lazy"
                      />
                      {/* Градиент снизу */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                      {/* Медаль-бейджик сверху */}
                      {medal && (
                        <div
                          className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white backdrop-blur-sm"
                          style={{ background: `${medal.glow}33`, border: `1px solid ${medal.glow}60` }}
                        >
                          {medal.label}
                        </div>
                      )}

                      {/* Подпись */}
                      <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-2">
                        <p className="text-white font-bold text-sm leading-tight">{item.name}</p>
                        <p className="text-gray-400 text-[11px] mt-0.5">{item.event}</p>
                      </div>
                    </div>

                    {/* "Скотч" сверху — декор */}
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-4 rounded-sm opacity-30"
                      style={{ background: "linear-gradient(135deg, #60a5fa40, #93c5fd30)", border: "1px solid #60a5fa30" }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
