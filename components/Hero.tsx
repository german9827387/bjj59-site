"use client";

import { Star } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import settingsJson from "@/data/settings.json";
import { reachGoal } from "@/lib/lead-utils";
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

export default function Hero() {
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 lg:pt-24">
        {/* Badge — urgency */}
        <div className="hero-fade inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-300 text-xs font-semibold uppercase tracking-widest">
            {hero.badge}
          </span>
        </div>

        {/* Main heading */}
        <h1
          className="hero-slide text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-3"
        >
          {hero.title1}
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 text-transparent bg-clip-text">
            {hero.title2}
          </span>
        </h1>

        {/* Hook line */}
        <p
          className="hero-fade text-xl sm:text-2xl lg:text-3xl font-bold text-white/70 mb-6 tracking-tight"
          style={{ animationDelay: "0.2s" }}
        >
          {hero.title3}
        </p>

        {/* Subtitle */}
        <p
          className="hero-fade text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ animationDelay: "0.35s" }}
        >
          {hero.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="hero-fade flex flex-col items-center gap-4" style={{ animationDelay: "0.5s" }}>
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={() => setModalOpen(true)}
            className="group relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-3 px-7 sm:py-4 sm:px-10 rounded-full text-base sm:text-lg hover:opacity-90 transition-all hover:scale-105 shadow-2xl shadow-blue-500/30"
          >
            <span className="relative z-10">{hero.ctaPrimary}</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10" />
          </button>
          <div className="flex gap-2">
            <a
              href={TG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-blue-500/40 text-blue-400 font-bold py-3 px-5 rounded-full text-sm hover:bg-blue-500/10 transition-all"
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
              onClick={() => reachGoal("max_click")}
              className="flex items-center gap-2 border border-blue-500/40 text-blue-400 font-bold py-3 px-5 rounded-full text-sm hover:bg-blue-500/10 transition-all"
            >
              <span className="w-[18px] h-[18px] rounded-full bg-[#168ACD] flex items-center justify-center shrink-0">
                <span className="text-white text-[9px] font-bold leading-none">M</span>
              </span>
              MAX
            </a>
          </div>
          </div>

          {/* Social proof */}
          <div className="flex flex-col items-center gap-1 mt-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={14} className="text-blue-400 fill-blue-400" />
                ))}
              </div>
              <span className="text-white font-black text-base">5.0</span>
            </div>
            <span className="text-gray-400 text-sm">на Google, Яндексе и 2ГИС</span>
          </div>
        </div>

        {/* Stats */}
        <div className="hero-fade grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto" style={{ animationDelay: "0.7s" }}>
          {hero.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md ${i >= 2 ? "hidden sm:block" : ""}`}
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
