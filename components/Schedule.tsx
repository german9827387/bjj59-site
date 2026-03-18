import { Clock, MapPin } from 'lucide-react';

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

interface ScheduleData {
  classes: ScheduleClass[];
}

const TYPE_COLORS: Record<string, string> = {
  gi: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  nogi: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  kids: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  other: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

const RUSSIAN_DAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

async function getSchedule(): Promise<ScheduleData | null> {
  try {
    const res = await fetch('https://g-sacademy.vercel.app/api/schedule', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function getWeekDates(): Date[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default async function Schedule() {
  const data = await getSchedule();
  if (!data?.classes?.length) return null;

  const weekDates = getWeekDates();
  const weekDateStrings = weekDates.map((d) => d.toISOString().split('T')[0]);

  const weekClasses = data.classes.filter((c) => weekDateStrings.includes(c.date));

  const grouped: Record<string, ScheduleClass[]> = {};
  for (const cls of weekClasses) {
    if (!grouped[cls.date]) grouped[cls.date] = [];
    grouped[cls.date].push(cls);
  }
  for (const date of Object.keys(grouped)) {
    grouped[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <section id="schedule" className="py-20 bg-[#0a0f1e]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Расписание</h2>
          <p className="text-gray-400 text-lg">Тренировки на текущей неделе</p>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="grid grid-cols-7 gap-2 min-w-[700px]">
            {weekDates.map((date) => {
              const dateStr = date.toISOString().split('T')[0];
              const classes = grouped[dateStr] || [];
              const isToday = dateStr === todayStr;

              return (
                <div
                  key={dateStr}
                  className={`rounded-xl p-3 ${
                    isToday
                      ? 'bg-blue-900/30 ring-1 ring-blue-500/50'
                      : 'bg-white/5'
                  }`}
                >
                  <div className="text-center mb-3">
                    <div
                      className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                        isToday ? 'text-blue-400' : 'text-gray-400'
                      }`}
                    >
                      {RUSSIAN_DAYS[date.getDay()]}
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        isToday ? 'text-blue-300' : 'text-white'
                      }`}
                    >
                      {date.getDate()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {classes.length === 0 && (
                      <div className="text-center text-gray-400 text-xs py-4">—</div>
                    )}
                    {classes.map((cls) => (
                      <div
                        key={cls.id}
                        className={`rounded-lg p-2 border text-xs ${
                          TYPE_COLORS[cls.type] ?? 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                        }`}
                      >
                        <div className="font-semibold leading-tight mb-1">
                          {cls.title.trim()}
                        </div>
                        <div className="flex items-center gap-1 opacity-80">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span>
                            {cls.startTime}–{cls.endTime}
                          </span>
                        </div>
                        <div className="opacity-70 mt-0.5 truncate">
                          {cls.instructor.trim()}
                        </div>
                        <div className="flex items-center gap-1 opacity-60 mt-0.5">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate text-[10px]">{cls.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-8 justify-center text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-blue-500/50 inline-block" />
            <span className="text-gray-400">Джиу-джитсу ГИ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-sky-500/50 inline-block" />
            <span className="text-gray-400">Джиу-джитсу НО ГИ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-cyan-500/50 inline-block" />
            <span className="text-gray-400">Детские классы</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-orange-500/50 inline-block" />
            <span className="text-gray-400">Бокс / ММА</span>
          </div>
        </div>
      </div>
    </section>
  );
}
