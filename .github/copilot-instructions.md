# Контекст проекта BJJ59

> Этот файл — единственный источник правды для всех агентов. Обновляй секции при изменениях, НЕ добавляй новые записи в конец. Каждая секция отражает ТЕКУЩЕЕ состояние, а не историю.

## Проект

- **Сайт:** bjj59.ru (GSAcademy — академия единоборств в Перми)
- **Стек:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Деплой:** Vercel (auto-deploy из main)
- **Репо:** github.com/german9827387/bjj59-site

## Текущее состояние

### Рабочие фичи
- Лендинг: Hero, ForWhom, Directions, Trainers, Gallery, Reviews, Awards, News (VK), Results, Pricing, FirstTraining, WhyUs, FAQ, CTA, Contacts
- Страницы направлений: /bjj, /mma, /boxing, /grappling, /muaythai
- Расписание: /schedule (данные с внешнего API g-sacademy.vercel.app)
- Чат-бот (Алина): Groq LLM, автозапись лидов через маркер [ЛИДА|...]
- Формы заявок: LeadForm, LeadModal, ExitPopup → /api/lead → Telegram + Email (Resend)
- Админка: /admin (авторизация по паролю, редактирование данных)
- Метрика: Яндекс.Метрика 44430424

### Аналитика и трекинг
- **Цели Метрики:** lead_submit, tg_click, phone_click, vk_click, lead_form_open, chat_open
- **UTM:** сохраняются в sessionStorage, передаются во всех формах и чате
- **Источник заявки (source):** "Инлайн-форма", "Модальное окно", "Чат-консультант", ExitPopup (с деталями квиза)
- **Уведомления:** Telegram (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID), Email (RESEND_API_KEY, опционально)

### Безопасность
- CSP настроен: разрешены mc.yandex.ru (script, connect, img), api.vk.com (connect), userapi/vk-cdn/okcdn (img)
- Admin auth: HMAC-подписанные сессии, timing-safe сравнение пароля, rate limiting (in-memory)
- Security headers: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy

### Известные ограничения
- Admin API пишет JSON на диск (writeFileSync) — НЕ работает на Vercel (read-only FS). Данные редактируются через git
- Rate limiter in-memory — не персистентный между serverless инвокациями
- Resend email — fire-and-forget (без await)
- Счётчик "лет на рынке" не обновляется автоматически

## Дизайн-система

- **Тема:** тёмная
- **Фоны секций:** #0a0a0a, #0d1525, #0f1923, #060d1f (чередуются)
- **Акцент:** blue-600 → cyan-500 (градиент)
- **Текст:** white (заголовки), gray-400 (основной), gray-500 (вторичный)
- **Карточки:** bg-[#111] / bg-[#0f1923], border border-[#1e1e1e]
- **Скругления:** rounded-2xl (карточки), rounded-full (кнопки)
- **Шрифт:** Inter (local), font-black для заголовков
- **Иконки:** Lucide React
- **Анимации:** компонент Reveal, CSS transitions 200-300ms

## Целевая аудитория

- **Основная:** родители детей 3-13 лет (безопасность, дисциплина, развитие)
- **Вторичная:** взрослые 18-45 (форма, уверенность, антистресс)
- **Общее:** новички, боятся что будет сложно — нужно снимать страхи

## Контент — что нужно улучшить

- Hero заголовок: слишком описательный, не продающий
- Hero стат "90 парковочных мест" — не мотивирует на запись
- "Лучшая академия" в meta description — без доказательства
- DirectionPage: "14 лет опыта" и "500+ учеников" захардкожены, расходятся с Hero
- "Мы — первая академия в Перми" в WhyUs — заявление без доказательства
- FAQ вопрос "Не боитесь ли вы травм?" — неестественная формулировка
