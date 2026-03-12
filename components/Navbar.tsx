"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { label: "Главная", href: "/" },
  { label: "Направления", href: "/#directions" },
  { label: "Тренеры", href: "/#trainers" },
  { label: "Расписание", href: "/schedule" },
  { label: "Цены", href: "/#pricing" },
  { label: "Контакты", href: "/#contacts" },
  { label: "Личный кабинет", href: "https://g-sacademy.vercel.app", external: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1e1e1e] shadow-xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 xl:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="GS Academy"
              width={120}
              height={40}
              quality={60}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden xl:flex items-center gap-5 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={link.external
                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-blue-400/50 transition-all duration-200 text-sm font-medium tracking-wide uppercase py-1.5 px-3 rounded-full"
                  : "text-gray-300 hover:text-[#3B82F6] transition-colors duration-200 text-sm font-medium tracking-wide uppercase"}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Phone */}
          <div className="hidden xl:flex items-center gap-4 ml-6">
            <a
              href="tel:+79958654244"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#3B82F6] transition-colors whitespace-nowrap"
            >
              <Phone size={16} />
              <span>8 (995) 865-42-44</span>
            </a>
            <a
              href={`https://t.me/GSAcademy59?text=${encodeURIComponent('Здравствуйте! Пишу с сайта, хочу записаться')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-black font-bold py-2 px-5 rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              Записаться
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="xl:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Меню"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden bg-[#0a0a0a]/98 backdrop-blur-md border-t border-[#1e1e1e]">
          <div className="px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={link.external
                  ? "text-blue-400 hover:text-blue-300 transition-colors py-2 text-base font-medium border-b border-[#1e1e1e]"
                  : "text-gray-300 hover:text-[#3B82F6] transition-colors py-2 text-base font-medium border-b border-[#1e1e1e]"}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <a
                href="tel:+79958654244"
                className="flex items-center gap-2 text-gray-300 hover:text-[#3B82F6] transition-colors"
              >
                <Phone size={16} />
                <span>8 (995) 865-42-44</span>
              </a>
              <a
                href={`https://t.me/GSAcademy59?text=${encodeURIComponent('Здравствуйте! Пишу с сайта, хочу записаться')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-black font-bold py-3 px-6 rounded-full text-center"
              >
                Записаться бесплатно
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
