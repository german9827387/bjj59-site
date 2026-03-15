import { MessageCircle, Phone } from "lucide-react";
import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section className="section-dark py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#3B82F6]/10 via-[#0d0d0d] to-[#0d0d0d] border border-[#3B82F6]/20 p-8 sm:p-12 lg:p-16 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-3xl" />
          <Reveal className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
              <span className="text-[#3B82F6] text-xs font-medium uppercase tracking-widest">Первое занятие бесплатно</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              Запишитесь на<br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">бесплатное занятие</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
              И получите экипировку на первый урок в подарок. Попробуйте — вам точно понравится!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://t.me/GSAcademy59?text=${encodeURIComponent('Здравствуйте! Пишу с сайта, хочу записаться на пробное занятие')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-4 px-10 rounded-full text-lg hover:opacity-90 transition-all hover:scale-105 shadow-2xl shadow-[#3B82F6]/20"
              >
                <MessageCircle size={20} />
                Написать в Telegram
              </a>
              <a
                href="tel:+79958654244"
                className="flex items-center justify-center gap-2 border border-[#3B82F6]/40 text-[#3B82F6] font-bold py-4 px-10 rounded-full text-lg hover:bg-[#3B82F6]/10 transition-all"
              >
                <Phone size={20} />
                Позвонить
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
