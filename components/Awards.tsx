import Image from "next/image";
import Reveal from "./Reveal";

const awards = [
  {
    id: "2gis",
    title: "Здесь хорошо!",
    source: "2ГИС",
    description: "Высокая оценка пользователей за качество обслуживания",
    image: "/2gis.jpeg",
    year: "2024",
  },
  {
    id: "yandex",
    title: "Хорошее место",
    source: "Яндекс Карты",
    description: "Награда за доверие и высокие оценки клиентов",
    image: "/yandex.jpg",
    year: "2024",
  },
  {
    id: "alliance",
    title: "Alliance",
    source: "Команда-чемпион",
    description: "16-кратные чемпионы мира по BJJ — мы часть этой команды",
    image: "/alliance.jpeg",
    year: "2026",
  },
];

export default function Awards() {
  return (
    <section className="relative py-8 lg:py-12 bg-[#0a0a0a] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#080808] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent to-[#0d1525] pointer-events-none" />
      {/* Фоновые декоративные элементы */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(59,130,246,0.07),transparent)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />
      {/* Декоративные линии */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-[#0d1525]/60 to-[#0d1525] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Reveal>
            <span className="text-blue-500 text-xs font-medium uppercase tracking-widest">
              Признание
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Наши{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                награды
              </span>
            </h2>
          </Reveal>
        </div>

        <div className="flex flex-nowrap justify-center items-stretch gap-4 sm:gap-10">
          {awards.map((award, i) => (
            <Reveal key={award.id} delay={i * 120} className="flex flex-col w-36 sm:w-44 self-stretch">
              <div className="group relative flex flex-col w-full self-stretch h-full">
              <div className="relative w-full flex-1 rounded-[2rem] p-[1px] bg-gradient-to-b from-blue-500/40 via-white/10 to-transparent shadow-xl shadow-blue-950/30">
                <div className="relative flex flex-col bg-gradient-to-b from-[#111827] to-[#0d1117] rounded-[2rem] overflow-hidden [clip-path:inset(0_round_2rem)] h-full">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(59,130,246,0.12),transparent)] pointer-events-none z-10" />
                  <div className="relative overflow-hidden rounded-t-[2rem] h-52 sm:h-80 group-hover:scale-[1.03] transition-transform duration-500 origin-top bg-[#111827]">
                    <Image
                      src={award.image}
                      alt={award.title}
                      fill
                      className="object-cover object-center"
                      sizes="176px"
                      loading="lazy"
                    />
                    {award.id === "alliance" && <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />}
                    <div className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-[#111827] to-transparent z-20 pointer-events-none ${award.id === "alliance" ? "h-16" : "h-8"}`} />
                    <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#111827] to-transparent z-20 pointer-events-none ${award.id === "alliance" ? "h-16" : "h-8"}`} />
                  </div>
                  <div className="relative z-10 text-center px-3 py-4 flex-1 flex flex-col justify-center">
                    <div className="text-white font-black text-sm leading-tight">{award.title}</div>
                    <div className="text-blue-400 text-xs mt-1 font-semibold tracking-wide">{award.source}</div>
                    <div className="text-gray-400 text-xs mt-2 leading-snug">{award.description}</div>
                  </div>
                </div>
              </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
