"use client";
import { useState } from "react";
import Image from "next/image";
import { X, ChevronUp } from "lucide-react";
import trainersJson from "@/data/trainers.json";
import Reveal from "./Reveal";
import LeadModal from "./LeadModal";

const trainers = trainersJson;
type Trainer = (typeof trainersJson)[0];

// ─── Bottom sheet с деталями тренера ────────────────────────────────────────
function TrainerSheet({ trainer, onClose, onRecord }: { trainer: Trainer; onClose: () => void; onRecord: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-end" onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full bg-[#0d1525] border-t border-white/10 rounded-t-3xl shadow-2xl max-h-[80dvh] flex flex-col">
        {/* drag handle */}
        <div className="flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-10 h-1 rounded-md bg-white/20" />
        </div>

        <div className="overflow-y-auto px-5 pb-8 pt-2">
          {/* Header */}
          <div className="flex items-center gap-4 mb-5">
            {trainer.image ? (
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                <Image src={trainer.image} alt={trainer.name} fill className="object-cover object-top" sizes="64px" />
              </div>
            ) : (
              <div className={`w-16 h-16 rounded-2xl shrink-0 bg-gradient-to-br ${trainer.beltGradient} flex items-center justify-center`}>
                <span className="text-white/40 text-xl font-black">{trainer.name.split(" ").map((n) => n[0]).join("")}</span>
              </div>
            )}
            <div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${trainer.beltBadge} inline-block mb-1`}>{trainer.belt}</span>
              <h3 className="text-white font-black text-lg leading-tight">{trainer.name}</h3>
              <p className="text-gray-400 text-xs leading-snug mt-0.5">{trainer.role}</p>
            </div>
            <button onClick={onClose} className="ml-auto w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors shrink-0">
              <X size={14} />
            </button>
          </div>

          {/* Achievements */}
          <ul className="space-y-2.5 mb-6">
            {trainer.achievements.map((a) => (
              <li key={a} className="flex items-start gap-2.5 text-sm text-gray-300">
                <span className="text-blue-400 shrink-0 mt-0.5">▸</span>
                {a}
              </li>
            ))}
          </ul>

          <button
            onClick={() => { onClose(); onRecord(); }}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-3.5 rounded-2xl text-sm active:scale-95 transition-transform"
          >
            Записаться к {trainer.name.split(" ")[0]}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Карточка тренера ─────────────────────────────────────────────────────────
function TrainerCard({ trainer, i, onOpen }: { trainer: Trainer; i: number; onOpen: () => void }) {
  const initials = trainer.name.split(" ").map((n) => n[0]).join("");
  const hasImage = !!trainer.image;

  return (
    <Reveal delay={i * 60}>
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer shadow-xl shadow-black/40 active:scale-[0.97] transition-transform duration-150"
        style={{ aspectRatio: "3/4" }}
        onClick={onOpen}
      >
        {hasImage ? (
          <Image
            src={trainer.image}
            alt={trainer.name}
            fill
            className="absolute inset-0 object-cover object-top"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${trainer.beltGradient}`}>
            <span className="absolute bottom-6 left-6 text-8xl font-black text-white/10 select-none leading-none">{initials}</span>
          </div>
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Belt badge */}
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-md ${trainer.beltBadge} z-10`}>
          {trainer.belt}
        </span>

        {/* Name + tap hint */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <h3 className="text-white font-black text-sm leading-tight">{trainer.name}</h3>
          <div className="flex items-center gap-1 mt-1.5">
            <ChevronUp size={11} className="text-blue-400" />
            <span className="text-blue-400 text-[10px] font-medium">подробнее</span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// ─── Секция ───────────────────────────────────────────────────────────────────
export default function Trainers() {
  const [activeTrainer, setActiveTrainer] = useState<Trainer | null>(null);
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
              <TrainerCard key={trainer.name} trainer={trainer} i={i} onOpen={() => setActiveTrainer(trainer)} />
            ))}
          </div>
        </div>
      </section>

      {activeTrainer && (
        <TrainerSheet
          trainer={activeTrainer}
          onClose={() => setActiveTrainer(null)}
          onRecord={() => setModalOpen(true)}
        />
      )}
      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

