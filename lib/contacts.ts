/**
 * Ссылки на мессенджеры — одно место на весь сайт.
 *
 * Раньше Telegram был прописан в четырёх компонентах, и в одном из них —
 * плавающей кнопке на мобильном — стояла ссылка по номеру телефона на
 * другой аккаунт. Клиенты с компьютера и с телефона писали в разные чаты,
 * а подпись «[откуда пришёл клиент]» подставлялась только в первый.
 */
export const TG_HANDLE = "GSAcademy59";

export const TG_URL = `https://t.me/${TG_HANDLE}?text=${encodeURIComponent(
  "Здравствуйте! Пишу с сайта, хочу записаться на пробное занятие"
)}`;

export const MAX_URL =
  "https://max.ru/u/f9LHodD0cOLuAXIcg9-hGCKGfQUdnBrwUFaDAOL8u57Ecr8xdBN439inrnY";

export const PHONE_URL = "tel:+79958654244";
