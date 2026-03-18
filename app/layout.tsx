import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TgLinkHandler from "@/components/TgLinkHandler";
import { ClientShells } from "@/components/ClientShells";

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
  "url": "https://bjj59.ru",
  "telephone": "+79958654244",
  "priceRange": "₽₽",
  "image": "https://bjj59.ru/hero-poster.jpg",
  "description": "Академия единоборств в Перми — BJJ, ММА, бокс, тайский бокс, грэпплинг для детей и взрослых.",
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
  metadataBase: new URL("https://bjj59.ru"),
  title: "GSAcademy — Академия единоборств в Перми | БЖЖ, ММА, Бокс",
  description:
    "GSAcademy — лучшая академия единоборств в Перми. Бразильское джиу-джитсу, ММА, бокс, тайский бокс, грэпплинг для детей и взрослых. Запишитесь на бесплатное первое занятие.",
  keywords: ["академия единоборств Пермь", "BJJ Пермь", "ММА Пермь", "бокс Пермь", "тайский бокс Пермь", "грэпплинг Пермь", "GSAcademy", "джиу-джитсу Пермь"],
  alternates: {
    canonical: "https://bjj59.ru",
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
    description: "Бразильское джиу-джитсу, ММА, бокс, тайский бокс, грэпплинг для детей и взрослых в Перми. Первое занятие бесплатно!",
    url: "https://bjj59.ru",
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
    description: "Бразильское джиу-джитсу, ММА, бокс, тайский бокс, грэпплинг для детей и взрослых в Перми.",
    images: ["/hero-poster.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <head>
        {/* JSON-LD структурированные данные */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Яндекс Метрика */}
        <Script id="ym-init" strategy="lazyOnload">{`
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
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
      </head>
      <body className={`${inter.variable} antialiased min-h-screen bg-background text-foreground`}>
          <TgLinkHandler />
          <Navbar />
          <main className="pb-20 md:pb-0">{children}</main>
          <Footer />
          <ClientShells />
      </body>
    </html>
  );
}

