import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TgLinkHandler from "@/components/TgLinkHandler";
import { ClientShells } from "@/components/ClientShells";
import ChatWidget from "@/components/ChatWidget";
import HideOnAdmin from "@/components/HideOnAdmin";
import { yearsInPerm } from "@/lib/academy";

// ← Замени на свой ID счётчика Яндекс.Метрики
const YM_ID = 44430424;

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "SportsActivityLocation"],
  "name": "GSAcademy",
  "url": "https://www.bjj59.ru",
  "telephone": "+79958654244",
  "priceRange": "₽₽",
  "image": "https://www.bjj59.ru/hero-poster.jpg",
  "description": "Академия единоборств в Перми — BJJ, ММА, бокс, грэпплинг для детей и взрослых.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ул. Аркадия Гайдара 8б",
    "addressLocality": "Пермь",
    "addressRegion": "Пермский край",
    "postalCode": "614000",
    "addressCountry": "RU"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 58.0105,
    "longitude": 56.2502
  },
  "openingHours": "Mo-Su 08:00-22:00",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "88"
  },
  "sameAs": [
    "https://vk.com/bjjperm59",
    "https://t.me/GSAcademy59"
  ]
};

const inter = localFont({
  src: [
    {
      path: "../public/fonts/inter-latin.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../public/fonts/inter-cyrillic.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bjj59.ru"),
  title: "GSAcademy — Единоборства в Перми | BJJ, ММА, Бокс",
  description: `Академия единоборств в Перми. BJJ, ММА, бокс для детей с 3 лет и взрослых. ${yearsInPerm()} лет, 513 учеников. Первое занятие бесплатно.`,
  keywords: ["академия единоборств Пермь", "BJJ Пермь", "ММА Пермь", "бокс Пермь", "грэпплинг Пермь", "GSAcademy", "джиу-джитсу Пермь"],
  alternates: {
    canonical: "https://www.bjj59.ru",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "GSAcademy — Академия единоборств в Перми",
    description: "Бразильское джиу-джитсу, ММА, бокс, грэпплинг для детей и взрослых в Перми. Первое занятие бесплатно!",
    url: "https://www.bjj59.ru",
    siteName: "GSAcademy",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/hero-poster.jpg",
        width: 1280,
        height: 720,
        alt: "GSAcademy — Академия единоборств в Перми",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GSAcademy — Академия единоборств в Перми",
    description: "Бразильское джиу-джитсу, ММА, бокс, грэпплинг для детей и взрослых в Перми.",
    images: ["/hero-poster.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <head>
        {/* JSON-LD структурированные данные */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/*
          Яндекс Метрика.

          `afterInteractive`, а не `lazyOnload`: последний ждёт полной
          загрузки страницы, а в hero лежит видео. Человек, пришедший с
          рекламы и ушедший через пару секунд, не успевал попасть в счётчик —
          визит оплачен, а в отчёте его нет, и данные Метрики расходились с
          данными Директа именно на самых дорогих быстрых отказах.
        */}
        <Script id="ym-init" strategy="afterInteractive">{`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
          ym(${YM_ID},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
          window.__YM_COUNTER_ID__ = ${YM_ID};
        `}</Script>
        <noscript>
          <div>
            <img src={`https://mc.yandex.ru/watch/${YM_ID}`} style={{position:"absolute",left:"-9999px"}} alt="" />
          </div>
        </noscript>
        <link rel="preload" as="image" href="/hero-poster.jpg" fetchPriority="high" />
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="preconnect" href="https://t.me" />
        <link rel="dns-prefetch" href="https://api.vk.com" />
      </head>
      <body className={`${inter.variable} antialiased min-h-screen bg-background text-foreground`} suppressHydrationWarning>
          <TgLinkHandler />
          <HideOnAdmin>
            <Navbar />
          </HideOnAdmin>
          <main className="pb-20 md:pb-0">{children}</main>
          <HideOnAdmin>
            <Footer />
            <ClientShells />
            <ChatWidget />
          </HideOnAdmin>
      </body>
    </html>
  );
}

