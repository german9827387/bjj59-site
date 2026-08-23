import { Metadata } from "next";
import GiftCertificate from "@/components/GiftCertificate";

export const metadata: Metadata = {
  title: "Подарочный сертификат на тренировки в Перми | GSAcademy",
  description:
    "Подарочный сертификат на единоборства в Перми: джиу-джитсу, бокс, ММА. Для детей с 3 лет и взрослых с нуля. Оформим за 15 минут и пришлём в мессенджер.",
  keywords: [
    "подарочный сертификат на тренировки Пермь",
    "сертификат на единоборства Пермь",
    "подарить тренировки Пермь",
    "подарочный сертификат спортзал Пермь",
    "подарок на день рождения Пермь",
    "GSAcademy сертификат",
  ],
  alternates: { canonical: "https://www.bjj59.ru/gift" },
  openGraph: {
    title: "Подарочный сертификат на тренировки | GSAcademy",
    description:
      "Подарите не вещь, а другую жизнь: сертификат на единоборства в Перми. Дети с 3 лет и взрослые с нуля, действует 6 месяцев.",
    url: "https://www.bjj59.ru/gift",
    siteName: "GSAcademy",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/hero-poster.jpg",
        width: 1280,
        height: 720,
        alt: "Подарочный сертификат GSAcademy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Подарочный сертификат на тренировки | GSAcademy",
    description: "Сертификат на единоборства в Перми. Дети с 3 лет и взрослые с нуля.",
    images: ["/hero-poster.jpg"],
  },
};

export default function GiftPage() {
  return <GiftCertificate />;
}
