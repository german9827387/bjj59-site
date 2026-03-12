"use client";

import { Star, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import reviewsJson from "@/data/reviews.json";
import Reveal from "./Reveal";

const reviews = reviewsJson;

export default function Reviews() {
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const next = useCallback(() => setActive((v) => (v + 1) % reviews.length), []);
  const prev = useCallback(() => setActive((v) => (v - 1 + reviews.length) % reviews.length), []);

  const handleNext = useCallback(() => { next(); setAutoPlay(false); }, [next]);
  const handlePrev = useCallback(() => { prev(); setAutoPlay(false); }, [prev]);
  const handleDot = useCallback((i: number) => { setActive(i); setAutoPlay(false); }, []);

  // Auto-advance on mobile — stops when user manually navigates
  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, autoPlay]);

  return (
    <section className="relative py-20 lg:py-28 bg-[#080808]">
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#0a0a0a] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Reveal>
            <span className="text-blue-500 text-xs font-medium uppercase tracking-widest">
              Что говорят наши ученики
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">
              Отзывы о{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                GSAcademy
              </span>
            </h2>

            {/* Rating badge */}
            <div className="inline-flex items-center gap-3 mt-6 bg-[#0d0d0d] border border-blue-500/20 rounded-2xl px-6 py-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} className="text-blue-400 fill-blue-400" />
                ))}
              </div>
              <span className="text-white font-black text-2xl">5.0</span>
              <span className="text-gray-500 text-sm">на Яндекс Картах</span>
              <span className="border-l border-[#1e1e1e] pl-3 text-sm">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text font-bold">88</span>
                <span className="text-gray-300"> отзывов</span>
              </span>
            </div>

            {/* Platform ratings row */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {[
                {
                  name: "Google",
                  score: "5.0",
                  icon: (
                    <svg viewBox="0 0 48 48" className="w-14 h-14">
                      <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
                      <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.7 7.4 6.3 14.7z"/>
                      <path fill="#FBBC05" d="M24 46c5.5 0 10.5-1.8 14.4-5l-6.7-5.5C29.7 37 27 38 24 38c-6 0-10.6-3-11.7-8.4l-7 5.4C8.9 41.8 15.9 46 24 46z"/>
                      <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.6 2.3-2 4.3-3.9 5.7l6.7 5.5C42.5 36.2 46 31 46 24c0-1.3-.2-2.7-.5-4z"/>
                    </svg>
                  ),
                },
                {
                  name: "2ГИС",
                  score: "5.0",
                  icon: (
                    <Image src="/2gis.jpeg" alt="2ГИС" width={56} height={56} className="rounded-2xl object-cover" />
                  ),
                },
                {
                  name: "Яндекс",
                  score: "5.0",
                  icon: (
                    <Image src="/yandex.jpg" alt="Яндекс" width={56} height={56} className="rounded-2xl object-cover" />
                  ),
                },
                {
                  name: "ВКонтакте",
                  score: "5.0",
                  icon: (
                    <div className="w-14 h-14 rounded-2xl bg-[#0077FF] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.202 1.253.745.847 1.32 1.558 1.473 2.05.17.491-.085.745-.576.745z"/>
                      </svg>
                    </div>
                  ),
                },
              ].map((platform) => (
                <div
                  key={platform.name}
                  className="flex flex-col items-center gap-2 bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl px-6 py-4 hover:border-blue-500/20 transition-colors"
                >
                  {platform.icon}
                  <span className="text-gray-400 text-xs font-medium">{platform.name}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={13} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-white font-black text-lg leading-none">{platform.score}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-5 mb-8">
          {reviews.map((review, i) => (
            <Reveal
              key={review.name}
              delay={i * 80}
              className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6 hover:border-blue-500/20 transition-all flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-blue-400 fill-blue-400" />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed flex-grow mb-5">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#1e1e1e]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">{review.name[0]}</span>
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{review.name}</div>
                  <div className="text-gray-400 text-xs">{review.date} · Яндекс</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden mb-8">
          <div className="relative overflow-hidden rounded-2xl">
            <div
              key={active}
              className="carousel-slide bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: reviews[active].rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-blue-400 fill-blue-400" />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-5">
                &ldquo;{reviews[active].text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#1e1e1e]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">{reviews[active].name[0]}</span>
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{reviews[active].name}</div>
                  <div className="text-gray-400 text-xs">{reviews[active].date} · Яндекс</div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button onClick={handlePrev} aria-label="Предыдущий отзыв" className="p-2 rounded-full border border-[#1e1e1e] text-gray-500 hover:text-white hover:border-blue-500/40 transition-all">
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDot(i)}
                  aria-label={`Отзыв ${i + 1}`}
                  className={`rounded-full transition-all ${i === active ? "w-5 h-2 bg-blue-500" : "w-2 h-2 bg-[#333]"}`}
                />
              ))}
            </div>
            <button onClick={handleNext} aria-label="Следующий отзыв" className="p-2 rounded-full border border-[#1e1e1e] text-gray-500 hover:text-white hover:border-blue-500/40 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Link */}
        <div className="text-center">
          <a
            href="https://yandex.ru/maps/org/gsacademy/13932890682/reviews/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-blue-500/30 text-blue-400 font-medium py-2.5 px-6 rounded-full hover:bg-blue-500/10 transition-all text-sm"
          >
            Все отзывы на Яндекс Картах
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}


