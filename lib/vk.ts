/** Минимальные типы ответа VK API wall.get — только то, что реально читаем. */

export interface VkPhotoSize {
  type: string;
  url: string;
}

export interface VkAttachment {
  type: string;
  photo?: { sizes?: VkPhotoSize[] };
}

export interface VkWallItem {
  id: number;
  text?: string;
  date: number;
  attachments?: VkAttachment[];
}

export interface VkWallResponse {
  response?: { items?: VkWallItem[] };
  error?: { error_msg?: string; error_code?: number };
}

/**
 * Берёт из вложения самую подходящую по размеру картинку.
 * Порядок предпочтения — «x», затем «r», иначе последняя доступная.
 */
export function pickPhotoUrl(attachment: VkAttachment): string | null {
  const sizes = attachment.photo?.sizes ?? [];
  const img =
    sizes.find((s) => s.type === "x") ??
    sizes.find((s) => s.type === "r") ??
    sizes[sizes.length - 1];
  return img?.url ?? null;
}
