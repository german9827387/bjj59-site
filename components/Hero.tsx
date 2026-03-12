"use client";

import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { Play } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import settingsJson from "@/data/settings.json";

const { hero, contacts } = settingsJson;

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

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 bg-[#0d1525]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src="/hero-compressed.mp4" type="video/mp4" />
        </video>
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 lg:pt-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-blue-400 text-xs font-medium uppercase tracking-widest">
            {hero.badge}
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-[96px] font-black text-white leading-[0.9] tracking-tight mb-6"
        >
          {hero.title1}
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 text-transparent bg-clip-text">
            {hero.title2}
          </span>
          <br />
          {hero.title3}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mt-4 mb-10 leading-relaxed"
        >
          {hero.subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          {/* UTP */}
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full px-5 py-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
            <span className="text-gray-300 text-sm">Экипировка на первое занятие <span className="text-white font-semibold">бесплатно</span></span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={`https://t.me/GSAcademy59?text=${encodeURIComponent('Здравствуйте! Пишу с сайта, хочу записаться на пробное занятие')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-4 px-10 rounded-full text-lg hover:opacity-90 transition-all hover:scale-105 shadow-2xl shadow-blue-500/30"
          >
            <span className="relative z-10">{hero.ctaPrimary}</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10" />
          </a>
          <a
            href="#directions"
            className="flex items-center gap-2 border border-blue-500/40 text-blue-400 font-bold py-4 px-10 rounded-full text-lg hover:bg-blue-500/10 transition-all"
          >
            <Play size={16} className="fill-current" />
            {hero.ctaSecondary}
          </a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto"
        >
          {hero.stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
            >
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              </div>
              <div className="text-gray-500 text-xs mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Smooth fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(13,21,37,0.7) 60%, #0d1525 85%, #0d1525 100%)" }}
      />
    </section>
  );
}
