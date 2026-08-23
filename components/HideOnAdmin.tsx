"use client";

import { usePathname } from "next/navigation";

/**
 * Прячет обвязку сайта на страницах админки.
 *
 * Корневой layout рисует шапку, подвал, чат и плавающие кнопки для всех
 * страниц подряд — включая /admin, где у панели своё меню. Из-за этого
 * навигация сайта наезжала на админку.
 */
export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
