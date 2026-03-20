"use client";

import { Plus, X, Calendar, Send } from "lucide-react";
import { useState } from "react";
import LeadModal from "./LeadModal";

const TG_URL = "https://t.me/+79958636285";

export default function MobileCTA() {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const items = [
    {
      label: "Написать в Telegram",
      icon: <Send className="w-5 h-5 text-white" />,
      color: "bg-[#229ED9]",
      onClick: () => { setOpen(false); window.open(TG_URL, "_blank"); },
    },
    {
      label: "Записаться бесплатно",
      icon: <Calendar className="w-5 h-5 text-white" />,
      color: "bg-blue-600",
      onClick: () => { setOpen(false); setModalOpen(true); },
    },
  ];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 md:hidden flex flex-col items-end gap-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 transition-all duration-300"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(16px)",
              pointerEvents: open ? "auto" : "none",
              transitionDelay: open ? `${i * 60}ms` : "0ms",
            }}
          >
            <span className="bg-[#111]/90 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full border border-[#2a2a2a] whitespace-nowrap shadow">
              {item.label}
            </span>
            <button
              onClick={item.onClick}
              className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center shadow-lg active:scale-95 transition-transform`}
            >
              {item.icon}
            </button>
          </div>
        ))}

        {/* Главная кнопка */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shadow-2xl shadow-blue-500/40 flex items-center justify-center text-white hover:scale-110 transition-transform"
          aria-label="Меню"
        >
          <div className={`transition-transform duration-300 ${open ? "rotate-45" : "rotate-0"}`}>
            {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </div>
        </button>
      </div>

      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
