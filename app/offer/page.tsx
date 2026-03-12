import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Публичная оферта | GSAcademy",
  description: "Публичная оферта GSAcademy на оказание физкультурно-оздоровительных услуг в Перми.",
  robots: { index: false },
};

export default function OfferPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C9A84C] transition-colors text-sm mb-8">
          <ArrowLeft size={16} /> На главную
        </Link>
        <h1 className="text-3xl font-black text-white mb-6">Публичная оферта</h1>
        <div className="text-gray-400 space-y-4 text-sm leading-relaxed">
          <p>Настоящий документ является публичной офертой GSAcademy (далее — «Академия») на оказание физкультурно-оздоровительных услуг.</p>
          <h2 className="text-white font-bold mt-6">1. Предмет договора</h2>
          <p>Академия обязуется оказывать физкультурно-оздоровительные услуги (тренировки по единоборствам), а клиент обязуется оплачивать их в соответствии с действующим прейскурантом.</p>
          <h2 className="text-white font-bold mt-6">2. Стоимость услуг</h2>
          <p>Стоимость услуг определяется текущим прейскурантом Академии. Абонементы и разовые занятия оплачиваются в соответствии с ценами, указанными на сайте bjj59.ru.</p>
          <h2 className="text-white font-bold mt-6">3. Права и обязанности сторон</h2>
          <p>Академия обязуется предоставлять качественные тренировки согласно расписанию. Клиент обязуется соблюдать правила безопасности и внутренний распорядок Академии.</p>
          <h2 className="text-white font-bold mt-6">4. Контакты</h2>
          <p>г. Пермь, ул. Аркадия Гайдара 8б. Телефон: 8 (995) 865-42-44.</p>
        </div>
      </div>
    </div>
  );
}
