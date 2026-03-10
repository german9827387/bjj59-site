"use client";

import { motion } from "framer-motion";

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
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-blue-500 text-xs font-medium uppercase tracking-widest"
          >
            Признание
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-white mt-2"
          >
            Наши{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
              награды
            </span>
          </motion.h2>
        </div>

        <div className="flex flex-wrap justify-center items-stretch gap-10">
          {awards.map((award, i) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative flex flex-col w-44 self-stretch"
            >
              <div className="relative w-full flex-1 rounded-[2rem] p-[1px] bg-gradient-to-b from-blue-500/40 via-white/10 to-transparent shadow-xl shadow-blue-950/30">
                <div className="relative flex flex-col bg-gradient-to-b from-[#111827] to-[#0d1117] rounded-[2rem] overflow-hidden h-full">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(59,130,246,0.12),transparent)] pointer-events-none z-10" />
                  <div className="relative overflow-hidden rounded-t-[2rem] h-80 group-hover:scale-[1.03] transition-transform duration-500 origin-top">
                    <img src={award.image} alt={award.title} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="relative z-10 text-center px-5 py-4 flex-1 flex flex-col justify-center">
                    <div className="text-white font-black text-base leading-tight">{award.title}</div>
                    <div className="text-blue-400 text-xs mt-1 font-semibold tracking-wide">{award.source}</div>
                    <div className="text-gray-500 text-xs mt-2 leading-snug">{award.description}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Коллаж результатов */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <div className="text-center mb-6">
            <span className="text-blue-500 text-xs font-medium uppercase tracking-widest">Соревнования</span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Наши{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">результаты</span>
            </h3>
          </div>
          <div className="rounded-3xl overflow-hidden border border-blue-500/20 shadow-xl shadow-blue-950/30">
            <img
              src="/result.png"
              alt="Наши результаты"
              className="w-full h-auto object-contain"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
