"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";

type Stat = { target: number; suffix: string; label: string };
type SiteSettings = {
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: Stat[];
  };
  contacts: {
    address: string;
    phone: string;
    whatsappUrl: string;
    vkUrl: string;
    yandexMapsUrl: string;
    reviewsCount: number;
  };
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-gray-400 text-xs font-medium mb-1.5">{label}</label>
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

const DEFAULT_SETTINGS: SiteSettings = {
  hero: {
    badge: "🥋 Боевые искусства",
    titleLine1: "Стань",
    titleLine2: "сильнее",
    titleLine3: "в клубе",
    subtitle: "Профессиональные тренировки по BJJ, грэпплингу, MMA и боксу в Оренбурге",
    ctaPrimary: "Записаться на занятие",
    ctaSecondary: "Узнать расписание",
    stats: [
      { target: 8, suffix: "", label: "Тренеров" },
      { target: 5, suffix: "", label: "Направлений" },
      { target: 200, suffix: "+", label: "Учеников" },
      { target: 10, suffix: "", label: "Лет опыта" },
    ],
  },
  contacts: {
    address: "ул. Примерная, 1",
    phone: "+7 (999) 000-00-00",
    whatsappUrl: "https://wa.me/79990000000",
    vkUrl: "https://vk.com/bjj59",
    yandexMapsUrl: "",
    reviewsCount: 128,
  },
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => { setSettings(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  }

  function patchHero(patch: Partial<SiteSettings["hero"]>) {
    setSettings((s) => ({ ...s, hero: { ...s.hero, ...patch } }));
  }

  function patchContacts(patch: Partial<SiteSettings["contacts"]>) {
    setSettings((s) => ({ ...s, contacts: { ...s.contacts, ...patch } }));
  }

  function updateStat(idx: number, patch: Partial<Stat>) {
    const stats = [...settings.hero.stats];
    stats[idx] = { ...stats[idx], ...patch };
    patchHero({ stats });
  }

  function addStat() {
    patchHero({ stats: [...settings.hero.stats, { target: 0, suffix: "", label: "Новое" }] });
  }

  function removeStat(idx: number) {
    patchHero({ stats: settings.hero.stats.filter((_, i) => i !== idx) });
  }

  if (loading) return <div className="text-gray-500 text-sm">Загрузка...</div>;

  const { hero, contacts } = settings;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-black">Настройки сайта</h1>
          <p className="text-gray-500 text-sm mt-0.5">Hero секция и контакты</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm px-5 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60">
          <Save size={16} />
          {saving ? "Сохранение..." : saved ? "Сохранено ✓" : "Сохранить"}
        </button>
      </div>

      <div className="space-y-4">
        {/* Hero */}
        <SectionCard title="Hero — Главный экран">
          <Field label="Значок (badge)">
            <input value={hero.badge} onChange={(e) => patchHero({ badge: e.target.value })} className="admin-input" />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Заголовок строка 1">
              <input value={hero.titleLine1} onChange={(e) => patchHero({ titleLine1: e.target.value })} className="admin-input" />
            </Field>
            <Field label="Заголовок строка 2 (градиент)">
              <input value={hero.titleLine2} onChange={(e) => patchHero({ titleLine2: e.target.value })} className="admin-input" />
            </Field>
            <Field label="Заголовок строка 3">
              <input value={hero.titleLine3} onChange={(e) => patchHero({ titleLine3: e.target.value })} className="admin-input" />
            </Field>
          </div>
          <Field label="Подзаголовок">
            <textarea value={hero.subtitle} onChange={(e) => patchHero({ subtitle: e.target.value })} className="admin-input resize-none" rows={2} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Кнопка 1 (главная)">
              <input value={hero.ctaPrimary} onChange={(e) => patchHero({ ctaPrimary: e.target.value })} className="admin-input" />
            </Field>
            <Field label="Кнопка 2 (вторичная)">
              <input value={hero.ctaSecondary} onChange={(e) => patchHero({ ctaSecondary: e.target.value })} className="admin-input" />
            </Field>
          </div>

          {/* Stats */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-400 text-xs font-medium">Счётчики статистики</label>
              <button onClick={addStat} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
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
                  <button onClick={() => removeStat(idx)} className="text-red-500/50 hover:text-red-400 flex-shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Contacts */}
        <SectionCard title="Контакты">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Адрес">
              <input value={contacts.address} onChange={(e) => patchContacts({ address: e.target.value })} className="admin-input" />
            </Field>
            <Field label="Телефон">
              <input value={contacts.phone} onChange={(e) => patchContacts({ phone: e.target.value })} className="admin-input" placeholder="+7 (999) 000-00-00" />
            </Field>
            <Field label="WhatsApp URL">
              <input value={contacts.whatsappUrl} onChange={(e) => patchContacts({ whatsappUrl: e.target.value })} className="admin-input" placeholder="https://wa.me/7..." />
            </Field>
            <Field label="VK URL">
              <input value={contacts.vkUrl} onChange={(e) => patchContacts({ vkUrl: e.target.value })} className="admin-input" placeholder="https://vk.com/..." />
            </Field>
            <Field label="Яндекс.Карты URL">
              <input value={contacts.yandexMapsUrl} onChange={(e) => patchContacts({ yandexMapsUrl: e.target.value })} className="admin-input" placeholder="https://yandex.ru/maps/..." />
            </Field>
            <Field label="Кол-во отзывов (для Яндекс.Карт)">
              <input
                type="number"
                value={contacts.reviewsCount}
                onChange={(e) => patchContacts({ reviewsCount: Number(e.target.value) })}
                className="admin-input"
              />
            </Field>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
