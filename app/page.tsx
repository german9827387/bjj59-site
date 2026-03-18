import { Suspense } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";

const ForWhom = dynamic(() => import("@/components/ForWhom"));
const Directions = dynamic(() => import("@/components/Directions"));
const Trainers = dynamic(() => import("@/components/Trainers"));
const GymGallery = dynamic(() => import("@/components/GymGallery"));
const Reviews = dynamic(() => import("@/components/Reviews"));
const Awards = dynamic(() => import("@/components/Awards"));
const News = dynamic(() => import("@/components/News"));
const Results = dynamic(() => import("@/components/Results"));
const Pricing = dynamic(() => import("@/components/Pricing"));
const FirstTraining = dynamic(() => import("@/components/FirstTraining"));
const WhyUs = dynamic(() => import("@/components/WhyUs"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const CTA = dynamic(() => import("@/components/CTA"));

export default function Home() {
  return (
    <>
      <Hero />
      <ForWhom />
      <Directions />
      <Trainers />
      <GymGallery />
      <Reviews />
      <Awards />
      <Suspense>
        <News />
      </Suspense>
      <Results />
      <Pricing />
      <FirstTraining />
      <WhyUs />
      <FAQ />
      <CTA />
    </>
  );
}
