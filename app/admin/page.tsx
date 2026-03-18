import Link from "next/link";
import { Users, Layers, Star, Tag, Settings, ArrowRight } from "lucide-react";
import RevalidateScheduleButton from "./RevalidateScheduleButton";

const SECTIONS = [
  { href: "/admin/trainers", label: "Тренеры", icon: Users, desc: "Редактировать профили тренеров, расписание, достижения" },
  { href: "/admin/directions", label: "Направления", icon: Layers, desc: "Название, описание и фото для каждого вида (BJJ, MMA...)" },
  { href: "/admin/reviews", label: "Отзывы", icon: Star, desc: "Добавить, удалить или изменить отзывы клиентов" },
  { href: "/admin/pricing", label: "Цены", icon: Tag, desc: "Стоимость занятий, абонементов, специальные предложения" },
  { href: "/admin/settings", label: "Настройки сайта", icon: Settings, desc: "Контакты, адрес, заголовки, статистика Hero-секции" },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
          <h1 className="text-white text-2xl sm:text-3xl font-black">Добро пожаловать 👋</h1>
          <RevalidateScheduleButton />
        </div>
        <p className="text-gray-500 text-sm">Управляйте контентом сайта bjj59.ru из одного места.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {SECTIONS.map(({ href, label, icon: Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="group bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5 hover:border-blue-500/30 hover:bg-[#111] transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Icon size={20} className="text-blue-400" />
              </div>
              <ArrowRight size={16} className="text-gray-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all mt-1" />
            </div>
            <h2 className="text-white font-bold text-base mb-1">{label}</h2>
            <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
        <h3 className="text-blue-300 font-bold text-sm mb-2">💡 Как добавить фото</h3>
        <ol className="text-gray-400 text-sm space-y-1 list-decimal list-inside">
          <li>Положи фото тренеров в папку <code className="text-blue-300 bg-blue-500/10 px-1 rounded">public/trainers/</code></li>
          <li>Для направлений — в <code className="text-blue-300 bg-blue-500/10 px-1 rounded">public/directions/</code></li>
          <li>Для видео — <code className="text-blue-300 bg-blue-500/10 px-1 rounded">public/video/hero.mp4</code></li>
          <li>Укажи путь в разделе <strong className="text-white">Тренеры</strong> или <strong className="text-white">Направления</strong> здесь в админке</li>
        </ol>
      </div>
    </div>
  );
}
