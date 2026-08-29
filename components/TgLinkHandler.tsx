"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { currentSource, hit, persistUtm, reachGoal, reachGoalOnce } from "@/lib/lead-utils";

// Названия UTM-источников для подстановки в сообщение
const SOURCE_LABELS: Record<string, string> = {
  vk: "ВКонтакте",
  instagram: "Instagram",
  yandex: "Яндекс",
  google: "Google",
  tg: "Telegram",
  telegram: "Telegram",
  direct: "прямой переход",
};

/**
 * Страницы, где глубина прокрутки что-то значит.
 *
 * Обработчик живёт в общем layout, то есть на всех страницах сразу. Без этого
 * списка `scroll_90` срабатывал на коротком «Согласии на обработку данных»
 * прямо при загрузке и на каждом заходе в админку — цель показывала не
 * вовлечённость, а длину страницы.
 */
const SCROLL_PAGES = new Set([
  "/",
  "/bjj",
  "/boxing",
  "/mma",
  "/muaythai",
  "/grappling",
  "/schedule",
  "/gift",
]);

/**
 * Картографические сервисы — все, а не только Яндекс.
 *
 * Короткие ссылки (`maps.app.goo.gl`, `go.2gis.com`) не содержат слова «maps»
 * в пути, поэтому проверяются по хосту отдельно.
 */
const MAPS_RE =
  /(^|\/\/|\.)(yandex\.[a-z.]+\/maps|google\.[a-z.]+\/maps|2gis\.[a-z]+|go\.2gis\.com|maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\.[a-z.]+)/;

/** Внешние ссылки, клик по которым — отдельная цель. */
function outboundGoal(href: string): string | null {
  if (href.startsWith("tel:")) return "phone_click";
  if (MAPS_RE.test(href)) {
    // «Читаю отзывы» и «еду в зал» — разные стадии, мешать их в одну цель
    // нельзя: первая говорит о сомнениях, вторая почти о приходе.
    return /\/reviews/.test(href) ? "reviews_click" : "maps_click";
  }
  if (href.includes("vk.com")) return "vk_click";
  if (href.includes("max.ru")) return "max_click";
  return null;
}

export default function TgLinkHandler() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (isAdmin) return;

    // Запоминаем источник. Обработчик висит в layout, то есть на каждой
    // странице, — поэтому метки сохраняются везде, а не только там, где
    // отрисована форма. Раньше здесь лежала своя копия этой логики на
    // sessionStorage и всего с тремя ключами из пяти: два места правды на
    // один вопрос, и утерянные utm_content с utm_term.
    persistUtm();

    // Перехватываем клики по TG-ссылкам и добавляем UTM в текст
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (!href.includes("t.me/GSAcademy59")) return;

      e.preventDefault();

      const { source, campaign } = currentSource();

      const url = new URL(href);
      const existingText = url.searchParams.get("text") || "";

      let fullText = existingText;
      if (source) {
        const label = SOURCE_LABELS[source.toLowerCase()] ?? source;
        fullText += ` [${label}${campaign ? ` / ${campaign}` : ""}]`;
      }

      // Используем encodeURIComponent чтобы пробелы стали %20, а не +
      // (мобильный Telegram не декодирует + как пробел)
      const finalUrl =
        url.origin + url.pathname + "?text=" + encodeURIComponent(fullText);

      // Цель в Яндекс Метрике
      reachGoal("tg_click");

      window.open(finalUrl, "_blank", "noopener,noreferrer");
    }

    /**
     * Остальные внешние ссылки — одним обработчиком.
     *
     * Раньше цели навешивались точечно через onClick, и каждая новая ссылка
     * их теряла: MAX в футере и обе ссылки на Яндекс Карты не считались
     * вовсе. А клик по карте — это человек, который собрался ехать в зал.
     */
    function handleOutbound(e: MouseEvent) {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;
      const goal = outboundGoal(anchor.getAttribute("href") || "");
      if (goal) reachGoal(goal);
    }

    document.addEventListener("click", handleClick);
    document.addEventListener("click", handleOutbound);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("click", handleOutbound);
    };
  }, [isAdmin]);

  /**
   * Просмотры при клиентской навигации.
   *
   * Счётчик считает просмотр только при загрузке документа, а переходы по
   * `next/link` документ не перезагружают. Из-за этого визит из трёх страниц
   * приходил в Метрику как один просмотр: страниц направлений не было в
   * отчётах, глубина и время на сайте занижались, а цели «просмотр URL» не
   * срабатывали ни разу.
   */
  const prevPath = useRef<string | null>(null);
  useEffect(() => {
    if (!pathname || isAdmin) return;

    // Первый рендер — просмотр уже отправлен инициализацией счётчика.
    if (prevPath.current === null) {
      prevPath.current = window.location.href;
    } else if (prevPath.current !== window.location.href) {
      hit(window.location.href, prevPath.current);
      prevPath.current = window.location.href;
    }

    if (pathname === "/schedule") reachGoalOnce("schedule_view");
  }, [pathname, isAdmin]);

  // Глубина прокрутки: без неё не отличить «форму не увидели» от
  // «увидели и не заполнили» — а это разные проблемы с разными решениями.
  useEffect(() => {
    if (!pathname || !SCROLL_PAGES.has(pathname)) return;

    function onScroll() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const seen = window.scrollY / total;
      if (seen >= 0.25) reachGoalOnce("scroll_25");
      if (seen >= 0.5) reachGoalOnce("scroll_50");
      if (seen >= 0.75) reachGoalOnce("scroll_75");
      if (seen >= 0.9) reachGoalOnce("scroll_90");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
