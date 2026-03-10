"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, MessageCircle } from "lucide-react";

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
                    href="tel:+79124906455"
                    className="text-gray-400 hover:text-[#3B82F6] transition-colors text-lg font-medium"
                  >
                    8 (995) 865-42-44
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-3">Мы в соцсетях</h3>
              <div className="flex gap-3">
                <a
                  href="https://vk.com/bjjperm59"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#1e1e1e] hover:bg-[#3B82F6]/10 border border-[#2e2e2e] hover:border-[#3B82F6]/30 text-gray-300 hover:text-[#3B82F6] rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.188 1.341 1.26 2.14 1.816.605.421 1.064.329 1.064.329l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.268-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.115-.858-.009-1.585.003-1.996.208-.274.138-.485.445-.356.462.16.02.521.099.713.364.248.341.239 1.107.239 1.107s.142 2.11-.333 2.372c-.327.179-.776-.187-1.739-1.865-.493-.859-.866-1.812-.866-1.812s-.07-.176-.198-.271c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.161C3.94 8.176 4.043 8.5 4.043 8.5s1.793 4.261 3.821 6.408c1.861 1.972 3.977 1.841 3.977 1.841l.944-.012z"/>
                  </svg>
                  ВКонтакте
                </a>
                <a
                  href="https://wa.me/79958636285"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#1e1e1e] hover:bg-[#3B82F6]/10 border border-[#2e2e2e] hover:border-[#3B82F6]/30 text-gray-300 hover:text-[#3B82F6] rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
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
