"use client";

import { useState, useEffect } from "react";
import { X, Phone, User, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function LeadModal({ isOpen, onClose }: LeadModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Persist UTM params in sessionStorage on first load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const v = p.get(key);
      if (v) sessionStorage.setItem(key, v);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) { setSent(false); setName(""); setPhone(""); setError(""); }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const formatPhone = (val: string) => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Введите ваше имя"); return; }
    if (phone.replace(/\D/g, "").length < 11) { setError("Введите номер полностью"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone, utm: getUtm() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Ошибка отправки. Напишите нам в Telegram.");
        setLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Нет соединения. Попробуйте написать в Telegram.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0d1525] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-7 sm:p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all"
          >
            <X size={14} />
          </button>

          {sent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={30} className="text-blue-400" />
              </div>
              <h3 className="text-white font-black text-2xl mb-2">Заявка отправлена!</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Мы получили ваши данные. Перезвоним в течение 30 минут и подберём удобное время.
              </p>
              <button
                onClick={onClose}
                className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
              >
                Закрыть
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-blue-400 text-xs font-medium uppercase tracking-widest">Первое занятие бесплатно</span>
                </div>
                <h3 className="text-white font-black text-2xl sm:text-3xl leading-tight">
                  Запишитесь{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                    на пробное
                  </span>
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  Перезвоним за 30 минут и подберём удобное время
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(""); }}
                    placeholder="Ваше имя"
                    className="w-full bg-white/[0.04] border border-white/[0.10] hover:border-blue-500/30 focus:border-blue-500/50 text-white placeholder-gray-600 rounded-xl py-3.5 pl-11 pr-4 outline-none transition-colors text-sm"
                  />
                </div>

                <div className="relative">
                  <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(formatPhone(e.target.value)); setError(""); }}
                    placeholder="+7 (000) 000-00-00"
                    className="w-full bg-white/[0.04] border border-white/[0.10] hover:border-blue-500/30 focus:border-blue-500/50 text-white placeholder-gray-600 rounded-xl py-3.5 pl-11 pr-4 outline-none transition-colors text-sm"
                  />
                </div>

                {error && <p className="text-red-400 text-xs pl-1">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-[1.01] shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:scale-100 mt-1"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : (
                    <><span>Записаться бесплатно</span><ArrowRight size={17} /></>
                  )}
                </button>

                <p className="text-gray-600 text-xs text-center pt-1">
                  Нажимая кнопку, вы соглашаетесь с{" "}
                  <a href="/privacy" className="text-gray-500 hover:text-gray-400 underline underline-offset-2">
                    политикой конфиденциальности
                  </a>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
