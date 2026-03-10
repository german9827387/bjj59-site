import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C9A84C] transition-colors text-sm mb-8">
          <ArrowLeft size={16} /> На главную
        </Link>
        <h1 className="text-3xl font-black text-white mb-6">Политика конфиденциальности</h1>
        <div className="prose prose-invert max-w-none text-gray-400 space-y-4 text-sm leading-relaxed">
          <p>Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта bjj59.ru (далее — «Сайт»), принадлежащего GSAcademy.</p>
          <h2 className="text-white font-bold mt-6">1. Сбор информации</h2>
          <p>Мы собираем информацию, которую вы предоставляете нам напрямую, например, при заполнении формы записи: имя, номер телефона, email.</p>
          <h2 className="text-white font-bold mt-6">2. Использование информации</h2>
          <p>Собранная информация используется для связи с вами по вопросам записи на тренировки, информирования об акциях и новостях академии.</p>
          <h2 className="text-white font-bold mt-6">3. Защита информации</h2>
          <p>Мы принимаем все необходимые меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.</p>
          <h2 className="text-white font-bold mt-6">4. Контакты</h2>
          <p>По всем вопросам, связанным с обработкой персональных данных, вы можете обратиться по телефону 8 (995) 865-42-44 или по адресу: г. Пермь, ул. Аркадия Гайдара 8б.</p>
        </div>
      </div>
    </div>
  );
}
