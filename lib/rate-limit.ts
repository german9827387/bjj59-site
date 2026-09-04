/**
 * Ограничитель частоты в памяти процесса.
 *
 * На Vercel каждый инстанс функции держит свою таблицу, а холодный старт её
 * обнуляет — поэтому это не железная стена, а сито: одиночный скрипт,
 * бьющий в один инстанс, оно режет полностью, распределённую атаку —
 * только частично. Для сайта зала этого достаточно; если спам пробьётся,
 * следующий шаг — Upstash Ratelimit с общим Redis.
 *
 * Все три API (заявки, чат, вход в админку) раньше держали по своей копии
 * такой же `Map` — теперь одна.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Сколько ключей держим, чтобы таблица не росла бесконечно под перебором IP. */
const MAX_KEYS = 5000;

function sweep(now: number): void {
  if (buckets.size < MAX_KEYS) return;
  for (const [key, b] of buckets) {
    if (now > b.resetAt) buckets.delete(key);
  }
  // Если живых ключей всё равно слишком много — жертвуем самыми старыми.
  if (buckets.size >= MAX_KEYS) {
    const drop = buckets.size - MAX_KEYS + 500;
    let i = 0;
    for (const key of buckets.keys()) {
      if (i++ >= drop) break;
      buckets.delete(key);
    }
  }
}

/**
 * `true` — запрос пропускаем, `false` — лимит исчерпан.
 *
 * @param key    что ограничиваем: `lead:ip:1.2.3.4`, `lead:phone:79…`
 * @param limit  сколько раз за окно
 * @param windowMs длина окна
 */
export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  sweep(now);
  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count++;
  return true;
}

/** IP клиента: на Vercel первый адрес в `x-forwarded-for` ставит платформа. */
export function clientIp(headers: Headers): string {
  return (
    headers.get("x-real-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/**
 * Был ли ключ отмечен за последнее окно — без учёта попытки.
 *
 * Нужен там, где отметку ставят только после успеха: дубль по телефону
 * нельзя записывать до отправки в Telegram, иначе неудачная первая
 * попытка «съест» ретрай клиента, и заявка пропадёт молча.
 */
export function recent(key: string): boolean {
  const b = buckets.get(key);
  return !!b && Date.now() <= b.resetAt;
}

export function mark(key: string, windowMs: number): void {
  buckets.set(key, { count: 1, resetAt: Date.now() + windowMs });
}
