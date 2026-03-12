"use client";

import { useEffect } from "react";

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
    // Сохраняем UTM в sessionStorage при первом заходе
    const params = new URLSearchParams(window.location.search);
    const utm_source = params.get("utm_source");
    const utm_campaign = params.get("utm_campaign");
    const utm_medium = params.get("utm_medium");

    if (utm_source) sessionStorage.setItem("utm_source", utm_source);
    if (utm_campaign) sessionStorage.setItem("utm_campaign", utm_campaign);
    if (utm_medium) sessionStorage.setItem("utm_medium", utm_medium);

    // Перехватываем клики по TG-ссылкам и добавляем UTM в текст
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (!href.includes("t.me/GSAcademy59")) return;

      e.preventDefault();

      const source = sessionStorage.getItem("utm_source");
      const campaign = sessionStorage.getItem("utm_campaign");

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
      if (typeof window !== "undefined" && (window as any).ym) {
        (window as any).ym(
          (window as any).__YM_COUNTER_ID__,
          "reachGoal",
          "tg_click"
        );
      }

      window.open(finalUrl, "_blank", "noopener,noreferrer");
    }

    // Отслеживаем клики по номеру телефона
    function handlePhoneClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (!href.startsWith("tel:")) return;

      if (typeof window !== "undefined" && (window as any).ym) {
        (window as any).ym(
          (window as any).__YM_COUNTER_ID__,
          "reachGoal",
          "phone_click"
        );
      }
    }

    document.addEventListener("click", handleClick);
    document.addEventListener("click", handlePhoneClick);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("click", handlePhoneClick);
    };
  }, []);

  return null;
}
