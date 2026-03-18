import { Metadata } from "next";
import DirectionPage from "@/components/DirectionPage";

export const metadata: Metadata = {
  title: "Тайский бокс в Перми | GSAcademy — Муай-тай",
  description:
    "Муай-тай (тайский бокс) в Перми — GSAcademy. Тренировки для детей и взрослых. Первое занятие бесплатно!",
  keywords: [
    "тайский бокс Пермь",
    "муай-тай Пермь",
    "muay thai Пермь",
    "секция тайского бокса Пермь",
    "тайский бокс для детей Пермь",
    "тайский бокс для взрослых Пермь",
    "GSAcademy муай-тай",
  ],
  alternates: { canonical: "https://bjj59.ru/muaythai" },
  openGraph: {
    title: "Тайский бокс (Муай-тай) в Перми | GSAcademy",
    description:
      "Муай-тай в Перми — искусство восьми конечностей. Тренировки для детей и взрослых. Первое занятие бесплатно!",
    url: "https://bjj59.ru/muaythai",
    siteName: "GSAcademy",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/highkis.jpg",
        width: 1200,
        height: 630,
        alt: "Тайский бокс в Перми — GSAcademy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Тайский бокс (Муай-тай) в Перми | GSAcademy",
    description: "Муай-тай в Перми — искусство восьми конечностей. Первое занятие бесплатно!",
    images: ["/highkis.jpg"],
  },
};

export default function MuaythaiPage() {
  return (
    <DirectionPage
      title="Тайский бокс"
      subtitle="Муай-тай в Перми"
      tagline="ИСКУССТВО ВОСЬМИ КОНЕЧНОСТЕЙ"
      description="Муай-тай — национальное боевое искусство Таиланда, использующее удары руками, ногами, коленями и локтями. Один из самых эффективных и зрелищных видов ударных единоборств. Отличный выбор для кардио, самообороны и соревнований."
      reasons={[
        {
          title: "8 конечностей",
          desc: "Удары кулаками, ногами, коленями и локтями — полный арсенал ударной техники.",
        },
        {
          title: "Лучшее кардио",
          desc: "Тренировки по муай-тай сжигают калории и развивают сердечно-сосудистую систему.",
        },
        {
          title: "Эффективная самооборона",
          desc: "Техники тайского бокса очень практичны для реальных ситуаций.",
        },
        {
          title: "Зрелищный спорт",
          desc: "Муай-тай — один из самых популярных в мире видов единоборств с богатой историей.",
        },
      ]}
      emoji="🦵"
      image="/highkis.jpg"
      accent="#f59e0b"
    />
  );
}
