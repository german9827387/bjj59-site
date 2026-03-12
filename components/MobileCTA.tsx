"use client";

import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function MobileCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (!dismissed) setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-50 md:hidden transition-all duration-300 ${
        visible && !dismissed ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
          <div className="bg-[#0d0d0d]/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-3 flex items-center gap-3 shadow-2xl shadow-blue-500/10">
            <a
              href={`https://t.me/GSAcademy59?text=${encodeURIComponent('Здравствуйте! Пишу с сайта, хочу записаться на пробное занятие')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-opacity active:scale-95"
            >
              <MessageCircle size={16} className="shrink-0" />
              Записаться бесплатно
            </a>
            <button
              onClick={() => setDismissed(true)}
              className="p-2.5 rounded-xl border border-[#2a2a2a] text-gray-500 hover:text-gray-300 hover:border-[#333] transition-all shrink-0"
              aria-label="Закрыть"
            >
              <X size={16} />
            </button>
      </div>
    </div>
  );
}
