"use client";

import { MessageCircle } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import settingsJson from "@/data/settings.json";
import LeadModal from "./LeadModal";

const { hero, contacts } = settingsJson;

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

export default function Hero() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const src = isMobile ? "/hero-mobile.mp4" : "/hero-compressed1.mp4";
    const id = setTimeout(() => setVideoSrc(src), 800);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0d1525]">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          {videoSrc && <source src={videoSrc} type="video/mp4" />}
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
        <div className="hero-fade inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-blue-400 text-xs font-medium uppercase tracking-widest">
            {hero.badge}
          </span>
        </div>

        {/* Main heading */}
        <h1
          className="hero-slide text-4xl sm:text-7xl lg:text-[96px] font-black text-white leading-[0.9] tracking-tight mb-6"
        >
          {hero.title1}
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 text-transparent bg-clip-text">
            {hero.title2}
          </span>
          <br />
          {hero.title3}
        </h1>

        {/* Subtitle */}
        <p
          className="hero-fade text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mt-4 mb-10 leading-relaxed"
          style={{ animationDelay: "0.3s" }}
        >
          {hero.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="hero-fade flex flex-col items-center gap-4" style={{ animationDelay: "0.5s" }}>
          {/* UTP */}
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full px-5 py-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
            <span className="text-gray-300 text-sm">Экипировка на первое занятие <span className="text-white font-semibold">бесплатно</span></span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => setModalOpen(true)}
            className="group relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-4 px-10 rounded-full text-lg hover:opacity-90 transition-all hover:scale-105 shadow-2xl shadow-blue-500/30"
          >
            <span className="relative z-10">{hero.ctaPrimary}</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10" />
          </button>
          <a
            href={`https://t.me/GSAcademy59?text=${encodeURIComponent('Здравствуйте! Пишу с сайта, хочу записаться на пробное занятие')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-blue-500/40 text-blue-400 font-bold py-4 px-10 rounded-full text-lg hover:bg-blue-500/10 transition-all"
          >
            <MessageCircle size={16} />
            Написать в Telegram
          </a>
          </div>
        </div>

        {/* Stats */}
        <div className="hero-fade grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto" style={{ animationDelay: "0.7s" }}>
          {hero.stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
            >
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              </div>
              <div className="text-gray-400 text-xs mt-1 uppercase tracking-wider">{stat.label}</div>
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
