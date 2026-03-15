import { Suspense } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import ForWhom from "@/components/ForWhom";
import Directions from "@/components/Directions";
import Trainers from "@/components/Trainers";
import News from "@/components/News";

const Reviews = dynamic(() => import("@/components/Reviews"));
const Awards = dynamic(() => import("@/components/Awards"));
const Results = dynamic(() => import("@/components/Results"));
const Pricing = dynamic(() => import("@/components/Pricing"));
const FirstTraining = dynamic(() => import("@/components/FirstTraining"));
const WhyUs = dynamic(() => import("@/components/WhyUs"));
const CTA = dynamic(() => import("@/components/CTA"));

export default function Home() {
  return (
    <>
      <Hero />
      <ForWhom />
      <Directions />
      <Trainers />
      <div className="section-offscreen"><Reviews /></div>
      <div className="section-offscreen"><Awards /></div>
      <Suspense>
        <div className="section-offscreen"><News /></div>
      </Suspense>
      <div className="section-offscreen"><Results /></div>
      <div className="section-offscreen"><Pricing /></div>
      <div className="section-offscreen"><FirstTraining /></div>
      <div className="section-offscreen"><WhyUs /></div>
      <div className="section-offscreen"><CTA /></div>
    </>
  );
}
