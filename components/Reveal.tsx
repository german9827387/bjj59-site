"use client";
import { useEffect, useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
  style?: React.CSSProperties;
}

/** Шаг каскада и его потолок: с двенадцатью карточками последняя иначе
 *  появлялась бы почти через секунду после первой — это уже не приём, а
 *  ожидание. */
const STEP_MS = 70;
const MAX_TOTAL_MS = 420;

/** Сетка считается сеткой от трёх элементов: две карточки, разъезжающиеся
 *  по очереди, читаются как сбой, а не как замысел. */
const MIN_ITEMS = 3;

/** Верхняя граница: длинная лента (карусель, галерея) — не сетка карточек,
 *  и каскад в ней читается как подгрузка, а не как оформление. */
const MAX_ITEMS = 10;

/**
 * Ищет ряд однотипных элементов, который стоит показать каскадом.
 *
 * Смотрим на сам блок и на два уровня внутрь — глубже в вёрстке начинается
 * содержимое карточек, и каскад там превратился бы в дребезг. Опора на
 * вычисленный `display`, а не на классы: разметку это не трогает и переживёт
 * любую перестановку утилит.
 */
function findStaggerRow(root: HTMLElement): HTMLElement[] | null {
  const queue: Array<{ el: HTMLElement; depth: number }> = [{ el: root, depth: 0 }];

  while (queue.length) {
    const { el, depth } = queue.shift() as { el: HTMLElement; depth: number };
    const kids = Array.from(el.children).filter(
      (c): c is HTMLElement => c instanceof HTMLElement
    );

    if (kids.length >= MIN_ITEMS && kids.length <= MAX_ITEMS) {
      const display = getComputedStyle(el).display;
      if (display === "grid" || display === "flex") return kids;
    }

    if (depth < 2) {
      for (const kid of kids) queue.push({ el: kid, depth: depth + 1 });
    }
  }
  return null;
}

export default function Reveal({ children, className = "", delay = 0, style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Каскад готовим до наблюдателя: если расставить задержки в момент
    // пересечения, первый кадр уйдёт с уже видимыми карточками и движение
    // будет пропущено.
    const row = calm ? null : findStaggerRow(el);
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    if (row) {
      // Двигаются карточки, а не блок целиком: иначе движение складывается
      // само с собой и выглядит как рывок.
      el.classList.add("reveal-has-stagger");
      row.forEach((item, i) => {
        const wait = Math.min(i * STEP_MS, MAX_TOTAL_MS);
        item.classList.add("reveal-stagger-item");
        item.style.transition =
          `opacity var(--dur-stagger) var(--ease-out-expo) ${wait}ms,` +
          `transform var(--dur-stagger) var(--ease-out-expo) ${wait}ms`;
      });
    }

    let shown = false;

    const show = () => {
      if (shown) return;
      shown = true;
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);

      timers.push(
        setTimeout(() => {
          el.classList.add("reveal-visible");
          row?.forEach((item) => item.classList.remove("reveal-stagger-item"));

          // Инлайновый transition снимаем после показа: он перебивал бы
          // собственные переходы карточки, и наведение стало бы вялым.
          timers.push(
            setTimeout(() => {
              el.classList.add("reveal-done");
              row?.forEach((item) => {
                item.style.transition = "";
              });
            }, MAX_TOTAL_MS + 900)
          );
        }, delay)
      );
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) show();
      },
      { rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(el);

    /**
     * Запасной путь по геометрии.
     *
     * `IntersectionObserver` учитывает обрезку предками: блок внутри
     * контейнера с `overflow: clip` не пересекается с экраном никогда, сколько
     * его ни прокручивай. На этой странице такие есть — и до появления этой
     * проверки их содержимое навсегда оставалось с `opacity: 0`, то есть
     * человек просто не видел кусок страницы.
     *
     * Здесь смотрим на собственный прямоугольник элемента, а не на
     * пересечение: обрезка на него не влияет.
     */
    let queued = false;
    const onScroll = () => {
      if (queued || shown) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        if (shown) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 40 && rect.bottom > 0) show();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      timers.forEach(clearTimeout);
    };
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </div>
  );
}
