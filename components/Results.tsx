"use client";

import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { Trophy, Medal } from "lucide-react";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, target, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v).toString()),
    });
    return controls.stop;
  }, [inView, target, count]);
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
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-blue-500 text-xs font-medium uppercase tracking-widest"
          >
            Соревнования
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-white mt-2"
          >
            Наши{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
              результаты
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-3 max-w-xl mx-auto text-sm"
          >
            Наши ученики выступают на региональных, всероссийских и мировых турнирах и регулярно поднимаются на пьедестал
          </motion.p>
        </div>

        {/* Статы */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 gap-4 mb-12 max-w-sm mx-auto"
        >
          {stats.map(({ icon: Icon, target, suffix, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]"
            >
              <Icon className="w-5 h-5 text-blue-400 mb-2" />
              <span className="text-2xl sm:text-3xl font-black text-white">
                <AnimatedCounter target={target} suffix={suffix} />
              </span>
              <span className="text-gray-500 text-xs mt-1 leading-tight">{label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Фото-коллаж */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Свечение за картинкой */}
          <div className="absolute -inset-4 bg-blue-600/10 blur-3xl rounded-[3rem] pointer-events-none" />

          <div className="relative rounded-3xl overflow-hidden border border-blue-500/20 shadow-2xl shadow-blue-950/60">
            {/* Верхняя градиентная линия */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent z-20 pointer-events-none" />

            {/* Оверлей по краям */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_90%_80%_at_50%_50%,transparent_50%,rgba(13,21,37,0.6)_100%)]" />

            {/* Нижний градиент */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0d1525]/80 to-transparent z-10 pointer-events-none" />

            <img
              src="/result.png"
              alt="Наши результаты"
              className="w-full h-auto object-contain relative z-0"
              style={{ filter: "saturate(1.15) contrast(1.05) brightness(0.97)" }}
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
