"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import CTA from "./CTA";
import Pricing from "./Pricing";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Reason {
  title: string;
  desc: string;
}

interface DirectionPageProps {
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  reasons: Reason[];
  emoji: string;
}

const advantages = [
  "Профессиональный тренерский состав с педагогическим образованием",
  "Современные залы с качественным оборудованием",
  "Группы разного уровня подготовки — от новичка до профи",
  "Удобное расписание тренировок",
  "Возможность участия в соревнованиях",
  "Дружественная атмосфера и поддержка",
];

export default function DirectionPage({
  title,
  subtitle,
  tagline,
  description,
  reasons,
  emoji,
}: DirectionPageProps) {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center pt-20">
        <div className="absolute inset-0 bg-[#0a0a0a]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#151510]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#3B82F6]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-[#3B82F6] transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              На главную
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl mb-6"
          >
            {emoji}
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[#3B82F6] text-xs font-medium uppercase tracking-widest"
          >
            {subtitle}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mt-2 mb-4 leading-none"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[#3B82F6] font-bold text-sm uppercase tracking-widest mb-6"
          >
            {tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-lg max-w-2xl leading-relaxed mb-8"
          >
            {description}
          </motion.p>

          <motion.a
            href="https://wa.me/79958636285?text=Здравствуйте! Хочу записаться на бесплатное пробное занятие в GSAcademy"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-black font-black py-4 px-10 rounded-full text-lg hover:opacity-90 transition-all hover:scale-105"
          >
            Записаться на бесплатное занятие
          </motion.a>
        </div>
      </section>

      {/* Reasons */}
      <section className="section-card py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-black text-white"
            >
              Почему выбирают{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">{title.toLowerCase()}?</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6 hover:border-[#3B82F6]/30 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center mb-4 text-xs font-black text-[#3B82F6]">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-white font-bold mb-2">{r.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How training works */}
      <section className="section-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-[#3B82F6] text-xs font-medium uppercase tracking-widest"
              >
                Как проходят тренировки
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl font-black text-white mt-2 mb-6"
              >
                Занятия для <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">всех уровней</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 leading-relaxed mb-4"
              >
                Наши тренеры обладают многолетним опытом и проводят занятия для всех уровней подготовки — от новичков до профессионалов.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 leading-relaxed"
              >
                Мы создаём дружественную атмосферу, где каждый ученик получает индивидуальное внимание и поддержку. Если у вас уже есть опыт, мы предлагаем группы и индивидуальные тренировки для совершенствования навыков.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              {advantages.map((adv, i) => (
                <div
                  key={adv}
                  className="flex items-start gap-3 bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl p-4"
                >
                  <Check size={18} className="text-[#3B82F6] shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{adv}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Pricing />
      <CTA />
    </>
  );
}
