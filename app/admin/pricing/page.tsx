"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Star } from "lucide-react";

type PricingPlan = {
  id: string;
  title: string;
  price: string;
  unit: string;
  label: string;
  highlight: boolean;
  features: string[];
  cta: string;
};

export default function AdminPricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/pricing").then((r) => r.json()).then((d) => { setPlans(d); setLoading(false); });
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/pricing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(plans) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  }

  function update(id: string, patch: Partial<PricingPlan>) {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function remove(id: string) {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  }

  function add() {
    const newPlan: PricingPlan = {
      id: Date.now().toString(),
      title: "Новый тариф",
      price: "0",
      unit: "₽/месяц",
      label: "",
      highlight: false,
      features: ["Первая возможность"],
      cta: "Записаться",
    };
    setPlans((prev) => [...prev, newPlan]);
  }

  function addFeature(id: string) {
    setPlans((prev) => prev.map((p) => p.id === id ? { ...p, features: [...p.features, ""] } : p));
  }

  function updateFeature(id: string, idx: number, val: string) {
    setPlans((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const features = [...p.features];
      features[idx] = val;
      return { ...p, features };
    }));
  }

  function removeFeature(id: string, idx: number) {
    setPlans((prev) => prev.map((p) => p.id !== id ? p : { ...p, features: p.features.filter((_, i) => i !== idx) }));
  }

  if (loading) return <div className="text-gray-500 text-sm">Загрузка...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-black">Цены</h1>
          <p className="text-gray-500 text-sm mt-0.5">{plans.length} тарифов</p>
        </div>
        <div className="flex gap-3">
          <button onClick={add} className="flex items-center gap-2 border border-[#2a2a2a] text-gray-300 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-[#1a1a1a] transition-colors">
            <Plus size={16} /> Добавить
          </button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm px-5 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60">
            <Save size={16} />
            {saving ? "Сохранение..." : saved ? "Сохранено ✓" : "Сохранить"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {plans.map((p) => (
          <div key={p.id} className={`bg-[#0d0d0d] border rounded-2xl p-5 space-y-4 ${p.highlight ? "border-blue-500/50 ring-1 ring-blue-500/20" : "border-[#1a1a1a]"}`}>
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => update(p.id, { highlight: !p.highlight })}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${p.highlight ? "bg-blue-600/20 border-blue-500/50 text-blue-300" : "bg-[#1a1a1a] border-[#2a2a2a] text-gray-500"}`}
                >
                  <Star size={12} className={p.highlight ? "fill-blue-400 text-blue-400" : ""} />
                  {p.highlight ? "Популярный" : "Обычный"}
                </button>
              </div>
              <button onClick={() => remove(p.id)} className="p-2 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1.5">Название</label>
                <input value={p.title} onChange={(e) => update(p.id, { title: e.target.value })} className="admin-input" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1.5">Метка (напр. «Хит»)</label>
                <input value={p.label} onChange={(e) => update(p.id, { label: e.target.value })} className="admin-input" placeholder="Хит / Выгодно" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1.5">Цена</label>
                <input value={p.price} onChange={(e) => update(p.id, { price: e.target.value })} className="admin-input" placeholder="4 500" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1.5">Ед. измерения</label>
                <input value={p.unit} onChange={(e) => update(p.id, { unit: e.target.value })} className="admin-input" placeholder="₽/месяц" />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-400 text-xs font-medium mb-1.5">Текст кнопки</label>
                <input value={p.cta} onChange={(e) => update(p.id, { cta: e.target.value })} className="admin-input" />
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-400 text-xs font-medium">Что входит</label>
                <button onClick={() => addFeature(p.id)} className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                  <Plus size={12} /> Добавить
                </button>
              </div>
              <div className="space-y-2">
                {p.features.map((f, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input value={f} onChange={(e) => updateFeature(p.id, idx, e.target.value)} className="admin-input flex-1 text-xs" placeholder="Включённая возможность..." />
                    <button onClick={() => removeFeature(p.id, idx)} className="p-1.5 text-red-500/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini preview */}
            <div className={`rounded-xl p-3 text-center border ${p.highlight ? "bg-gradient-to-br from-blue-600/10 to-cyan-500/10 border-blue-500/30" : "bg-[#111] border-[#222]"}`}>
              {p.label && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold mb-1.5 inline-block">{p.label}</span>}
              <div className="text-white font-black text-xl">{p.price} <span className="text-gray-500 text-sm font-normal">{p.unit}</span></div>
              <div className="text-gray-400 text-xs">{p.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
