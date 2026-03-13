"use client";

import { Trophy, Medal } from "lucide-react";
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

export default function Results() {
  return (
    <section className="relative py-16 lg:py-24 bg-[#0d1525] overflow-hidden">
      {/* Фон */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(59,130,246,0.10),transparent)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Заголовок */}
        <div className="text-center mb-12">
          <Reveal>
            <span className="text-blue-500 text-xs font-medium uppercase tracking-widest">
              Соревнования
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Наши{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                результаты
              </span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm">
              Наши ученики выступают на региональных, всероссийских и мировых турнирах и регулярно поднимаются на пьедестал
            </p>
          </Reveal>
        </div>

        {/* Статы */}
        <Reveal className="grid grid-cols-2 gap-4 mb-12 max-w-sm mx-auto">
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

        {/* Фото-коллаж */}
        <Reveal className="relative">
          {/* Свечение за картинкой */}
          <div className="absolute -inset-4 bg-blue-600/10 blur-3xl rounded-[3rem] pointer-events-none" />

          <div className="relative rounded-3xl overflow-hidden border border-blue-500/20 shadow-2xl shadow-blue-950/60">
            {/* Верхняя градиентная линия */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent z-20 pointer-events-none" />

            {/* Оверлей по краям */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_90%_80%_at_50%_50%,transparent_50%,rgba(13,21,37,0.6)_100%)]" />

            {/* Нижний градиент */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0d1525]/80 to-transparent z-10 pointer-events-none" />

            <Image
              src="/result.jpg"
              alt="Наши результаты"
              width={1400}
              height={900}
              quality={90}
              className="w-full h-auto object-contain relative z-0"
              style={{ filter: "saturate(1.15) contrast(1.05) brightness(0.97)" }}
              loading="lazy"
            />
          </div>
        </Reveal>

      </div>
    </section>
  );
}
