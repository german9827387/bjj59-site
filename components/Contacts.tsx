"use client";
import { MapPin, Phone, Clock } from "lucide-react";
import Reveal from "./Reveal";
import { useRef, useEffect, useState } from "react";

function LazyMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShow(true); observer.disconnect(); } },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="rounded-2xl overflow-hidden border border-[#1e2d45]" style={{ minHeight: "320px" }}>
      {show ? (
        <iframe
          src="https://yandex.ru/map-widget/v1/?ll=56.29609%2C58.001796&z=17&pt=56.29609,58.001796,pm2rdm&l=map"
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          title="Карта GSAcademy — г. Пермь, ул. Аркадия Гайдара 8б"
          className="w-full h-full"
          style={{ minHeight: "320px" }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#0d1525]" style={{ minHeight: "320px" }}>
          <span className="text-gray-600 text-sm">Загрузка карты...</span>
        </div>
      )}
    </div>
  );
}

export default function Contacts() {
  return (
    <section id="contacts" className="section-card py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Reveal>
            <span className="text-[#3B82F6] text-xs font-medium uppercase tracking-widest">
              Приходите к нам
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">
              Наши <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">контакты</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Info */}
          <div className="space-y-6">
            <div className="bg-[#0d1525] border border-[#1e2d45] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-[#3B82F6]" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Адрес</h3>
                  <p className="text-gray-400">г. Пермь, ул. Аркадия Гайдара 8б</p>
                  <a
                    href="https://yandex.com/maps/-/CPB8MK7w"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3B82F6] text-sm hover:underline mt-1 inline-block"
                  >
                    Открыть на Яндекс Картах →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-[#0d1525] border border-[#1e2d45] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-[#3B82F6]" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Часы работы</h3>
                  <p className="text-gray-400 text-sm">Пн–Пт: <span className="text-white">8:00–22:00</span></p>
                  <p className="text-gray-400 text-sm">Сб–Вс: <span className="text-white">9:00–20:00</span></p>
                  <a href="/schedule" className="text-[#3B82F6] text-sm hover:underline mt-1 inline-block">Расписание занятий →</a>
                </div>
              </div>
            </div>

            <div className="bg-[#0d1525] border border-[#1e2d45] rounded-2xl p-6">
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

          </div>

          {/* Map */}
          <LazyMap />
        </div>
      </div>
    </section>
  );
}
