import { Clock, MapPin } from "lucide-react";

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

const TYPE_COLORS: Record<string, string> = {
  gi: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  nogi: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  kids: "bg-green-500/20 text-green-300 border-green-500/30",
  other: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

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

export const metadata = {
  title: "Расписание — GS Academy",
};

export default async function SchedulePage() {
  const schedule = await getWeeklySchedule();

  return (
    <div className="min-h-screen bg-[#0a0f1e] pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Расписание
            </h1>
            <p className="text-gray-400 text-lg">
              Еженедельное расписание тренировок
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-10 justify-center text-sm">
            {[
              { color: "bg-blue-500/50", label: "Джиу-джитсу ГИ" },
              { color: "bg-purple-500/50", label: "Джиу-джитсу НО ГИ" },
              { color: "bg-green-500/50", label: "Детские классы" },
              { color: "bg-orange-500/50", label: "Бокс / ММА" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-sm ${color} inline-block`} />
                <span className="text-gray-400">{label}</span>
              </div>
            ))}
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-6 gap-3">
            {DAYS.map(({ label, day }) => {
              const classes = schedule[day] || [];
              return (
                <div key={day} className="rounded-xl bg-white/5 overflow-hidden">
                  <div className="bg-blue-900/30 px-3 py-2 text-center border-b border-white/5">
                    <span className="text-blue-300 font-semibold text-sm">
                      {label}
                    </span>
                  </div>
                  <div className="p-2 space-y-2">
                    {classes.length === 0 ? (
                      <div className="text-center text-gray-600 text-xs py-8">
                        Выходной
                      </div>
                    ) : (
                      classes.map((cls, i) => (
                        <div
                          key={i}
                          className={`rounded-lg p-2 border text-xs ${
                            TYPE_COLORS[cls.type] ??
                            "bg-gray-500/20 text-gray-300 border-gray-500/30"
                          }`}
                        >
                          <div className="font-semibold leading-tight mb-1">
                            {cls.title}
                          </div>
                          <div className="flex items-center gap-1 opacity-80">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span>
                              {cls.startTime}–{cls.endTime}
                            </span>
                          </div>
                          <div className="opacity-70 mt-0.5">{cls.instructor}</div>
                          <div className="flex items-center gap-1 opacity-60 mt-0.5">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate text-[10px]">
                              {cls.location}
                            </span>
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
          <div className="md:hidden space-y-6">
            {DAYS.map(({ label, day }) => {
              const classes = schedule[day] || [];
              return (
                <div key={day} className="rounded-xl bg-white/5 overflow-hidden">
                  <div className="bg-blue-900/30 px-4 py-3 border-b border-white/5">
                    <span className="text-blue-300 font-semibold">{label}</span>
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
                          className={`rounded-lg p-3 border text-xs ${
                            TYPE_COLORS[cls.type] ??
                            "bg-gray-500/20 text-gray-300 border-gray-500/30"
                          }`}
                        >
                          <div className="font-semibold leading-tight mb-1">
                            {cls.title}
                          </div>
                          <div className="flex items-center gap-1 opacity-80">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span>
                              {cls.startTime}–{cls.endTime}
                            </span>
                          </div>
                          <div className="opacity-70 mt-0.5">{cls.instructor}</div>
                          <div className="flex items-center gap-1 opacity-60 mt-0.5">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate text-[10px]">
                              {cls.location}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
}
