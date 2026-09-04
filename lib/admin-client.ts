/**
 * Сохранение из админки — одна функция на все разделы.
 *
 * Каждая страница делала `await fetch(...)` и ставила «Сохранено ✓», не
 * глядя на ответ. Здесь ответ читается, а состояние кнопки говорит правду:
 * сохранено (и сайт обновится через минуту-две) или ошибка с текстом.
 */
export type SaveState = "idle" | "saving" | "saved" | "error";

export async function saveAdminData(
  endpoint: string,
  data: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (res.ok && body.ok) return { ok: true };
    return { ok: false, error: body.error ?? `Ошибка ${res.status}` };
  } catch {
    return { ok: false, error: "Нет соединения" };
  }
}

/** Подпись на кнопке «Сохранить» по состоянию. */
export function saveLabel(state: SaveState): string {
  switch (state) {
    case "saving":
      return "Сохранение...";
    case "saved":
      return "Сохранено ✓ · сайт обновится через 1–2 мин";
    case "error":
      return "Ошибка ✗";
    default:
      return "Сохранить";
  }
}
