"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export interface VkPost {
  id: number;
  text: string;
  date: number;
  photos: string[];
}

const MONTHS = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];

function formatDate(unix: number) {
  const d = new Date(unix * 1000);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()} г.`;
}

function Modal({ post, onClose }: { post: VkPost; onClose: () => void }) {
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const currentPhoto = post.photos[photoIdx] ?? null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-[#111827] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          aria-label="Закрыть"
        >
          ✕
        </button>

        {/* Photos */}
        {currentPhoto && (
          <div className="relative w-full aspect-video bg-black rounded-t-2xl overflow-hidden">
            <Image
              src={currentPhoto}
              alt=""
              fill
              className="object-contain"
              sizes="672px"
            />
            {post.photos.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setPhotoIdx(
                      (i) => (i - 1 + post.photos.length) % post.photos.length
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white text-xl transition-all"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setPhotoIdx((i) => (i + 1) % post.photos.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white text-xl transition-all"
                >
                  ›
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {post.photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIdx(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        i === photoIdx ? "bg-white scale-125" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Text */}
        <div className="p-6">
          <span className="text-blue-500 text-xs font-medium">
            {formatDate(post.date)}
          </span>
          <p className="text-gray-200 text-sm leading-relaxed mt-3 whitespace-pre-line">
            {post.text}
          </p>
        </div>
      </div>
    </div>
  );
}

function OverlayCard({ post, featured = false, onClick }: { post: VkPost; featured?: boolean; onClick: () => void }) {
  const cover = post.photos[0] ?? null;
  const hasMultiplePhotos = post.photos.length > 1;

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl text-left cursor-pointer w-full ${
        featured ? "aspect-[4/3] sm:aspect-auto sm:h-full min-h-[280px]" : "aspect-video sm:aspect-auto sm:flex-1"
      }`}
    >
      {/* Photo */}
      {cover ? (
        <Image
          src={cover}
          alt=""
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes={featured ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 100vw, 33vw"}
        />
      ) : (
        <div className="absolute inset-0 bg-[#111827]" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/80" />

      {/* Photo count badge */}
      {hasMultiplePhotos && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-md px-2.5 py-1 text-white/80 text-xs font-medium">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          {post.photos.length}
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <span className="text-blue-400 text-xs font-medium block mb-2">{formatDate(post.date)}</span>
        <p className={`text-white font-medium leading-snug ${
          featured ? "text-base sm:text-lg line-clamp-3" : "text-sm line-clamp-2"
        }`}>
          {post.text}
        </p>
        <span className="mt-3 inline-block text-blue-300 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Читать далее →
        </span>
      </div>
    </button>
  );
}

export default function NewsGrid({ posts }: { posts: VkPost[] }) {
  const [active, setActive] = useState<VkPost | null>(null);
  const [first, ...rest] = posts;

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 sm:h-[480px]">
        {/* Featured card — left 2/3 */}
        {first && (
          <div className="sm:w-2/3">
            <OverlayCard post={first} featured onClick={() => setActive(first)} />
          </div>
        )}

        {/* Side cards — right 1/3 stacked */}
        {rest.length > 0 && (
          <div className="sm:w-1/3 flex flex-col gap-4">
            {rest.map((post) => (
              <OverlayCard key={post.id} post={post} onClick={() => setActive(post)} />
            ))}
          </div>
        )}
      </div>

      {active && <Modal post={active} onClose={() => setActive(null)} />}
    </>
  );
}
