"use client";

import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";

export default function Contacts() {
  return (
    <section id="contacts" className="section-card py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[#3B82F6] text-xs font-medium uppercase tracking-widest"
          >
            Приходите к нам
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-white mt-2"
          >
            Наши <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">контакты</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-[#3B82F6]" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Адрес</h3>
                  <p className="text-gray-400">г. Пермь, ул. Аркадия Гайдара 8б</p>
                  <a
                    href="https://yandex.ru/maps/org/gsacademy/13932890682/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3B82F6] text-sm hover:underline mt-1 inline-block"
                  >
                    Открыть на Яндекс Картах →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-[#3B82F6]" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Телефон</h3>
                  <a
                    href="tel:+79958654244"
                    className="text-gray-400 hover:text-[#3B82F6] transition-colors text-lg font-medium"
                  >
                    8 (995) 865-42-44
                  </a>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-[#1e1e1e] min-h-64"
          >
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=56.256389%2C58.014444&z=16&pt=56.256389,58.014444,pm2rdm&l=map"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              title="Карта GSAcademy — г. Пермь, ул. Аркадия Гайдара 8б"
              className="w-full h-full min-h-64"
              style={{ minHeight: "320px" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
