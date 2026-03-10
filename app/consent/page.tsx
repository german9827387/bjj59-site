import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ConsentPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C9A84C] transition-colors text-sm mb-8">
          <ArrowLeft size={16} /> На главную
        </Link>
        <h1 className="text-3xl font-black text-white mb-6">Согласие на обработку персональных данных</h1>
        <div className="text-gray-400 space-y-4 text-sm leading-relaxed">
          <p>Я, субъект персональных данных, в соответствии с требованиями Федерального закона от 27.07.2006 г. № 152-ФЗ «О персональных данных», свободно, своей волей и в своём интересе даю согласие GSAcademy (г. Пермь, ул. Аркадия Гайдара 8б) на обработку своих персональных данных.</p>
          <h2 className="text-white font-bold mt-6">Перечень персональных данных</h2>
          <p>Фамилия, имя, отчество; номер телефона; адрес электронной почты.</p>
          <h2 className="text-white font-bold mt-6">Цели обработки</h2>
          <p>Запись на занятия; информирование об услугах Академии; обратная связь по вопросам тренировок.</p>
          <h2 className="text-white font-bold mt-6">Срок действия согласия</h2>
          <p>Настоящее согласие действует до его отзыва. Отзыв согласия осуществляется путём направления письменного заявления по адресу Академии или по телефону 8 (995) 865-42-44.</p>
        </div>
      </div>
    </div>
  );
}
