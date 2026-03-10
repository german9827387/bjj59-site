import Link from "next/link";
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
    <footer className="bg-[#080808] border-t border-[#1e1e1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                <span className="text-black font-black text-sm">GS</span>
              </div>
              <div>
                <span className="text-white font-black text-lg tracking-tight">GS</span>
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text font-black text-lg tracking-tight">ACADEMY</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Академия единоборств в Перми. Профессиональные тренировки для детей и взрослых. Часть команды Alliance, 14-кратные чемпионы мира.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://vk.com/bjjperm59"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#1e1e1e] rounded-full flex items-center justify-center hover:bg-[#3B82F6] hover:text-black transition-all text-gray-400"
                aria-label="ВКонтакте"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.188 1.341 1.26 2.14 1.816.605.421 1.064.329 1.064.329l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.268-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.115-.858-.009-1.585.003-1.996.208-.274.138-.485.445-.356.462.16.02.521.099.713.364.248.341.239 1.107.239 1.107s.142 2.11-.333 2.372c-.327.179-.776-.187-1.739-1.865-.493-.859-.866-1.812-.866-1.812s-.07-.176-.198-.271c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.161C3.94 8.176 4.043 8.5 4.043 8.5s1.793 4.261 3.821 6.408c1.861 1.972 3.977 1.841 3.977 1.841l.944-.012z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/79958636285"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#1e1e1e] rounded-full flex items-center justify-center hover:bg-[#3B82F6] hover:text-black transition-all text-gray-400"
                aria-label="WhatsApp"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
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
                  href="tel:+79124906455"
                  className="flex items-center gap-2 text-gray-400 hover:text-[#3B82F6] transition-colors text-sm"
                >
                  <Phone size={16} className="text-[#3B82F6] shrink-0" />
                  <span>8 (995) 865-42-44</span>
                </a>
              </li>
            </ul>
            <a
              href="https://wa.me/79958636285?text=Здравствуйте! Хочу записаться на тренировку в GSAcademy"
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
                src="https://yandex.ru/map-widget/v1/?ll=56.256389%2C58.014444&z=16&pt=56.256389,58.014444,pm2rdm"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                title="Карта GSAcademy"
                className="grayscale"
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
