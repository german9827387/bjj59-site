"use client";

import { MessageCircle, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Reveal from "./Reveal";
import LeadModal from "./LeadModal";

const TG_URL = `https://t.me/GSAcademy59?text=${encodeURIComponent('Здравствуйте! Пишу с сайта, хочу записаться на пробное занятие')}`;
const MAX_URL = "https://max.ru/u/f9LHodD0cOLuAXIcg9-hGCKGfQUdnBrwUFaDAOL8u57Ecr8xdBN439inrnY";

export default function CTA() {
  const [modalOpen, setModalOpen] = useState(false);
  const [messengerOpen, setMessengerOpen] = useState(false);
  const messengerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (messengerRef.current && !messengerRef.current.contains(e.target as Node)) {
        setMessengerOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <section className="section-dark py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#3B82F6]/10 via-[#0d0d0d] to-[#0d0d0d] border border-[#3B82F6]/20 p-8 sm:p-12 lg:p-16 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-3xl" />
          <Reveal className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
              <span className="text-[#3B82F6] text-xs font-medium uppercase tracking-widest">Остались вопросы?</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              Перезвоним и ответим<br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">за 5 минут</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
              Оставьте заявку или напишите нам — поможем выбрать направление, подберём расписание и запишем на бесплатное занятие
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-4 px-10 rounded-full text-lg hover:opacity-90 transition-all hover:scale-105 shadow-2xl shadow-[#3B82F6]/20"
              >
                Оставить заявку
              </button>
              <div ref={messengerRef} className="relative">
                <button
                  onClick={() => setMessengerOpen((o) => !o)}
                  className="flex items-center justify-center gap-2 border border-[#3B82F6]/40 text-[#3B82F6] font-bold py-4 px-10 rounded-full text-lg hover:bg-[#3B82F6]/10 transition-all"
                >
                  <MessageCircle size={18} />
                  Написать нам
                  <ChevronDown size={14} className={`transition-transform ${messengerOpen ? "rotate-180" : ""}`} />
                </button>
                {messengerOpen && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#111]/95 backdrop-blur border border-[#2a2a2a] rounded-2xl p-2 min-w-[200px] shadow-xl z-20">
                    <a
                      href={TG_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-500/10 transition-colors text-gray-200 hover:text-white text-sm font-medium"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#229ED9] shrink-0">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      Telegram
                    </a>
                    <a
                      href={MAX_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-500/10 transition-colors text-gray-200 hover:text-white text-sm font-medium"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#168ACD] flex items-center justify-center shrink-0">
                        <span className="text-white text-[10px] font-bold leading-none">M</span>
                      </span>
                      MAX
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
