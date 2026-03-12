"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import pricingJson from "@/data/pricing.json";

const plans = pricingJson;

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-20 lg:py-28 bg-[#0d1525] overflow-hidden">
      {/* Фоновые эффекты */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#0d1525] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(59,130,246,0.10),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_100%,rgba(6,182,212,0.07),transparent)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#0d1525] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-[#3B82F6] text-xs font-semibold uppercase tracking-widest border border-blue-500/20 bg-blue-500/5 rounded-full px-4 py-1.5 mb-4"
          >
            Инвестиции в себя
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-white mt-2"
          >
            Стоимость{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
              занятий
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-4"
          >
            Первое занятие — бесплатно. Приходите и убедитесь сами!
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-2xl flex flex-col overflow-hidden ${
                plan.highlight
                  ? "bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 shadow-[0_0_40px_rgba(59,130,246,0.35)] ring-1 ring-blue-400/40"
                  : "bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/30 hover:bg-white/[0.05] transition-all duration-300"
              }`}
            >
              {/* Верхняя полоска для не-highlight карточек */}
              {!plan.highlight && (
                <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              )}

              <div className="p-6 flex flex-col flex-1">
                {/* Badge */}
                <span
                  className={`self-start text-[10px] font-bold px-3 py-1 rounded-full mb-4 tracking-wider ${
                    plan.highlight
                      ? "bg-white/20 text-white"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}
                >
                  {plan.label}
                </span>

                <h3 className={`font-bold text-lg mb-3 leading-tight ${plan.highlight ? "text-white" : "text-white"}`}>
                  {plan.title}
                </h3>

                <div className="flex items-baseline gap-1 mb-5">
                  <span
                    className={`text-4xl font-black ${
                      plan.highlight
                        ? "text-white"
                        : "bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlight ? "text-white/70" : "text-gray-500"}`}>
                    {plan.unit}
                  </span>
                </div>

                {/* Разделитель */}
                <div className={`h-px mb-5 ${plan.highlight ? "bg-white/20" : "bg-white/[0.06]"}`} />

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check
                        size={14}
                        className={`shrink-0 mt-0.5 ${plan.highlight ? "text-white" : "text-blue-400"}`}
                      />
                      <span className={`text-sm leading-snug ${plan.highlight ? "text-white/85" : "text-gray-400"}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`https://t.me/GSAcademy59?text=${encodeURIComponent('Здравствуйте! Пишу с сайта, интересует стоимость занятий')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-auto text-center font-bold py-3 px-6 rounded-xl text-sm transition-all duration-200 ${
                    plan.highlight
                      ? "bg-white text-blue-600 hover:bg-blue-50 shadow-md"
                      : "border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400/60"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
