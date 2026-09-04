"use client";

import { MessageCircle, X, Send, Phone } from "lucide-react";
import { useState } from "react";
import { reachGoal } from "@/lib/lead-utils";
import { TG_URL, MAX_URL, PHONE_URL } from "@/lib/contacts";


export default function MobileCTA() {
  const [open, setOpen] = useState(false);

  const items = [
    {
      label: "Позвонить нам",
      icon: <Phone className="w-5 h-5 text-white" />,
      color: "bg-emerald-600",
      onClick: () => { setOpen(false); reachGoal("phone_click"); window.location.href = PHONE_URL; },
    },
    {
      label: "Написать в Telegram",
      icon: <Send className="w-5 h-5 text-white" />,
      color: "bg-[#229ED9]",
      // Ссылка, а не window.open: клик по `t.me/GSAcademy59` перехватывает
      // TgLinkHandler — он же добавляет в сообщение источник и считает цель.
      href: TG_URL,
      onClick: () => setOpen(false),
    },
    {
      label: "Написать в MAX",
      icon: <span className="text-white font-black text-lg leading-none">M</span>,
      color: "bg-[#168ACD]",
      onClick: () => { setOpen(false); reachGoal("max_click"); window.open(MAX_URL, "_blank"); },
    },
  ];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
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
            <span className="bg-[#111]/90 backdrop-blur text-white text-xs px-3 py-1.5 rounded-md border border-[#2a2a2a] whitespace-nowrap shadow flex items-center gap-2">
              {item.label}
            </span>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={item.onClick}
                aria-label={item.label}
                className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center shadow-lg active:scale-95 transition-transform`}
              >
                {item.icon}
              </a>
            ) : (
              <button
                onClick={item.onClick}
                aria-label={item.label}
                className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center shadow-lg active:scale-95 transition-transform`}
              >
                {item.icon}
              </button>
            )}
          </div>
        ))}

        {/* Главная кнопка */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shadow-2xl shadow-blue-500/40 flex items-center justify-center text-white hover:scale-110 transition-transform pointer-events-auto"
          aria-label="Меню"
        >
          <div className={`transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`}>
            {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </div>
        </button>
      </div>
    </>
  );
}
