import { Suspense } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import SectionSeam from "@/components/SectionSeam";

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
      {/* Стыки секций. Приём выбирается по фонам — см. components/SectionSeam.tsx.
          У первого экрана растворение своё, встроенное, поэтому шва после него нет. */}
      <Hero />
      <ForWhom />
      <SectionSeam from="#0d1525" to="#0a0a0a" />
      <Directions />
      <SectionSeam from="#0a0a0a" to="#0a0a0a" />
      <GymGallery />
      {/* <Trainers /> — блок скрыт; при возврате вернуть и ссылку в navLinks (components/Navbar.tsx) */}
      <SectionSeam from="#0a0a0a" to="#0d1525" />
      <WhyUs />
      <SectionSeam from="#0d1525" to="#0a0a0a" />
      <Reviews />
      <SectionSeam from="#0a0a0a" to="#0d1525" />
      <LeadForm />
      <SectionSeam from="#0d1525" to="#0d1525" />
      <Pricing />
      <SectionSeam from="#0d1525" to="#0a0a0a" />
      <PersonalTraining />
      <SectionSeam from="#0a0a0a" to="#0d1525" />
      <FAQ />
      <SectionSeam from="#0d1525" to="#0a0a0a" />
      <CTA />
      <SectionSeam from="#0a0a0a" to="#0d1525" />
      <FirstTraining />
      <SectionSeam from="#0d1525" to="#0a0a0a" />
      <Awards />
      <SectionSeam from="#0a0a0a" to="#0d1525" />
      <Results />
      <SectionSeam from="#0d1525" to="#0a0a0a" />
      <Suspense>
        <News />
      </Suspense>
    </>
  );
}
