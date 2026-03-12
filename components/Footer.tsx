import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Instagram } from "lucide-react";

const directions = [
  { label: "Бразильское джиу-джитсу", href: "/bjj" },
  { label: "Бокс", href: "/boxing" },
  { label: "Грэпплинг", href: "/grappling" },
  { label: "ММА", href: "/mma" },
];

const legalLinks = [
  { label: "Политика конфиденциальности", href: "/privacy" },
  { label: "Публичная оферта", href: "/offer" },
  { label: "Согласие на обработку данных", href: "/consent" },
];

export default function Footer() {
  return (
    <footer id="contacts" className="bg-[#080808] border-t border-[#1e1e1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image src="/logo.png" alt="GS Academy" width={120} height={40} className="h-10 w-auto object-contain" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Академия единоборств в Перми. Профессиональные тренировки для детей и взрослых. Часть команды Alliance, 14-кратные чемпионы мира.
            </p>
            <div className="flex flex-col gap-3 mt-5">
              <a
                href="https://vk.com/bjjperm59"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#1e1e1e] hover:bg-blue-600/20 border border-[#2e2e2e] hover:border-blue-500/50 text-gray-200 hover:text-white rounded-2xl px-4 py-3 font-semibold text-sm transition-all group"
              >
                <span className="w-8 h-8 rounded-xl bg-blue-600/20 group-hover:bg-blue-600 flex items-center justify-center transition-all shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.188 1.341 1.26 2.14 1.816.605.421 1.064.329 1.064.329l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.268-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.115-.858-.009-1.585.003-1.996.208-.274.138-.485.445-.356.462.16.02.521.099.713.364.248.341.239 1.107.239 1.107s.142 2.11-.333 2.372c-.327.179-.776-.187-1.739-1.865-.493-.859-.866-1.812-.866-1.812s-.07-.176-.198-.271c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.161C3.94 8.176 4.043 8.5 4.043 8.5s1.793 4.261 3.821 6.408c1.861 1.972 3.977 1.841 3.977 1.841l.944-.012z"/>
                  </svg>
                </span>
                ВКонтакте
              </a>
              <a
                href={`https://t.me/GSAcademy59?text=${encodeURIComponent('Здравствуйте! Пишу с сайта gsacademy.ru')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#1e1e1e] hover:bg-blue-600/20 border border-[#2e2e2e] hover:border-blue-500/50 text-gray-200 hover:text-white rounded-2xl px-4 py-3 font-semibold text-sm transition-all group"
              >
                <span className="w-8 h-8 rounded-xl bg-blue-600/20 group-hover:bg-blue-600 flex items-center justify-center transition-all shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </span>
                Telegram
              </a>
            </div>
          </div>

          {/* Directions */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">Направления</h3>
            <ul className="space-y-2">
              {directions.map((d) => (
                <li key={d.href}>
                  <Link
                    href={d.href}
                    className="text-gray-400 hover:text-[#3B82F6] transition-colors text-sm"
                  >
                    {d.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin size={16} className="text-[#3B82F6] shrink-0 mt-0.5" />
                <span>г. Пермь, ул. Аркадия Гайдара 8б</span>
              </li>
              <li>
                <a
                  href="tel:+79958654244"
                  className="flex items-center gap-2 text-gray-400 hover:text-[#3B82F6] transition-colors text-sm"
                >
                  <Phone size={16} className="text-[#3B82F6] shrink-0" />
                  <span>8 (995) 865-42-44</span>
                </a>
              </li>
            </ul>
            <a
              href={`https://t.me/GSAcademy59?text=${encodeURIComponent('Здравствуйте! Пишу с сайта, хочу записаться')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-black font-bold py-2 px-5 rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              Записаться
            </a>
          </div>

          {/* Map */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">Мы на карте</h3>
            <div className="rounded-xl overflow-hidden border border-[#1e1e1e] aspect-video">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=56.29609%2C58.001796&z=17&pt=56.29609,58.001796,pm2rdm&l=map"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                title="Карта GSAcademy"
              />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-[#1e1e1e] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} GSAcademy. Все права защищены.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-gray-600 hover:text-[#3B82F6] text-xs transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
