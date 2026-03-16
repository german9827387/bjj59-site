"use client";

import { Star, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import reviewsJson from "@/data/reviews.json";
import Reveal from "./Reveal";

const reviews = reviewsJson;

const CARD_ACCENTS = [
  "#3b82f6",
  "#06b6d4",
  "#38bdf8",
  "#60a5fa",
  "#3b82f6",
  "#06b6d4",
];

const INITIAL_SHOWN = 6;

function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < count ? "text-blue-400 fill-blue-400" : "text-gray-700 fill-gray-700"}
        />
      ))}
    </div>
  );
}

function ReviewAvatar({ review, accent, size = 8 }: { review: (typeof reviews)[0]; accent: string; size?: number }) {
  if (review.avatar) {
    return (
      <div className={`w-${size} h-${size} rounded-full overflow-hidden shrink-0 border border-white/10`}>
        <Image
          src={review.avatar}
          alt={review.name}
          width={size * 4}
          height={size * 4}
          loading="lazy"
          className="object-cover w-full h-full"
        />
      </div>
    );
  }
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm`}
      style={{ background: `linear-gradient(135deg, ${accent}, #0ea5e9)` }}
    >
      {review.name[0]}
    </div>
  );
}

export default function Reviews() {
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [animClass, setAnimClass] = useState("");
  const [showAll, setShowAll] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const visibleReviews = showAll ? reviews : reviews.slice(0, INITIAL_SHOWN);

  const goTo = useCallback((index: number, dir: "left" | "right") => {
    setAnimClass(dir === "left" ? "animate-slide-left" : "animate-slide-right");
    setActive(index);
    setTimeout(() => setAnimClass(""), 300);
  }, []);

  const next = useCallback(() => goTo((active + 1) % reviews.length, "left"), [active, goTo]);
  const prev = useCallback(() => goTo((active - 1 + reviews.length) % reviews.length, "right"), [active, goTo]);

  const handleNext = useCallback(() => { next(); setAutoPlay(false); }, [next]);
  const handlePrev = useCallback(() => { prev(); setAutoPlay(false); }, [prev]);
  const handleDot = useCallback((i: number) => { goTo(i, i > active ? "left" : "right"); setAutoPlay(false); }, [active, goTo]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) { handleNext(); } else { handlePrev(); }
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, autoPlay]);

  return (
    <section className="relative py-20 lg:py-28 bg-[#080808] overflow-hidden">
      {/* Фоновые градиенты */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(59,130,246,0.05),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_10%_80%,rgba(6,182,212,0.04),transparent)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />

      {/* GS Icon — фоновый водяной знак */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <div className="relative w-[780px] h-[780px] opacity-[0.07]">
          <Image
            src="/gs-icon.png"
            alt=""
            fill
            className="object-contain"
            loading="lazy"
            sizes="780px"
          />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Заголовок ── */}
        <Reveal className="text-center mb-14">
          <span className="text-blue-500 text-xs font-medium uppercase tracking-widest">
            Что говорят наши ученики
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">
            Отзывы о{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
              GSAcademy
            </span>
          </h2>

          {/* Рейтинг + значок */}
          <div className="flex items-center justify-center gap-6 mt-8">
            {/* Иконка слева */}
            <div className="hidden sm:flex w-14 h-14 rounded-2xl overflow-hidden border border-white/10 bg-white/5 items-center justify-center shrink-0">
              <Image src="/gs-icon.png" alt="GS Academy" width={40} height={40} className="object-contain" loading="lazy" />
            </div>
            <div className="w-px h-16 bg-[#1e1e1e] hidden sm:block" />
            <div className="text-right">
              <div className="text-6xl sm:text-7xl font-black text-white leading-none">5.0</div>
              <div className="text-gray-500 text-sm mt-1">средний рейтинг</div>
            </div>
            <div className="w-px h-16 bg-[#1e1e1e]" />
            <div className="text-left">
              <Stars count={5} size={22} />
              <div className="text-gray-400 text-sm mt-1.5">
                <span className="text-white font-bold">88</span> отзывов
              </div>
            </div>
          </div>

          {/* Платформы */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              {
                name: "Google",
                icon: (
                  <svg viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
                    <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
                    <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.7 7.4 6.3 14.7z"/>
                    <path fill="#FBBC05" d="M24 46c5.5 0 10.5-1.8 14.4-5l-6.7-5.5C29.7 37 27 38 24 38c-6 0-10.6-3-11.7-8.4l-7 5.4C8.9 41.8 15.9 46 24 46z"/>
                    <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.6 2.3-2 4.3-3.9 5.7l6.7 5.5C42.5 36.2 46 31 46 24c0-1.3-.2-2.7-.5-4z"/>
                  </svg>
                ),
              },
              {
                name: "2ГИС",
                icon: <Image src="/2gis.jpeg" alt="2ГИС" width={20} height={20} className="rounded object-cover w-5 h-5 shrink-0" />,
              },
              {
                name: "Яндекс",
                icon: <Image src="/yandex.jpg" alt="Яндекс" width={20} height={20} className="rounded object-cover w-5 h-5 shrink-0" />,
              },
              {
                name: "ВКонтакте",
                icon: (
                  <div className="w-5 h-5 rounded bg-[#0077FF] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
                      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.202 1.253.745.847 1.32 1.558 1.473 2.05.17.491-.085.745-.576.745z"/>
                    </svg>
                  </div>
                ),
              },
            ].map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.07] rounded-full px-4 py-1.5 hover:border-white/20 transition-colors"
              >
                {p.icon}
                <span className="text-gray-300 text-xs font-semibold">{p.name}</span>
                <div className="flex gap-px">
                  {[1,2,3,4,5].map(s => <Star key={s} size={10} className="text-blue-400 fill-blue-400" />)}
                </div>
                <span className="text-white text-xs font-black">5.0</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── Desktop grid ── */}
        <div className="hidden md:grid grid-cols-3 gap-4 mb-6">
          {visibleReviews.map((review, i) => (
            <Reveal key={review.id} delay={Math.min(i % 3, 2) * 70}>
              <div
                className="relative flex flex-col h-full rounded-2xl bg-white/[0.025] border border-white/[0.07] hover:border-blue-500/30 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl overflow-hidden group"
                style={{
                  borderLeftColor: CARD_ACCENTS[i % CARD_ACCENTS.length],
                  borderLeftWidth: "3px",
                  boxShadow: "0 1px 0 0 rgba(255,255,255,0.03) inset",
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.09), transparent)" }}
                />

                {/* Декоративная кавычка */}
                <div
                  className="absolute top-3 right-4 text-[80px] font-black leading-none select-none pointer-events-none opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-300"
                  style={{ color: CARD_ACCENTS[i % CARD_ACCENTS.length] }}
                >
                  &ldquo;
                </div>

                <Stars count={review.rating} size={13} />

                <p className="text-gray-400 group-hover:text-gray-300 text-sm leading-relaxed mt-4 flex-grow transition-colors duration-300">
                  {review.text}
                </p>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <ReviewAvatar review={review} accent={CARD_ACCENTS[i % CARD_ACCENTS.length]} size={8} />
                    <div>
                      <div className="text-white text-sm font-semibold leading-tight">{review.name}</div>
                      <div className="text-gray-600 text-[11px]">{review.date}</div>
                    </div>
                  </div>
                  <Image src="/yandex.jpg" alt="Яндекс" width={20} height={20} className="rounded opacity-60" loading="lazy" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Show more / less button */}
        {!showAll && reviews.length > INITIAL_SHOWN && (
          <div className="hidden md:flex justify-center mb-10">
            <button
              onClick={() => setShowAll(true)}
              className="group flex items-center gap-2 bg-white/[0.03] border border-blue-500/25 hover:border-blue-500/50 hover:bg-blue-500/[0.08] text-blue-400 font-semibold py-3 px-8 rounded-full transition-all duration-300 text-sm"
            >
              <span>Показать ещё {reviews.length - INITIAL_SHOWN} отзыва</span>
              <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}
        {showAll && (
          <div className="hidden md:flex justify-center mb-10">
            <button
              onClick={() => setShowAll(false)}
              className="flex items-center gap-2 border border-white/[0.08] text-gray-500 font-medium py-3 px-8 rounded-full hover:bg-white/5 hover:text-gray-400 transition-all text-sm"
            >
              Свернуть
            </button>
          </div>
        )}

        {/* ── Mobile carousel ── */}
        <div className="md:hidden mb-8">
          {/* Swipe hint */}
          <div className="flex items-center justify-center gap-2 mb-4 text-blue-400/50 text-xs font-medium select-none">
            <ChevronLeft size={14} className="animate-pulse" />
            <span>свайп для переключения</span>
            <ChevronRight size={14} className="animate-pulse" />
          </div>

          <div
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={`relative rounded-2xl bg-white/[0.025] border border-white/[0.07] p-6 overflow-hidden ${animClass}`}
              style={{ borderLeftColor: CARD_ACCENTS[active % CARD_ACCENTS.length], borderLeftWidth: "3px" }}
            >
              <div
                className="absolute top-3 right-4 text-[80px] font-black leading-none select-none pointer-events-none opacity-[0.07]"
                style={{ color: CARD_ACCENTS[active % CARD_ACCENTS.length] }}
              >
                &ldquo;
              </div>
              <Stars count={reviews[active].rating} size={13} />
              <p className="text-gray-300 text-sm leading-relaxed mt-4 mb-5">
                {reviews[active].text}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <ReviewAvatar review={reviews[active]} accent={CARD_ACCENTS[active % CARD_ACCENTS.length]} size={8} />
                  <div>
                    <div className="text-white text-sm font-semibold">{reviews[active].name}</div>
                    <div className="text-gray-600 text-[11px]">{reviews[active].date}</div>
                  </div>
                </div>
                <Image src="/yandex.jpg" alt="Яндекс" width={20} height={20} className="rounded opacity-60" loading="lazy" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <button onClick={handlePrev} aria-label="Предыдущий отзыв" className="p-2 rounded-full border border-white/[0.08] text-gray-500 hover:text-white hover:border-blue-500/40 transition-all">
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDot(i)}
                  aria-label={`Отзыв ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${i === active ? "w-5 h-2 bg-blue-500" : "w-2 h-2 bg-[#333]"}`}
                />
              ))}
            </div>
            <button onClick={handleNext} aria-label="Следующий отзыв" className="p-2 rounded-full border border-white/[0.08] text-gray-500 hover:text-white hover:border-blue-500/40 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <style>{`
          .animate-slide-left  { animation: slideInLeft  0.28s ease-out; }
          .animate-slide-right { animation: slideInRight 0.28s ease-out; }
          @keyframes slideInLeft  { from { opacity:0; transform:translateX(40px);  } to { opacity:1; transform:translateX(0); } }
          @keyframes slideInRight { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0); } }
        `}</style>

        {/* ── Ссылка ── */}
        <div className="text-center mt-2">
          <a
            href="https://yandex.ru/maps/org/gsacademy/13932890682/reviews/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/30 hover:bg-blue-500/[0.06] rounded-2xl px-6 py-3.5 transition-all duration-300"
          >
            <Image src="/yandex.jpg" alt="Яндекс" width={22} height={22} className="rounded opacity-80" loading="lazy" />
            <span className="text-gray-300 group-hover:text-white text-sm font-semibold transition-colors">Все отзывы на Яндекс Картах</span>
            <ExternalLink size={14} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
          </a>
        </div>
      </div>
    </section>
  );
}