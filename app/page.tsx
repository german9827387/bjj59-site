import { Suspense } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";

const ForWhom = dynamic(() => import("@/components/ForWhom"));
const Directions = dynamic(() => import("@/components/Directions"));
const WhyUs = dynamic(() => import("@/components/WhyUs"));
const Reviews = dynamic(() => import("@/components/Reviews"));
const LeadForm = dynamic(() => import("@/components/LeadForm"));
const Pricing = dynamic(() => import("@/components/Pricing"));
const PersonalTraining = dynamic(() => import("@/components/PersonalTraining"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const CTA = dynamic(() => import("@/components/CTA"));
const FirstTraining = dynamic(() => import("@/components/FirstTraining"));
const GymGallery = dynamic(() => import("@/components/GymGallery"));
const Awards = dynamic(() => import("@/components/Awards"));
const Results = dynamic(() => import("@/components/Results"));
const News = dynamic(() => import("@/components/News"));

export default function Home() {
  return (
    <>
      <Hero />
      <ForWhom />
      <Directions />
      <GymGallery />
      {/* <Trainers /> — блок скрыт; при возврате вернуть и ссылку в navLinks (components/Navbar.tsx) */}
      <WhyUs />
      <Reviews />
      <LeadForm />
      <Pricing />
      <PersonalTraining />
      <FAQ />
      <CTA />
      <FirstTraining />
      <Awards />
      <Results />
      <Suspense>
        <News />
      </Suspense>
    </>
  );
}
