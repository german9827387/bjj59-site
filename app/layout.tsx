import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GSAcademy — Академия единоборств в Перми | БЖЖ, ММА, Бокс",
  description:
    "GSAcademy — лучшая академия единоборств в Перми. Бразильское джиу-джитсу, ММА, бокс, тайский бокс, грэпплинг для детей и взрослых. Запишитесь на бесплатное первое занятие.",
  keywords: ["академия единоборств Пермь", "BJJ Пермь", "ММА Пермь", "бокс Пермь", "тайский бокс Пермь", "грэпплинг Пермь", "GSAcademy", "джиу-джитсу Пермь"],
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen bg-background text-foreground`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <MobileCTA />
      </body>
    </html>
  );
}

