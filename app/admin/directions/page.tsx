"use client";

import { useEffect, useState } from "react";
import { Save, Image as ImageIcon } from "lucide-react";

type Direction = {
  slug: string;
  title: string;
  short: string;
  desc: string;
  emoji: string;
  image: string;
  gradient: string;
};

const GRADIENT_OPTIONS = [
  { label: "Синий (BJJ)", value: "from-blue-950 via-blue-900 to-slate-900" },
  { label: "Оранжевый (MMA)", value: "from-orange-950 via-red-950 to-slate-900" },
  { label: "Красный (Бокс)", value: "from-red-950 via-rose-950 to-slate-900" },
  { label: "Индиго (Грэпплинг)", value: "from-indigo-950 via-indigo-900 to-slate-900" },
  { label: "Бирюзовый (Муай-тай)", value: "from-teal-950 via-cyan-950 to-slate-900" },
];

export default function AdminDirections() {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/directions").then((r) => r.json()).then((d) => { setDirections(d); setLoading(false); });
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/directions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(directions) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  }

  function update(slug: string, patch: Partial<Direction>) {
    setDirections((prev) => prev.map((d) => (d.slug === slug ? { ...d, ...patch } : d)));
  }

  if (loading) return <div className="text-gray-500 text-sm">Загрузка...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-black">Направления</h1>
          <p className="text-gray-500 text-sm mt-0.5">{directions.length} направлений</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm px-5 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60">
          <Save size={16} />
          {saving ? "Сохранение..." : saved ? "Сохранено ✓" : "Сохранить"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {directions.map((d) => (
          <div key={d.slug} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5 space-y-4">
            {/* Preview */}
            <div className={`h-28 rounded-xl bg-gradient-to-br ${d.gradient} flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "repeating-linear-gradient(-45deg,#fff 0,#fff 1px,transparent 0,transparent 8px)" }} />
              {d.image ? (
                <img src={d.image} alt={d.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <span className="text-5xl opacity-40 select-none">{d.emoji}</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3">
                <span className="text-white font-black text-lg">{d.title}</span>
              </div>
              <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-0.5 text-xs text-blue-300 font-bold">{d.short}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Название">
                <input value={d.title} onChange={(e) => update(d.slug, { title: e.target.value })} className="admin-input" />
              </Field>
              <Field label="Аббревиатура">
                <input value={d.short} onChange={(e) => update(d.slug, { short: e.target.value })} className="admin-input" maxLength={5} />
              </Field>
              <Field label="Эмодзи">
                <input value={d.emoji} onChange={(e) => update(d.slug, { emoji: e.target.value })} className="admin-input" maxLength={4} />
              </Field>
              <Field label="Градиент фона">
                <select value={d.gradient} onChange={(e) => update(d.slug, { gradient: e.target.value })} className="admin-input">
                  {GRADIENT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Описание">
              <textarea value={d.desc} onChange={(e) => update(d.slug, { desc: e.target.value })} className="admin-input resize-none" rows={2} />
            </Field>

            <Field label="Фото (путь, напр. /directions/bjj.jpg)">
              <div className="flex gap-2">
                <input value={d.image} onChange={(e) => update(d.slug, { image: e.target.value })} className="admin-input flex-1" placeholder="/directions/bjj.jpg" />
                {d.image
                  ? <img src={d.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-[#2a2a2a]" onError={(e) => (e.currentTarget.style.display = "none")} />
                  : <div className="w-10 h-10 rounded-lg border border-dashed border-[#333] flex items-center justify-center"><ImageIcon size={14} className="text-gray-600" /></div>}
              </div>
            </Field>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-gray-400 text-xs font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}
