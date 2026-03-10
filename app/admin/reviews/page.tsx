"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Star } from "lucide-react";

type Review = {
  id: string;
  name: string;
  date: string;
  rating: number;
  text: string;
};

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={18}
            className={(hovered ? n <= hovered : n <= value) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}
          />
        </button>
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/reviews").then((r) => r.json()).then((d) => { setReviews(d); setLoading(false); });
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(reviews) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  }

  function update(id: string, patch: Partial<Review>) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function remove(id: string) {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  function add() {
    const newReview: Review = {
      id: Date.now().toString(),
      name: "Новый отзыв",
      date: new Date().toLocaleDateString("ru-RU", { year: "numeric", month: "long" }),
      rating: 5,
      text: "",
    };
    setReviews((prev) => [...prev, newReview]);
  }

  if (loading) return <div className="text-gray-500 text-sm">Загрузка...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-black">Отзывы</h1>
          <p className="text-gray-500 text-sm mt-0.5">{reviews.length} отзывов</p>
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
        {reviews.map((r) => (
          <div key={r.id} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Имя</label>
                    <input value={r.name} onChange={(e) => update(r.id, { name: e.target.value })} className="admin-input" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Дата</label>
                    <input value={r.date} onChange={(e) => update(r.id, { date: e.target.value })} className="admin-input" placeholder="Июнь 2024" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1.5">Рейтинг</label>
                  <StarRating value={r.rating} onChange={(v) => update(r.id, { rating: v })} />
                </div>
              </div>
              <button onClick={() => remove(r.id)} className="p-2 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors flex-shrink-0">
                <Trash2 size={16} />
              </button>
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5">Текст отзыва</label>
              <textarea value={r.text} onChange={(e) => update(r.id, { text: e.target.value })} className="admin-input resize-none" rows={4} placeholder="Текст отзыва..." />
            </div>

            {/* Preview */}
            <div className="bg-[#111] border border-[#222] rounded-xl p-4">
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map((n) => <Star key={n} size={12} className={n <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-700"} />)}
              </div>
              <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">&ldquo;{r.text || "..."}&rdquo;</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">{r.name[0]}</div>
                <div>
                  <span className="text-white text-xs font-semibold">{r.name}</span>
                  <span className="text-gray-600 text-xs ml-1.5">{r.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
