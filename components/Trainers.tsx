"use client";
import { useState } from "react";
import Image from "next/image";
import trainersJson from "@/data/trainers.json";
import Reveal from "./Reveal";
import LeadModal from "./LeadModal";

const trainers = trainersJson;

type Trainer = (typeof trainersJson)[0];

function TrainerCard({ trainer, i, onRecord }: { trainer: Trainer; i: number; onRecord: () => void }) {
  const initials = trainer.name.split(" ").map((n) => n[0]).join("");
  const hasImage = !!trainer.image;
  const [tapped, setTapped] = useState(false);

  const handleTap = () => setTapped((v) => !v);

  return (
    <Reveal delay={i * 60}>
      <div
        className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-xl shadow-black/40"
        style={{ aspectRatio: "3/4" }}
        onClick={handleTap}
      >
      {hasImage ? (
        <Image
          src={trainer.image}
          alt={trainer.name}
          fill
          className="absolute inset-0 object-cover object-top group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${trainer.beltGradient}`}>
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
              backgroundSize: "12px 12px",
            }}
          />
          <span className="absolute bottom-6 left-6 text-8xl font-black text-white/10 select-none leading-none">
            {initials}
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${trainer.beltBadge} z-10`}>
        {trainer.belt}
      </span>

      {/* Static bottom info — скрыто при hover (десктоп) и при tap (мобилка) */}
      <div className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10 transition-opacity duration-300 ${tapped ? "opacity-0" : "opacity-100"} group-hover:opacity-0`}>
        <h3 className="text-white font-black text-sm sm:text-base leading-tight">{trainer.name}</h3>
        <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5 leading-snug">{trainer.role}</p>
        {trainer.achievements[0] && (
          <p className="text-blue-300 text-[10px] mt-1 leading-snug line-clamp-1">
            <span className="text-blue-400 mr-1">▸</span>{trainer.achievements[0]}
          </p>
        )}
      </div>

      {/* Achievements overlay — показывается при hover (десктоп) и при tap (мобилка) */}
      <div className={`absolute inset-0 z-20 flex flex-col justify-end p-4 transition-opacity duration-300 bg-gradient-to-t from-black/95 via-black/80 to-black/30 ${tapped ? "opacity-100" : "opacity-0"} group-hover:opacity-100`}>
        <h3 className="text-white font-black text-base leading-tight mb-0.5">{trainer.name}</h3>
        <p className="text-blue-400 text-[11px] mb-3 leading-snug">{trainer.role}</p>
        <ul className="space-y-1.5 mb-4">
          {trainer.achievements.map((a) => (
            <li key={a} className="text-gray-300 text-xs flex items-start gap-1.5">
              <span className="text-blue-400 shrink-0 mt-0.5">▸</span>
              {a}
            </li>
          ))}
        </ul>
        <button
          onClick={(e) => { e.stopPropagation(); onRecord(); }}
          className="block w-full text-center bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold py-2 rounded-xl hover:bg-blue-500/30 transition-all active:scale-95"
        >
          Записаться
        </button>
      </div>
      </div>
    </Reveal>
  );
}

export default function Trainers() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
    <section id="trainers" className="relative py-20 lg:py-28 bg-[#0d1525] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_50%,rgba(59,130,246,0.07),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_50%,rgba(6,182,212,0.05),transparent)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent to-[#0a0a0a] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Reveal>
            <span className="text-blue-500 text-xs font-medium uppercase tracking-widest">
              Команда профессионалов
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">
              Наши{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                тренеры
              </span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-sm">
              6 чёрных поясов по BJJ, чемпионы мира и России.
              Все тренеры имеют педагогическое образование.
            </p>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {trainers.map((trainer, i) => (
            <TrainerCard key={trainer.name} trainer={trainer} i={i} onRecord={() => setModalOpen(true)} />
          ))}
        </div>
      </div>
    </section>
    <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}


