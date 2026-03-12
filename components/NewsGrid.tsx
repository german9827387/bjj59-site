"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export interface VkPost {
  id: number;
  text: string;
  date: number;
  photos: string[];
  video: {
    ownerId: number;
    id: number;
    thumb: string | null;
    player: string | null;
  } | null;
}

function formatDate(unix: number) {
  return new Date(unix * 1000).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

  const videoUrl = post.video?.player
    ? post.video.player
    : post.video
    ? `https://vk.com/video_ext.php?oid=${post.video.ownerId}&id=${post.video.id}&hd=2`
    : null;

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

        {/* Video embed */}
        {videoUrl && (
          <div className="relative w-full aspect-video">
            <iframe
              src={videoUrl}
              className="w-full h-full rounded-t-2xl"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Photos */}
        {!videoUrl && currentPhoto && (
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

export default function NewsGrid({ posts }: { posts: VkPost[] }) {
  const [active, setActive] = useState<VkPost | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {posts.map((post) => {
          const cover = post.photos[0] ?? post.video?.thumb ?? null;
          const isVideo = !!post.video;

          return (
            <button
              key={post.id}
              onClick={() => setActive(post)}
              className="group flex flex-col text-left rounded-2xl overflow-hidden border border-white/[0.06] bg-[#111827] hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-950/30 transition-all duration-300 cursor-pointer"
            >
              {cover && (
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={cover}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white ml-0.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-col flex-1 p-5">
                <span className="text-blue-500 text-xs font-medium mb-2">
                  {formatDate(post.date)}
                </span>
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 flex-1">
                  {post.text}
                </p>
                <span className="mt-4 text-blue-400 text-xs font-semibold group-hover:text-blue-300 transition-colors">
                  Читать далее →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {active && <Modal post={active} onClose={() => setActive(null)} />}
    </>
  );
}
