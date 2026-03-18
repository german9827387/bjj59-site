import React from "react";
import { Clock, MapPin, CalendarDays } from "lucide-react";

interface ScheduleClass {
  id: string;
  title: string;
  instructor: string;
  startTime: string;
  endTime: string;
  date: string;
  type: string;
  location: string;
}

interface DaySlot {
  title: string;
  instructor: string;
  startTime: string;
  endTime: string;
  type: string;
  location: string;
}

// Цвет карточки — по направлению (из названия)
function getDirection(title: string): "bjj" | "boxing" | "mma" {
  const t = title.toLowerCase();
  if (t.includes("бокс")) return "boxing";
  if (t.includes("мма") || t.includes("mma")) return "mma";
  return "bjj";
}

const DIR_COLORS: Record<string, string> = {
  bjj:    "bg-[#1e3a5f] text-blue-100 border-blue-400/50",
  boxing: "bg-[#3d2a0a] text-amber-100 border-amber-500/50",
  mma:    "bg-[#2d1f3d] text-purple-100 border-purple-400/50",
};

const DIR_STYLES: Record<string, React.CSSProperties> = {
  bjj:    { background: "rgba(30,90,200,0.35)",  borderColor: "rgba(96,165,250,0.7)",  color: "#dbeafe" },
  boxing: { background: "rgba(140,70,5,0.50)",   borderColor: "rgba(251,191,36,0.7)",  color: "#fef3c7" },
  mma:    { background: "rgba(100,30,150,0.45)", borderColor: "rgba(192,132,252,0.7)", color: "#f3e8ff" },
};

// Badge — по типу занятия
const TYPE_BADGE: Record<string, { label: string }> = {
  gi:   { label: "Gi" },
  nogi: { label: "No-Gi" },
  kids: { label: "Kids" },
};

const BADGE_CLS = "border border-white/50 text-white bg-white/5";

const DAYS = [
  { label: "Понедельник", day: 1 },
  { label: "Вторник", day: 2 },
  { label: "Среда", day: 3 },
  { label: "Четверг", day: 4 },
  { label: "Пятница", day: 5 },
  { label: "Суббота", day: 6 },
];

async function getWeeklySchedule(): Promise<Record<number, DaySlot[]>> {
  try {
    const res = await fetch("https://g-sacademy.vercel.app/api/schedule", {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return {};
    const data: { classes: ScheduleClass[] } = await res.json();

    const grouped: Record<number, Map<string, DaySlot>> = {};

    for (const cls of data.classes) {
      const date = new Date(cls.date);
      const dayOfWeek = date.getDay(); // 0=Sun
      if (dayOfWeek === 0) continue; // skip Sunday

      if (!grouped[dayOfWeek]) grouped[dayOfWeek] = new Map();

      const key = `${cls.startTime}-${cls.title.trim()}-${cls.instructor.trim()}`;
      if (!grouped[dayOfWeek].has(key)) {
        grouped[dayOfWeek].set(key, {
          title: cls.title.trim(),
          instructor: cls.instructor.trim(),
          startTime: cls.startTime,
          endTime: cls.endTime,
          type: cls.type,
          location: cls.location,
        });
      }
    }

    const result: Record<number, DaySlot[]> = {};
    for (const [day, map] of Object.entries(grouped)) {
      result[Number(day)] = Array.from(map.values()).sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
    }
    return result;
  } catch {
    return {};
  }
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Расписание тренировок | GSAcademy Пермь",
  description: "Расписание тренировок по BJJ, ММА, боксу, тайскому боксу и грэпплингу в GSAcademy. Пермь, ул. Аркадия Гайдара 8б.",
  keywords: ["расписание тренировок Пермь", "BJJ расписание", "ММА расписание", "бокс расписание Пермь", "GSAcademy расписание"],
  alternates: { canonical: "https://bjj59.ru/schedule" },
  openGraph: {
    title: "Расписание тренировок | GSAcademy Пермь",
    description: "Расписание занятий по единоборствам в Перми. BJJ, ММА, бокс, тайский бокс, грэпплинг.",
    url: "https://bjj59.ru/schedule",
    siteName: "GSAcademy",
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/hero-poster.jpg", width: 1280, height: 720, alt: "Расписание GSAcademy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Расписание тренировок | GSAcademy Пермь",
    description: "Расписание занятий по единоборствам в Перми.",
    images: ["/hero-poster.jpg"],
  },
};

export default async function SchedulePage() {
  const schedule = await getWeeklySchedule();

  return (
    <div className="relative min-h-screen bg-[#0d1525] pt-24 pb-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(59,130,246,0.12),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_100%,rgba(6,182,212,0.06),transparent)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <CalendarDays className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-xs font-medium tracking-widest">
              GSacademy
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            Еженедельное{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 text-transparent bg-clip-text">
              расписание
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Выбери удобное время и направление — тренировки проходят каждый день
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center items-center">
          <span className="text-gray-500 text-xs uppercase tracking-widest mr-1">Направление:</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ border: "1px solid rgba(96,165,250,0.6)", background: "rgba(30,90,200,0.25)", color: "#bfdbfe" }}>
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#60a5fa" }} />Джиу-джитсу
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ border: "1px solid rgba(251,191,36,0.6)", background: "rgba(140,70,5,0.35)", color: "#fde68a" }}>
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#fbbf24" }} />Бокс
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ border: "1px solid rgba(192,132,252,0.6)", background: "rgba(100,30,150,0.30)", color: "#e9d5ff" }}>
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#c084fc" }} />ММА
          </div>
          <span className="mx-1 text-white/10">|</span>
          <span className="text-gray-500 text-xs uppercase tracking-widest mr-1">Формат:</span>
          <span className="text-xs font-black px-2.5 py-1 rounded-full border border-white/50 bg-white/5 text-white">Gi</span>
          <span className="text-xs font-black px-2.5 py-1 rounded-full border border-white/50 bg-white/5 text-white">No-Gi</span>
          <span className="text-xs font-black px-2.5 py-1 rounded-full border border-white/50 bg-white/5 text-white">Kids</span>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-6 gap-3">
          {DAYS.map(({ label, day }) => {
            const classes = schedule[day] || [];
            return (
              <div key={day} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                <div className="px-3 py-3 text-center border-b border-white/[0.06] bg-gradient-to-r from-blue-500/10 to-cyan-500/5">
                  <span className="text-white font-bold text-sm tracking-wide">
                    {label}
                  </span>
                </div>
                <div className="p-2 space-y-2">
                  {classes.length === 0 ? (
                    <div className="text-center text-gray-600 text-xs py-10">
                      Выходной
                    </div>
                  ) : (
                    classes.map((cls, i) => (
                      <div
                        key={i}
                        className="rounded-xl border text-xs overflow-hidden"
                        style={DIR_STYLES[getDirection(cls.title)]}
                      >
                        {/* Header: time + badge */}
                        <div className="flex items-center justify-between px-2.5 pt-2 pb-1.5">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 flex-shrink-0 opacity-70" />
                            <span className="font-bold text-[11px]">{cls.startTime}–{cls.endTime}</span>
                          </div>
                          {TYPE_BADGE[cls.type] && (
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${BADGE_CLS}`}>
                              {TYPE_BADGE[cls.type].label}
                            </span>
                          )}
                        </div>
                        {/* Body */}
                        <div className="px-2.5 pb-2.5">
                          <div className="font-bold leading-tight mb-1">{cls.title}</div>
                          <div className="opacity-60 text-[10px]">{cls.instructor}</div>
                          <div className="flex items-center gap-1 opacity-50 mt-0.5">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate text-[10px]">{cls.location}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile list */}
        <div className="md:hidden space-y-4">
          {DAYS.map(({ label, day }) => {
            const classes = schedule[day] || [];
            return (
              <div key={day} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06] bg-gradient-to-r from-blue-500/10 to-cyan-500/5">
                  <span className="text-white font-bold tracking-wide">{label}</span>
                </div>
                {classes.length === 0 ? (
                  <div className="text-center text-gray-600 text-sm py-6">
                    Выходной
                  </div>
                ) : (
                  <div className="p-3 grid grid-cols-2 gap-2">
                    {classes.map((cls, i) => (
                      <div
                        key={i}
                        className="rounded-xl border text-xs overflow-hidden"
                        style={DIR_STYLES[getDirection(cls.title)]}
                      >
                        {/* Header: time + badge */}
                        <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 flex-shrink-0 opacity-70" />
                            <span className="font-bold text-[11px]">{cls.startTime}–{cls.endTime}</span>
                          </div>
                          {TYPE_BADGE[cls.type] && (
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${BADGE_CLS}`}>
                              {TYPE_BADGE[cls.type].label}
                            </span>
                          )}
                        </div>
                        {/* Body */}
                        <div className="px-3 pb-3">
                          <div className="font-bold leading-tight mb-1">{cls.title}</div>
                          <div className="opacity-60 text-[10px]">{cls.instructor}</div>
                          <div className="flex items-center gap-1 opacity-50 mt-0.5">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate text-[10px]">{cls.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <p className="text-gray-400 mb-5 text-base">Не нашли подходящее время? Напишите нам — подберём удобный вариант</p>
          <a
            href={`https://t.me/GSAcademy59?text=${encodeURIComponent('Здравствуйте! Хочу записаться на тренировку, помогите выбрать время')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-3.5 px-10 rounded-full text-base hover:opacity-90 transition-all hover:scale-105 shadow-2xl shadow-blue-500/30"
          >
            Записаться на тренировку
          </a>
        </div>
      </div>
    </div>
  );
}
