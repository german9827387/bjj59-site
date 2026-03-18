import { Metadata } from "next";
import DirectionPage from "@/components/DirectionPage";

export const metadata: Metadata = {
  title: "Бокс в Перми | GSAcademy",
  description:
    "Секция бокса в Перми — GSAcademy. Профессиональные тренеры, тренировки для детей и взрослых. Первое занятие бесплатно!",
  keywords: [
    "бокс Пермь",
    "секция бокса Пермь",
    "бокс для детей Пермь",
    "бокс для взрослых Пермь",
    "боксёрская секция Пермь",
    "GSAcademy бокс",
  ],
  alternates: { canonical: "https://bjj59.ru/boxing" },
  openGraph: {
    title: "Бокс в Перми | GSAcademy",
    description:
      "Секция бокса в Перми. Профессиональные тренеры, тренировки для детей и взрослых. Первое занятие бесплатно!",
    url: "https://bjj59.ru/boxing",
    siteName: "GSAcademy",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/boxing.jpg",
        width: 1200,
        height: 630,
        alt: "Бокс в Перми — GSAcademy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Бокс в Перми | GSAcademy",
    description: "Секция бокса в Перми. Первое занятие бесплатно!",
    images: ["/boxing.jpg"],
  },
};

export default function BoxingPage() {
  return (
    <DirectionPage
      title="Бокс"
      subtitle="в Перми"
      tagline="СКОРОСТЬ, РЕАКЦИЯ, ХАРАКТЕР"
      description="Классический бокс — один из самых популярных и эффективных видов единоборств. Развивает скорость, реакцию, координацию и выносливость. Отличный выбор для тех, кто хочет улучшить физическую форму, научиться самообороне и воспитать характер."
      reasons={[
        {
          title: "Физическая подготовка",
          desc: "Бокс — один из лучших видов спорта для развития всех физических качеств: силы, скорости, выносливости.",
        },
        {
          title: "Реакция и координация",
          desc: "Тренировки развивают быструю реакцию и точную координацию движений.",
        },
        {
          title: "Самооборона",
          desc: "Базовые навыки бокса эффективны в ситуациях реальной самообороны.",
        },
        {
          title: "Психология победителя",
          desc: "Бокс воспитывает дисциплину, стойкость и уверенность в себе.",
        },
      ]}
      emoji="🥊"
      image="/boxing.jpg"
      accent="#818cf8"
    />
  );
}
