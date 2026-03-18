import { Suspense } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";

const ForWhom = dynamic(() => import("@/components/ForWhom"));
const Directions = dynamic(() => import("@/components/Directions"));
const Trainers = dynamic(() => import("@/components/Trainers"));
const GymGallery = dynamic(() => import("@/components/GymGallery"), { ssr: false });
const Reviews = dynamic(() => import("@/components/Reviews"));
const Awards = dynamic(() => import("@/components/Awards"));
const News = dynamic(() => import("@/components/News"));

// Глубоко в странице — SSR не нужен, убираем из гидратации
const Results = dynamic(() => import("@/components/Results"), { ssr: false });
const Pricing = dynamic(() => import("@/components/Pricing"), { ssr: false });
const FirstTraining = dynamic(() => import("@/components/FirstTraining"), { ssr: false });
const WhyUs = dynamic(() => import("@/components/WhyUs"), { ssr: false });
const FAQ = dynamic(() => import("@/components/FAQ"), { ssr: false });
const CTA = dynamic(() => import("@/components/CTA"), { ssr: false });

export default function Home() {
  return (
    <>
      <Hero />
      <div className="cv-auto"><ForWhom /></div>
      <div className="cv-auto"><Directions /></div>
      <div className="cv-auto"><Trainers /></div>
      <div className="cv-auto"><GymGallery /></div>
      <div className="cv-auto"><Reviews /></div>
      <div className="cv-auto"><Awards /></div>
      <div className="cv-auto">
        <Suspense>
          <News />
        </Suspense>
      </div>
      <div className="cv-auto"><Results /></div>
      <div className="cv-auto"><Pricing /></div>
      <div className="cv-auto"><FirstTraining /></div>
      <div className="cv-auto"><WhyUs /></div>
      <div className="cv-auto"><FAQ /></div>
      <div className="cv-auto"><CTA /></div>
    </>
  );
}
