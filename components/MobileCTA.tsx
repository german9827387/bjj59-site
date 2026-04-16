"use client";

import { MessageCircle, X, Send, Phone } from "lucide-react";
import { useState } from "react";

const TG_URL = "https://t.me/+79958636285";
const MAX_URL = "https://max.ru/u/f9LHodD0cOLuAXIcg9-hGCKGfQUdnBrwUFaDAOL8u57Ecr8xdBN439inrnY";
const PHONE_URL = "tel:+79958654244";

export default function MobileCTA() {
  const [open, setOpen] = useState(false);

  function openChat() {
    setOpen(false);
    window.dispatchEvent(new Event("open-chat"));
  }

  function ymGoal(goal: string) {
    const ym = (window as any).ym;
    const id = (window as any).__YM_COUNTER_ID__;
    if (ym && id) ym(id, "reachGoal", goal);
  }

  const items = [
    {
      label: "Позвонить нам",
      icon: <Phone className="w-5 h-5 text-white" />,
      color: "bg-emerald-600",
      onClick: () => { setOpen(false); ymGoal("phone_click"); window.location.href = PHONE_URL; },
    },
    {
      label: "Написать в Telegram",
      icon: <Send className="w-5 h-5 text-white" />,
      color: "bg-[#229ED9]",
      onClick: () => { setOpen(false); ymGoal("tg_click"); window.open(TG_URL, "_blank"); },
    },
    {
      label: "Написать в MAX",
      icon: <span className="text-white font-black text-lg leading-none">M</span>,
      color: "bg-[#168ACD]",
      onClick: () => { setOpen(false); ymGoal("tg_click"); window.open(MAX_URL, "_blank"); },
    },
    {
      label: "Алина онлайн",
      icon: <MessageCircle className="w-5 h-5 text-white" />,
      color: "bg-gradient-to-br from-blue-600 to-cyan-500",
      onClick: () => { ymGoal("chat_open"); openChat(); },
      badge: true,
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
            <span className="bg-[#111]/90 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full border border-[#2a2a2a] whitespace-nowrap shadow flex items-center gap-2">
              {item.badge && (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
              )}
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
