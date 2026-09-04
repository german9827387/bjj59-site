"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { saveAdminData, saveLabel, type SaveState } from "@/lib/admin-client";

/*
  Поля здесь — ровно те, что читает сайт (см. data/settings.json и
  components/Hero.tsx, Reviews.tsx, app/api/chat/route.ts).

  Прежняя версия страницы была скопирована из другого проекта: правила
  «WhatsApp URL», «VK URL», «titleLine1» — ключи, которых на сайте нет.
  Человек менял их, видел галочку, а на сайте ничего не менялось, потому
  что Hero читает `title1`, а футер — `vk`.
*/
type Stat = { target: number; suffix: string; label: string };

type SiteSettings = {
  hero: {
    badge: string;
    title1: string;
    title2: string;
    title3: string;
    subtitle: string;
    offer: string[];
    ctaPrimary: string;
    ctaSecondary: string;
    stats: Stat[];
  };
  contacts: {
    address: string;
    phone: string;
    phoneLink: string;
    telegram: string;
    vk: string;
    yandexMaps: string;
    yandexReviews: string;
    reviewsCount: string;
    reviewLinks: Record<string, string>;
  };
};

const REVIEW_PLATFORMS = ["Яндекс", "2ГИС", "Google", "ВКонтакте"];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-gray-400 text-xs font-medium mb-1.5">
        {label}
        {hint && <span className="text-gray-600 font-normal"> — {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6">
      <h2 className="text-white font-bold text-base mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/** `tel:` из того, что человек набрал в поле телефона: 8 (995) … → tel:+7995… */
function toPhoneLink(pretty: string): string {
  let digits = pretty.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  return digits ? `tel:+${digits}` : "";
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loadError, setLoadError] = useState("");
  const [save, setSave] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error ?? `Ошибка ${r.status}`);
        return d as SiteSettings;
      })
      .then((d) => {
        // Старые ключи (`titleLine1` и подобные) из прошлой версии админки
        // сайт не читает — при следующем сохранении они исчезнут.
        setSettings({
          hero: {
            badge: d.hero?.badge ?? "",
            title1: d.hero?.title1 ?? "",
            title2: d.hero?.title2 ?? "",
            title3: d.hero?.title3 ?? "",
            subtitle: d.hero?.subtitle ?? "",
            offer: d.hero?.offer ?? [],
            ctaPrimary: d.hero?.ctaPrimary ?? "",
            ctaSecondary: d.hero?.ctaSecondary ?? "",
            stats: (d.hero?.stats ?? []).map((s) => ({ target: s.target, suffix: s.suffix ?? "", label: s.label })),
          },
          contacts: {
            address: d.contacts?.address ?? "",
            phone: d.contacts?.phone ?? "",
            phoneLink: d.contacts?.phoneLink ?? "",
            telegram: d.contacts?.telegram ?? "",
            vk: d.contacts?.vk ?? "",
            yandexMaps: d.contacts?.yandexMaps ?? "",
            yandexReviews: d.contacts?.yandexReviews ?? "",
            reviewsCount: String(d.contacts?.reviewsCount ?? ""),
            reviewLinks: d.contacts?.reviewLinks ?? {},
          },
        });
      })
      .catch((e) => setLoadError((e as Error).message));
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSave("saving");
    setSaveError("");
    const r = await saveAdminData("/api/admin/settings", settings);
    if (r.ok) {
      setSave("saved");
      setTimeout(() => setSave("idle"), 6000);
    } else {
      setSave("error");
      setSaveError(r.error);
    }
  }

  function patchHero(patch: Partial<SiteSettings["hero"]>) {
    setSettings((s) => s && { ...s, hero: { ...s.hero, ...patch } });
  }

  function patchContacts(patch: Partial<SiteSettings["contacts"]>) {
    setSettings((s) => s && { ...s, contacts: { ...s.contacts, ...patch } });
  }

  function updateStat(idx: number, patch: Partial<Stat>) {
    if (!settings) return;
    const stats = [...settings.hero.stats];
    stats[idx] = { ...stats[idx], ...patch };
    patchHero({ stats });
  }

  function updateOffer(idx: number, value: string) {
    if (!settings) return;
    const offer = [...settings.hero.offer];
    offer[idx] = value;
    patchHero({ offer });
  }

  if (loadError) return <div className="text-red-400 text-sm">Не удалось загрузить настройки: {loadError}</div>;
  if (!settings) return <div className="text-gray-500 text-sm">Загрузка...</div>;

  const { hero, contacts } = settings;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-black">Настройки сайта</h1>
          <p className="text-gray-500 text-sm mt-0.5">Первый экран и контакты</p>
        </div>
        <button onClick={handleSave} disabled={save === "saving"} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm px-5 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60">
          <Save size={16} />
          {saveLabel(save)}
        </button>
      </div>

      {saveError && (
        <p className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">Не сохранилось: {saveError}</p>
      )}

      <div className="space-y-4">
        <SectionCard title="Первый экран">
          <Field label="Плашка над заголовком" hint="«Команда · N-кратные чемпионы» — число берётся из текста">
            <input value={hero.badge} onChange={(e) => patchHero({ badge: e.target.value })} className="admin-input" />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Заголовок, строка 1">
              <input value={hero.title1} onChange={(e) => patchHero({ title1: e.target.value })} className="admin-input" />
            </Field>
            <Field label="Строка 2" hint="серым">
              <input value={hero.title2} onChange={(e) => patchHero({ title2: e.target.value })} className="admin-input" />
            </Field>
            <Field label="Строка под заголовком">
              <input value={hero.title3} onChange={(e) => patchHero({ title3: e.target.value })} className="admin-input" />
            </Field>
          </div>
          <Field label="Подзаголовок" hint="можно оставить пустым">
            <textarea value={hero.subtitle} onChange={(e) => patchHero({ subtitle: e.target.value })} className="admin-input resize-none" rows={2} />
          </Field>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-400 text-xs font-medium">Что обещаем</label>
              <button onClick={() => patchHero({ offer: [...hero.offer, ""] })} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                <Plus size={12} /> Добавить
              </button>
            </div>
            <div className="space-y-2">
              {hero.offer.map((line, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input value={line} onChange={(e) => updateOffer(idx, e.target.value)} className="admin-input flex-1" />
                  <button onClick={() => patchHero({ offer: hero.offer.filter((_, i) => i !== idx) })} className="text-red-500/50 hover:text-red-400 shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Главная кнопка">
              <input value={hero.ctaPrimary} onChange={(e) => patchHero({ ctaPrimary: e.target.value })} className="admin-input" />
            </Field>
            <Field label="Вторая кнопка">
              <input value={hero.ctaSecondary} onChange={(e) => patchHero({ ctaSecondary: e.target.value })} className="admin-input" />
            </Field>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-400 text-xs font-medium">
                Счётчики
                <span className="text-gray-600 font-normal"> — «лет» считается от года открытия само, число здесь не используется</span>
              </label>
              <button onClick={() => patchHero({ stats: [...hero.stats, { target: 0, suffix: "", label: "Новое" }] })} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                <Plus size={12} /> Добавить
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {hero.stats.map((stat, idx) => (
                <div key={idx} className="bg-[#111] border border-[#222] rounded-xl p-3 flex items-center gap-2">
                  <input
                    type="number"
                    value={stat.target}
                    onChange={(e) => updateStat(idx, { target: Number(e.target.value) })}
                    className="w-16 bg-transparent text-white font-bold text-sm border-0 outline-none text-center"
                  />
                  <input
                    value={stat.suffix}
                    onChange={(e) => updateStat(idx, { suffix: e.target.value })}
                    className="w-8 bg-transparent text-blue-400 font-bold text-sm border-0 outline-none text-center"
                    placeholder="+"
                    maxLength={3}
                  />
                  <span className="text-gray-600 text-xs">—</span>
                  <input
                    value={stat.label}
                    onChange={(e) => updateStat(idx, { label: e.target.value })}
                    className="flex-1 bg-transparent text-gray-300 text-xs border-0 outline-none"
                    placeholder="Подпись..."
                  />
                  <button onClick={() => patchHero({ stats: hero.stats.filter((_, i) => i !== idx) })} className="text-red-500/50 hover:text-red-400 flex-shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Контакты">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Адрес">
              <input value={contacts.address} onChange={(e) => patchContacts({ address: e.target.value })} className="admin-input" />
            </Field>
            <Field label="Телефон" hint="как показывать на сайте">
              <input
                value={contacts.phone}
                onChange={(e) => patchContacts({ phone: e.target.value, phoneLink: toPhoneLink(e.target.value) })}
                className="admin-input"
                placeholder="8 (995) 865-42-44"
              />
            </Field>
            <Field label="Telegram" hint="один на весь сайт">
              <input value={contacts.telegram} onChange={(e) => patchContacts({ telegram: e.target.value })} className="admin-input" placeholder="https://t.me/..." />
            </Field>
            <Field label="ВКонтакте">
              <input value={contacts.vk} onChange={(e) => patchContacts({ vk: e.target.value })} className="admin-input" placeholder="https://vk.com/..." />
            </Field>
            <Field label="Карточка на Яндекс Картах">
              <input value={contacts.yandexMaps} onChange={(e) => patchContacts({ yandexMaps: e.target.value })} className="admin-input" placeholder="https://yandex.ru/maps/org/..." />
            </Field>
            <Field label="Отзывы на Яндекс Картах">
              <input value={contacts.yandexReviews} onChange={(e) => patchContacts({ yandexReviews: e.target.value })} className="admin-input" placeholder="https://yandex.ru/maps/org/.../reviews/" />
            </Field>
            <Field label="Сколько отзывов" hint="показывается в блоке отзывов">
              <input value={contacts.reviewsCount} onChange={(e) => patchContacts({ reviewsCount: e.target.value })} className="admin-input" placeholder="88" />
            </Field>
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-medium mb-2">
              Ссылки «оставить отзыв»
              <span className="text-gray-600 font-normal"> — пустую площадку сайт не показывает</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {REVIEW_PLATFORMS.map((platform) => (
                <Field key={platform} label={platform}>
                  <input
                    value={contacts.reviewLinks[platform] ?? ""}
                    onChange={(e) => patchContacts({ reviewLinks: { ...contacts.reviewLinks, [platform]: e.target.value } })}
                    className="admin-input"
                    placeholder="https://..."
                  />
                </Field>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
