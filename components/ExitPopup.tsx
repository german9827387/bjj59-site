"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Phone, User, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

const SESSION_KEY = "exit_popup_shown";

function getUtm() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const v = p.get(key) || sessionStorage.getItem(key);
    if (v) utm[key] = v;
  }
  return utm;
}

function formatPhone(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  const d = digits.startsWith("7") ? digits : "7" + digits;
  const p = d.slice(1);
  let out = "+7";
  if (p.length > 0) out += " (" + p.slice(0, 3);
  if (p.length >= 3) out += ") " + p.slice(3, 6);
  if (p.length >= 6) out += "-" + p.slice(6, 8);
  if (p.length >= 8) out += "-" + p.slice(8, 10);
  return out;
}

export default function ExitPopup() {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const show = useCallback(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    setVisible(true);
    sessionStorage.setItem(SESSION_KEY, "1");
  }, []);

  const hide = useCallback(() => setVisible(false), []);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (mobile) {
      const t = setTimeout(show, 20_000);
      return () => clearTimeout(t);
    } else {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.relatedTarget === null || (e.clientY <= 10 && !e.relatedTarget)) show();
      };
      document.documentElement.addEventListener("mouseleave", handleMouseLeave);
      return () => document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Введите имя"); return; }
    if (phone.replace(/\D/g, "").length < 11) { setError("Введите номер полностью"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone, utm: getUtm(), source: isMobile ? "Мобильный поп-ап" : "Exit Intent поп-ап" }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) { setError(data.error ?? "Ошибка"); setLoading(false); return; }
      setSent(true);
      if (typeof window !== "undefined" && (window as any).ym) {
        (window as any).ym((window as any).__YM_COUNTER_ID__, "reachGoal", "lead_submit");
      }
    } catch {
      setError("Нет соединения.");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  // Мобильная версия — bottom sheet
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[200] flex items-end">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={hide} />
        <div className="relative w-full bg-[#0d1525] border-t border-blue-500/30 rounded-t-3xl p-6 pb-10 shadow-2xl z-10">
          <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
          <button onClick={hide} className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-gray-500 hover:text-white transition-all">
            <X size={14} />
          </button>
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 size={36} className="text-blue-400 mx-auto mb-3" />
              <p className="text-white font-bold text-lg">Заявка принята!</p>
              <p className="text-gray-400 text-sm mt-1">Перезвоним в течение 30 минут.</p>
            </div>
          ) : (
            <>
              <h2 className="text-white font-black text-xl mb-1">Первая тренировка — бесплатно</h2>
              <p className="text-gray-400 text-sm mb-5">Оставьте номер — перезвоним и запишем в группу</p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" value={name} onChange={e => { setName(e.target.value); setError(""); }} placeholder="Ваше имя" className="w-full bg-white/[0.05] border border-white/10 focus:border-blue-500/50 text-white placeholder-gray-600 rounded-xl py-3 pl-10 pr-4 outline-none text-sm" />
                </div>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="tel" value={phone} onChange={e => { setPhone(formatPhone(e.target.value)); setError(""); }} placeholder="+7 (000) 000-00-00" className="w-full bg-white/[0.05] border border-white/10 focus:border-blue-500/50 text-white placeholder-gray-600 rounded-xl py-3 pl-10 pr-4 outline-none text-sm" />
                </div>
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Записаться бесплатно</span><ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  // Десктопная версия — exit intent модал
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={hide} />
      <div className="relative w-full max-w-md bg-[#0d1525] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative p-8">
          <button onClick={hide} className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-gray-500 hover:text-white transition-all">
            <X size={14} />
          </button>
          {sent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={28} className="text-blue-400" />
              </div>
              <h3 className="text-white font-black text-xl mb-1">Заявка принята!</h3>
              <p className="text-gray-400 text-sm">Перезвоним в течение 30 минут.</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <span className="text-2xl mb-3 block">🥋</span>
                <h2 className="text-white font-black text-2xl leading-tight mb-2">Подождите — первое занятие бесплатно</h2>
                <p className="text-gray-400 text-sm">Оставьте номер — перезвоним, ответим на вопросы и запишем в группу без обязательств</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" value={name} onChange={e => { setName(e.target.value); setError(""); }} placeholder="Ваше имя" className="w-full bg-white/[0.04] border border-white/10 focus:border-blue-500/50 text-white placeholder-gray-600 rounded-xl py-3 pl-10 pr-4 outline-none text-sm" />
                </div>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="tel" value={phone} onChange={e => { setPhone(formatPhone(e.target.value)); setError(""); }} placeholder="+7 (000) 000-00-00" className="w-full bg-white/[0.04] border border-white/10 focus:border-blue-500/50 text-white placeholder-gray-600 rounded-xl py-3 pl-10 pr-4 outline-none text-sm" />
                </div>
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60 mt-1">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Записаться бесплатно</span><ArrowRight size={16} /></>}
                </button>
                <p className="text-gray-600 text-xs text-center">Нажимая кнопку, вы соглашаетесь с <a href="/privacy" className="underline hover:text-gray-400">политикой конфиденциальности</a></p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
