"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, ChevronDown, ChevronUp, GripVertical, Image as ImageIcon } from "lucide-react";

type Trainer = {
  id: string;
  name: string;
  image: string;
  role: string;
  belt: string;
  beltGradient: string;
  beltBadge: string;
  achievements: string[];
  schedule: { adults: string[]; children: string[] };
};

const BELT_OPTIONS = [
  { label: "Черный пояс", gradient: "from-gray-900 to-gray-700", badge: "bg-gray-800 text-gray-200" },
  { label: "Коричневый пояс", gradient: "from-amber-950 to-amber-700", badge: "bg-amber-800 text-amber-200" },
  { label: "Синий пояс", gradient: "from-blue-950 to-blue-800", badge: "bg-blue-900 text-blue-200" },
  { label: "Красный пояс", gradient: "from-red-950 to-red-800", badge: "bg-red-900 text-red-200" },
  { label: "Желтый пояс", gradient: "from-yellow-950 to-yellow-700", badge: "bg-yellow-900 text-yellow-200" },
  { label: "Другое", gradient: "from-gray-900 to-gray-700", badge: "bg-gray-800 text-gray-200" },
];

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 20) + "-" + Date.now().toString(36);
}

export default function AdminTrainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/trainers")
      .then((r) => r.json())
      .then((data) => { setTrainers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/trainers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trainers),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function addTrainer() {
    const id = slugify("trainer");
    const t: Trainer = {
      id,
      name: "Новый тренер",
      image: "",
      role: "",
      belt: "Черный пояс по BJJ",
      beltGradient: "from-gray-900 to-gray-700",
      beltBadge: "bg-gray-800 text-gray-200",
      achievements: [""],
      schedule: { adults: [], children: [] },
    };
    setTrainers((prev) => [...prev, t]);
    setExpanded(id);
  }

  function removeTrainer(id: string) {
    setTrainers((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTrainer(id: string, patch: Partial<Trainer>) {
    setTrainers((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function updateAchievement(trainerId: string, idx: number, value: string) {
    setTrainers((prev) =>
      prev.map((t) => {
        if (t.id !== trainerId) return t;
        const a = [...t.achievements];
        a[idx] = value;
        return { ...t, achievements: a };
      })
    );
  }

  function addAchievement(trainerId: string) {
    setTrainers((prev) =>
      prev.map((t) => (t.id === trainerId ? { ...t, achievements: [...t.achievements, ""] } : t))
    );
  }

  function removeAchievement(trainerId: string, idx: number) {
    setTrainers((prev) =>
      prev.map((t) => {
        if (t.id !== trainerId) return t;
        const a = t.achievements.filter((_, i) => i !== idx);
        return { ...t, achievements: a };
      })
    );
  }

  if (loading) return <div className="text-gray-500 text-sm">Загрузка...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-black">Тренеры</h1>
          <p className="text-gray-500 text-sm mt-0.5">{trainers.length} тренеров</p>
        </div>
        <div className="flex gap-3">
          <button onClick={addTrainer} className="flex items-center gap-2 bg-[#111] border border-[#2a2a2a] text-gray-300 hover:text-white text-sm font-medium px-4 py-2 rounded-xl transition-all hover:border-blue-500/40">
            <Plus size={16} />
            Добавить
          </button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm px-5 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60">
            <Save size={16} />
            {saving ? "Сохранение..." : saved ? "Сохранено ✓" : "Сохранить"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl overflow-hidden">
            {/* Header row */}
            <div
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
              onClick={() => setExpanded(expanded === trainer.id ? null : trainer.id)}
            >
              <GripVertical size={16} className="text-gray-700 shrink-0" />
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center shrink-0 border border-blue-500/20">
                {trainer.image ? (
                  <img src={trainer.image} alt="" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="text-blue-400 text-xs font-bold">
                    {trainer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm truncate">{trainer.name}</div>
                <div className="text-gray-500 text-xs truncate">{trainer.role || "—"}</div>
              </div>
              <span className="text-gray-600 text-xs hidden sm:block">{trainer.belt}</span>
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={(e) => { e.stopPropagation(); removeTrainer(trainer.id); }}
                  className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={14} />
                </button>
                {expanded === trainer.id ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
              </div>
            </div>

            {/* Expanded form */}
            {expanded === trainer.id && (
              <div className="border-t border-[#1a1a1a] p-4 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Имя">
                    <input value={trainer.name} onChange={(e) => updateTrainer(trainer.id, { name: e.target.value })} className="admin-input" />
                  </Field>
                  <Field label="Должность / роль">
                    <input value={trainer.role} onChange={(e) => updateTrainer(trainer.id, { role: e.target.value })} className="admin-input" />
                  </Field>
                  <Field label="Звание / пояс">
                    <input value={trainer.belt} onChange={(e) => updateTrainer(trainer.id, { belt: e.target.value })} className="admin-input" />
                  </Field>
                  <Field label="Цвет карточки">
                    <select
                      value={trainer.beltGradient}
                      onChange={(e) => {
                        const opt = BELT_OPTIONS.find((o) => o.gradient === e.target.value);
                        if (opt) updateTrainer(trainer.id, { beltGradient: opt.gradient, beltBadge: opt.badge });
                      }}
                      className="admin-input"
                    >
                      {BELT_OPTIONS.map((o) => (
                        <option key={o.gradient} value={o.gradient}>{o.label}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Фото (путь, напр. /trainers/german.jpg)">
                  <div className="flex gap-2">
                    <input value={trainer.image} onChange={(e) => updateTrainer(trainer.id, { image: e.target.value })} className="admin-input flex-1" placeholder="/trainers/german.jpg" />
                    {trainer.image && <img src={trainer.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-[#2a2a2a]" onError={(e) => (e.currentTarget.style.display = "none")} />}
                    {!trainer.image && <div className="w-10 h-10 rounded-lg border border-dashed border-[#333] flex items-center justify-center"><ImageIcon size={14} className="text-gray-600" /></div>}
                  </div>
                </Field>

                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-2">Достижения</label>
                  <div className="space-y-2">
                    {trainer.achievements.map((a, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input value={a} onChange={(e) => updateAchievement(trainer.id, idx, e.target.value)} className="admin-input flex-1" placeholder="Достижение..." />
                        <button onClick={() => removeAchievement(trainer.id, idx)} className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => addAchievement(trainer.id)} className="mt-2 flex items-center gap-1 text-blue-400 text-xs hover:text-blue-300 transition-colors">
                    <Plus size={13} /> Добавить достижение
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Расписание взрослых (через запятую)">
                    <input
                      value={trainer.schedule.adults.join(", ")}
                      onChange={(e) => updateTrainer(trainer.id, { schedule: { ...trainer.schedule, adults: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } })}
                      className="admin-input"
                      placeholder="ПН 19:00, СР 19:00, ПТ 19:00"
                    />
                  </Field>
                  <Field label="Расписание детей (через запятую)">
                    <input
                      value={trainer.schedule.children.join(", ")}
                      onChange={(e) => updateTrainer(trainer.id, { schedule: { ...trainer.schedule, children: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } })}
                      className="admin-input"
                      placeholder="ПН 18:00, СР 18:00"
                    />
                  </Field>
                </div>
              </div>
            )}
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
