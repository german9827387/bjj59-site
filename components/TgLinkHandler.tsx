"use client";

import { useEffect } from "react";
import { currentSource, persistUtm, reachGoal, reachGoalOnce } from "@/lib/lead-utils";

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

export default function TgLinkHandler() {
  useEffect(() => {
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

    // Отслеживаем клики по номеру телефона
    function handlePhoneClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (!href.startsWith("tel:")) return;

      reachGoal("phone_click");
    }

    // Отслеживаем клики по ВКонтакте
    function handleVkClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (!href.includes("vk.com")) return;

      reachGoal("vk_click");
    }

    document.addEventListener("click", handleClick);
    document.addEventListener("click", handlePhoneClick);
    document.addEventListener("click", handleVkClick);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("click", handlePhoneClick);
      document.removeEventListener("click", handleVkClick);
    };
  }, []);

  // Глубина прокрутки: без неё не отличить «форму не увидели» от
  // «увидели и не заполнили» — а это разные проблемы с разными решениями.
  useEffect(() => {
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
  }, []);

  return null;
}
